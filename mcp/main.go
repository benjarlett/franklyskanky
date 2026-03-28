package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"gopkg.in/natefinch/lumberjack.v2"
)

// MCPToolResponse represents MCP protocol tool response
type MCPToolResponse struct {
	Content []MCPContent `json:"content"`
	IsError bool         `json:"isError,omitempty"`
}

// MCPContent represents MCP content block
type MCPContent struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

// MCPServer handles MCP tool requests with direct DB access
type MCPServer struct {
	db *sql.DB
}

// NewMCPServer creates a new MCP server with database connection
func NewMCPServer(dbURL string) (*MCPServer, error) {
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &MCPServer{db: db}, nil
}

// Close closes the database connection
func (s *MCPServer) Close() error {
	return s.db.Close()
}

// ExecuteSQL executes a SQL query and returns results
func (s *MCPServer) ExecuteSQL(query string, allowWrites bool) *MCPToolResponse {
	trimmedQuery := strings.TrimSpace(strings.ToLower(query))

	// Check if it's a write operation
	isWrite := !strings.HasPrefix(trimmedQuery, "select")

	if isWrite && !allowWrites {
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: "Error: Write operations require allow_writes=true"}},
			IsError: true,
		}
	}

	if isWrite {
		// Execute write operation
		result, err := s.db.Exec(query)
		if err != nil {
			return &MCPToolResponse{
				Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("SQL Error: %v", err)}},
				IsError: true,
			}
		}

		rowsAffected, _ := result.RowsAffected()
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("Query executed successfully. Rows affected: %d", rowsAffected)}},
		}
	}

	// Execute SELECT query
	rows, err := s.db.Query(query)
	if err != nil {
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("SQL Error: %v", err)}},
			IsError: true,
		}
	}
	defer rows.Close()

	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("Error getting columns: %v", err)}},
			IsError: true,
		}
	}

	// Collect results
	var results []map[string]interface{}
	for rows.Next() {
		// Create a slice of interface{} to hold column values
		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))
		for i := range values {
			valuePtrs[i] = &values[i]
		}

		if err := rows.Scan(valuePtrs...); err != nil {
			continue
		}

		// Build row map
		row := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			// Handle common types
			switch v := val.(type) {
			case []byte:
				row[col] = string(v)
			case time.Time:
				row[col] = v.Format(time.RFC3339)
			default:
				row[col] = v
			}
		}
		results = append(results, row)
	}

	resultJSON, _ := json.MarshalIndent(results, "", "  ")
	return &MCPToolResponse{
		Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("Result: %s", string(resultJSON))}},
	}
}

// ListPages lists all pages
func (s *MCPServer) ListPages() *MCPToolResponse {
	return s.ExecuteSQL("SELECT slug, title, description, published, created_at, updated_at FROM page ORDER BY slug", false)
}

// GetPage gets a single page by slug
func (s *MCPServer) GetPage(slug string) *MCPToolResponse {
	return s.ExecuteSQL(fmt.Sprintf("SELECT * FROM page WHERE slug = '%s'", slug), false)
}

// UpdatePage updates a page's content
func (s *MCPServer) UpdatePage(slug, title, description, content string) *MCPToolResponse {
	query := fmt.Sprintf(`
		UPDATE page SET
			title = '%s',
			description = '%s',
			content = '%s',
			updated_at = NOW()
		WHERE slug = '%s'
	`, escapeSQL(title), escapeSQL(description), escapeSQL(content), escapeSQL(slug))

	return s.ExecuteSQL(query, true)
}

// CreatePage creates a new page
func (s *MCPServer) CreatePage(slug, title, description, content string) *MCPToolResponse {
	query := fmt.Sprintf(`
		INSERT INTO page (slug, title, description, content, published)
		VALUES ('%s', '%s', '%s', '%s', true)
	`, escapeSQL(slug), escapeSQL(title), escapeSQL(description), escapeSQL(content))

	return s.ExecuteSQL(query, true)
}

// DeletePage deletes a page
func (s *MCPServer) DeletePage(slug string) *MCPToolResponse {
	query := fmt.Sprintf("DELETE FROM page WHERE slug = '%s'", escapeSQL(slug))
	return s.ExecuteSQL(query, true)
}

// escapeSQL escapes single quotes for SQL
func escapeSQL(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}

// getToolList returns the list of available MCP tools
func (s *MCPServer) getToolList() []map[string]interface{} {
	return []map[string]interface{}{
		{
			"name":        "jj_sql",
			"description": "Execute SQL queries directly on the joejarlett.co.uk database",
			"inputSchema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"query": map[string]interface{}{
						"type":        "string",
						"description": "SQL query to execute",
					},
					"allow_writes": map[string]interface{}{
						"type":        "boolean",
						"description": "Allow INSERT/UPDATE/DELETE queries",
						"default":     false,
					},
				},
				"required": []string{"query"},
			},
		},
		{
			"name":        "jj_pages",
			"description": "Manage site pages (list, get, create, update, delete)",
			"inputSchema": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"action": map[string]interface{}{
						"type":        "string",
						"description": "Action: list, get, create, update, delete",
						"enum":        []string{"list", "get", "create", "update", "delete"},
					},
					"slug": map[string]interface{}{
						"type":        "string",
						"description": "Page slug (required for get, create, update, delete)",
					},
					"title": map[string]interface{}{
						"type":        "string",
						"description": "Page title (for create/update)",
					},
					"description": map[string]interface{}{
						"type":        "string",
						"description": "Page meta description (for create/update)",
					},
					"content": map[string]interface{}{
						"type":        "string",
						"description": "Page HTML content (for create/update)",
					},
				},
				"required": []string{"action"},
			},
		},
		{
			"name":        "jj_status",
			"description": "Get database connection status",
			"inputSchema": map[string]interface{}{
				"type":       "object",
				"properties": map[string]interface{}{},
			},
		},
	}
}

// handleToolCall processes MCP tool calls
func (s *MCPServer) handleToolCall(params map[string]interface{}) *MCPToolResponse {
	name, ok := params["name"].(string)
	if !ok {
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: "Error: tool name is required"}},
			IsError: true,
		}
	}

	args, _ := params["arguments"].(map[string]interface{})
	if args == nil {
		args = make(map[string]interface{})
	}

	switch name {
	case "jj_sql":
		query, _ := args["query"].(string)
		if query == "" {
			return &MCPToolResponse{
				Content: []MCPContent{{Type: "text", Text: "Error: query is required"}},
				IsError: true,
			}
		}
		allowWrites, _ := args["allow_writes"].(bool)
		return s.ExecuteSQL(query, allowWrites)

	case "jj_pages":
		action, _ := args["action"].(string)
		slug, _ := args["slug"].(string)
		title, _ := args["title"].(string)
		description, _ := args["description"].(string)
		content, _ := args["content"].(string)

		switch action {
		case "list":
			return s.ListPages()
		case "get":
			if slug == "" {
				return &MCPToolResponse{
					Content: []MCPContent{{Type: "text", Text: "Error: slug is required for get"}},
					IsError: true,
				}
			}
			return s.GetPage(slug)
		case "create":
			if slug == "" || title == "" || content == "" {
				return &MCPToolResponse{
					Content: []MCPContent{{Type: "text", Text: "Error: slug, title, and content are required for create"}},
					IsError: true,
				}
			}
			return s.CreatePage(slug, title, description, content)
		case "update":
			if slug == "" {
				return &MCPToolResponse{
					Content: []MCPContent{{Type: "text", Text: "Error: slug is required for update"}},
					IsError: true,
				}
			}
			return s.UpdatePage(slug, title, description, content)
		case "delete":
			if slug == "" {
				return &MCPToolResponse{
					Content: []MCPContent{{Type: "text", Text: "Error: slug is required for delete"}},
					IsError: true,
				}
			}
			return s.DeletePage(slug)
		default:
			return &MCPToolResponse{
				Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("Unknown action: %s", action)}},
				IsError: true,
			}
		}

	case "jj_status":
		if err := s.db.Ping(); err != nil {
			return &MCPToolResponse{
				Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("Database status: disconnected (%v)", err)}},
				IsError: true,
			}
		}
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: "Database status: connected\nTools: jj_sql, jj_pages, jj_status"}},
		}

	default:
		return &MCPToolResponse{
			Content: []MCPContent{{Type: "text", Text: fmt.Sprintf("Unknown tool: %s", name)}},
			IsError: true,
		}
	}
}

// handleStdioMCP handles MCP protocol communication over stdin/stdout
func (s *MCPServer) handleStdioMCP() {
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		line := scanner.Text()
		if len(strings.TrimSpace(line)) == 0 {
			continue
		}

		var request map[string]interface{}
		if err := json.Unmarshal([]byte(line), &request); err != nil {
			errorResponse := map[string]interface{}{
				"jsonrpc": "2.0",
				"error":   map[string]interface{}{"code": -32700, "message": "Parse error"},
			}
			if id, exists := request["id"]; exists {
				errorResponse["id"] = id
			}
			responseJSON, _ := json.Marshal(errorResponse)
			fmt.Println(string(responseJSON))
			continue
		}

		response := s.handleStdioRequest(request)
		responseJSON, _ := json.Marshal(response)
		fmt.Println(string(responseJSON))
	}
}

// handleStdioRequest processes a single MCP request
func (s *MCPServer) handleStdioRequest(request map[string]interface{}) map[string]interface{} {
	method, ok := request["method"].(string)
	if !ok {
		return map[string]interface{}{
			"jsonrpc": "2.0",
			"id":      request["id"],
			"error":   map[string]interface{}{"code": -32600, "message": "Invalid Request"},
		}
	}

	switch method {
	case "initialize":
		return map[string]interface{}{
			"jsonrpc": "2.0",
			"id":      request["id"],
			"result": map[string]interface{}{
				"protocolVersion": "2025-06-18",
				"capabilities":    map[string]interface{}{"tools": map[string]interface{}{}},
				"serverInfo":      map[string]interface{}{"name": "jj", "version": "1.0.0"},
			},
		}

	case "tools/list":
		return map[string]interface{}{
			"jsonrpc": "2.0",
			"id":      request["id"],
			"result":  map[string]interface{}{"tools": s.getToolList()},
		}

	case "tools/call":
		if params, ok := request["params"].(map[string]interface{}); ok {
			result := s.handleToolCall(params)
			return map[string]interface{}{
				"jsonrpc": "2.0",
				"id":      request["id"],
				"result":  result,
			}
		}
		return map[string]interface{}{
			"jsonrpc": "2.0",
			"id":      request["id"],
			"error":   map[string]interface{}{"code": -32602, "message": "Invalid params"},
		}

	default:
		return map[string]interface{}{
			"jsonrpc": "2.0",
			"id":      request["id"],
			"error":   map[string]interface{}{"code": -32601, "message": "Method not found"},
		}
	}
}

func setupLogging() {
	execPath, err := os.Executable()
	if err != nil {
		return
	}
	binaryDir := filepath.Dir(execPath)
	logsDir := filepath.Join(binaryDir, "logs")
	os.MkdirAll(logsDir, 0755)

	logFile := filepath.Join(logsDir, "jj-mcp.log")
	lumber := &lumberjack.Logger{
		Filename:   logFile,
		MaxSize:    10,
		MaxBackups: 5,
		MaxAge:     7,
		Compress:   true,
	}

	log.SetOutput(lumber)
	fmt.Fprintf(os.Stderr, "Logging to: %s\n", logFile)
}

func main() {
	// Load .env.local from parent directory of the executable
	execPath, err := os.Executable()
	if err == nil {
		binaryDir := filepath.Dir(execPath)
		envPath := filepath.Join(binaryDir, "..", ".env.local")
		if err := godotenv.Load(envPath); err != nil {
			log.Printf("Warning: Could not load %s: %v", envPath, err)
		}
	}

	setupLogging()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		fmt.Fprintln(os.Stderr, "Error: DATABASE_URL not set")
		os.Exit(1)
	}

	server, err := NewMCPServer(dbURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error connecting to database: %v\n", err)
		os.Exit(1)
	}
	defer server.Close()

	fmt.Fprintln(os.Stderr, "jj MCP Server ready (joejarlett.co.uk database)")
	fmt.Fprintln(os.Stderr, "Tools: jj_sql, jj_pages, jj_status")

	server.handleStdioMCP()
}
