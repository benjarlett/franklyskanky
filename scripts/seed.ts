import postgres from 'postgres';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const sql = postgres(DATABASE_URL);

const pages = [
	{
		slug: 'home',
		title: 'EdTech Psychologist',
		description:
			'Joe Jarlett is an EdTech Psychologist working at the intersection of psychology, education, and AI. Building tools for personal growth, resilience, and meaning through future-self thinking.',
		content: `
<h1>EdTech Psychologist</h1>

<blockquote><p>Are you striving to make sense of a rapidly changing world?</p></blockquote>

<blockquote><p>Do you find yourself seeking deeper connections—with yourself, your community, and the environment?</p></blockquote>

<p>Many of us are navigating these complex times, searching for ways to live more meaningful, purposeful lives.</p>

<p>My work sits at the intersection of <strong>psychology</strong>, <strong>education</strong>, <strong>AI</strong>, and <strong>future-self thinking</strong>, exploring how we can leverage these fields to foster individual and collective growth.</p>

<p>I'm passionate about creating tools and resources that empower us to become more resilient, adaptable, and compassionate. Through a blend of research, product development, and coaching, I aim to bridge the gap between cutting-edge technology and cultural wisdom, helping to build a future where both people and the planet can flourish together.</p>

<p>Drawing upon insights from fields like psychology, cognitive science, and psychosynthesis and combining them with experience in edTech business and AI, I offer unique perspectives and practical tools. It might be through developing innovative educational technologies, crafting AI systems that guiding individuals on their personal growth journeys.</p>

<p>I believe that by understanding ourselves better, our motivations, our values, and our potential, we can create positive change in our own lives and the world around us.</p>

<hr>

<div class="section">
  <img src="/img/future-self.webp" alt="Future-Self Thinking">
  <div class="section-content">
    <h3>Future-Self Thinking</h3>
    <p>Harnessing the power of future-self thinking to help individuals, communities and the environment connect with their aspirations, make more intentional choices, and build a more sustainable future.</p>
  </div>
</div>

<div class="section flip">
  <img src="/img/ai-for-good.webp" alt="AI for Good">
  <div class="section-content">
    <h3>AI for Good</h3>
    <p>Developing AI systems that enhance human capabilities, promote well-being, and address pressing social and environmental challenges. My work focuses on creating ethical, transparent, and human-centered AI solutions.</p>
  </div>
</div>

<div class="section">
  <img src="/img/education-innovation.webp" alt="Education Innovation">
  <div class="section-content">
    <h3>Education Innovation</h3>
    <p>Leveraging technology to transform education, making it more personalized, engaging, and effective. I'm particularly interested in how AI can be used to create adaptive learning experiences and foster critical thinking skills.</p>
  </div>
</div>

<div class="section flip">
  <img src="/img/grounding-psychology.webp" alt="Grounding Psychology">
  <div class="section-content">
    <h3>Grounding Psychology</h3>
    <p>Integrating insights from various psychological disciplines to offer coaching, workshops, and resources that empower individuals to overcome challenges, cultivate resilience, and live more fulfilling lives.</p>
  </div>
</div>

<div class="links">
  <a href="/services">Explore My Services</a>
  <a href="/projects">Get Started</a>
  <a href="/research">Discover My Research</a>
</div>

<hr>

<h2>Featured Product</h2>

<div class="section flip">
  <img src="/img/grounded-ninja.webp" alt="Grounded Ninja">
  <div class="section-content">
    <h3>Grounded Ninja</h3>
    <p><em>A Dojo for the Mind—Where Philosophy Meets Practice</em></p>
    <p>What if your journal became a dialogue with the wisest parts of yourself? Grounded Ninja bridges the gap between the wisdom you consume and your lived experience. Through an integrated practice of reflection (Mirror), direction (Compass), and action (Dojo), you can engage with AI Sages who remember your entire journey. This is not generic advice—it's wisdom that knows YOUR journey. A space for thoughtful individuals who read philosophy and psychology but struggle to apply it to daily life.</p>
    <div class="links">
      <a href="https://grounded.ninja">Visit Grounded Ninja</a>
      <a href="/projects">Learn More</a>
    </div>
  </div>
</div>

<hr>

<h2>Featured Research</h2>

<div class="section flip">
  <img src="/img/future-self.webp" alt="Future-Self Visualisation Research">
  <div class="section-content">
    <h3>Future-Self Visualisation and Environmental Intentions</h3>
    <p>This research explores the potential of future-self visualisation exercises to strengthen psychological connectedness with one's future identity. The study investigates how these interventions affect pro-environmental attitudes and intentions, with a focus on actionable outcomes for sustainability. Key findings suggest that even brief visualisation techniques can significantly enhance future-self continuity and indirectly influence environmental intentions. This innovative work highlights the intersection of cognitive psychology and ecological responsibility, paving the way for scalable interventions to combat climate inertia.</p>
    <div class="links">
      <a href="/research">Discover My Research</a>
    </div>
  </div>
</div>

<hr>

<h2>Skills & Awards</h2>

<h3>Professional Skills</h3>
<p>Director • CTO • Senior Management • Product Owner • Agile Leadership</p>

<h3>Technical Proficiencies</h3>
<p>ES6/TypeScript • Python • Go • PHP • C++ • Svelte • UX/UI • SCORM/cmi5 • AI • Pydantic/FastAPI • Postgres • Graph/NoSQL • AWS/Google Cloud • Docker</p>

<h3>Music & Audio</h3>
<p>A/V Engineering • Musician • Acoustics Engineering</p>

<h3>Psychology & Philosophy</h3>
<p>Psychosynthesis • Cognitive Science • Life Coaching</p>

<h3>Education & Awards</h3>
<ul>
  <li>MSc Psychological Sciences (Brunel University)</li>
  <li>Psychosynthesis Diploma</li>
  <li>Nimble: Business Award (2017)</li>
  <li>Nimble: Stroud Business Award (2017)</li>
  <li>Senior Management Training Programme</li>
  <li>MA Creative Music Technology (Bath Spa University)</li>
  <li>BSc Music, Acoustics & Recording (Salford University)</li>
</ul>

<div class="links">
  <a href="/about">About Me →</a>
</div>
`.trim()
	},
	{
		slug: 'about',
		title: 'Who am I...?',
		description:
			'Meet Joe Jarlett - an EdTech Psychologist with a background in depth psychology, psychosynthesis, and cognitive science. Currently building Grounded Ninja, a tool for integrating wisdom into daily life.',
		content: `
<h1>Who am I...?</h1>

<blockquote><p>My journey to the confluence of psychology, technology, and education has been anything but linear.</p></blockquote>

<p>It began with a fascination for the influence of media, from creating immersive soundscapes as a musician and technician to building interactive learning platforms as an edtech entrepreneur. Along the way, I witnessed firsthand how technology could shape experiences, influence behaviour, and unlock human potential. Founding and leading a tech business further fueled this interest, highlighting the importance of understanding not just the 'what' of technology but the 'how' and the 'why.' This drive to delve deeper into the human element led me to an MSc in Psychological Sciences and ongoing research into how AI can be used to foster self-awareness, resilience, and personal relevance realising.</p>

<p>Each step, from the stage to the boardroom to the lab, has reinforced my belief that technology's true power lies in its ability to attune to aspirations and environmental benefits. Today, I'm particularly excited about the potential of AI to not just deliver information but to help us understand ourselves better and unlock our full potential to better fit ourselves and, in turn, the environment.</p>

<hr>

<h2>A Unifying Vision</h2>

<p>My approach is deeply rooted in a holistic understanding of human experience, drawing upon insights from psychology, psychosynthesis, and my own journey of self-discovery. I'm fascinated by the dance between our conscious and unconscious processes, between our individual experiences and the collective wisdom we share. This perspective informs all of my work, whether designing AI-powered learning tools, coaching individuals towards greater self-awareness, or simply exploring the big questions about what it means to be human in a rapidly changing world. A key concept of this exploration is how we make sense of the world around us. What are the mental processes that determine the things we pay attention to, what we come to believe, and the actions we take? Answering these questions is fundamental to building technology that supports us in living more meaningful lives.</p>

<p>Recently, a focus on graph-based knowledge structures and virtualised human memory has opened new horizons in personalised, AI-assisted learning. I am driven to pursue this line of enquiry by a deeply-held belief that technology, when used carefully, can be a powerful force for good in the world. In particular, I see huge potential for AI to help us learn, grow, and connect with each other in new and meaningful ways.</p>

<hr>

<h2>Current Focus</h2>

<h3>Building Grounded Ninja: A Dojo for the Mind</h3>

<p>My current work centres on developing Grounded Ninja, a space for integrating philosophical and psychological wisdom into daily practice. This product bridges the gap between the books we read and the lives we live, creating an integrated system where reflection, direction, and action are in continuous dialogue. Through AI Sages who remember your journey and evidence-based psychological exercises, Grounded Ninja serves thoughtful individuals who value depth and meaning over productivity hacks. This work draws on my research into GraphRAG, AI memory, and the principles that truly support human flourishing—not just performance optimization.</p>

<h3>Reducing the barrier to understanding</h3>

<p>I'm currently developing a YouTube channel as a way to share my explorations and connect with others who are passionate about these topics. Through this platform, I'll be delving into the psychological principles that underpin effective learning, showcasing innovative AI tools, and exploring the philosophical implications of this rapidly evolving field. I'll also be highlighting some of my own products and research, including a journaling app designed to foster self-reflection and a unique 'meta-business' concept aimed at helping individuals navigate their personal and professional lives with greater clarity and purpose.</p>

<h3>Life Coaching: A Path to Self-Discovery and Personal Growth</h3>

<p>In parallel with my research and development work, I offer life coaching services grounded in the principles of psychosynthesis. This approach recognises that we are all complex beings, with a multitude of inner voices and potentials. Through coaching, I help individuals connect with their deeper selves, navigate challenges, and align their actions with their values.</p>

<p>My concept of 'meta-business' encourages individuals to view themselves as a business entity. In this framework, you become the primary customer, with the goal of identifying and providing solutions to your personal challenges. By integrating business principles into personal growth, individuals can achieve enhanced clarity, establish significant goals, and tackle obstacles more efficiently.</p>

<hr>

<h2>Bridging the Past & Present</h2>

<p>My background in music and technical arts may seem unconventional for someone working in AI and education. However, I've found that the creative mindset, the ability to improvise, and the focus on user experience that I honed in those fields are invaluable in my current work. Just as a musician strives to create a harmonious and engaging performance, I strive to create learning experiences and personal development tools that are relatable, effective, and inspiring. The common thread throughout my journey has been a deep curiosity about human relating and a desire to create experiences that connect, resonate, and empower.</p>

<h2>Historical Narrative</h2>

<h3>Early Years - Music, Technology, and the Seeds of Innovation</h3>
<ul>
  <li>Studied acoustics and sociology in Manchester; moved to Bristol for the creativity it offered.</li>
  <li>Provided music performance and technician support across multiple genres (gypsy-jazz, jungle-swing, electronica).</li>
  <li>Earned a distinction in master's-level creative audio/visual art (MaxMSP), refining a knack for software design.</li>
</ul>

<h3>Venturing into Education - Co-founding Nimble Elearning Ltd</h3>
<ul>
  <li>Co-founded and co-directed Nimble, an online learning company for a diverse range of small to large companies.</li>
  <li>Led teams as a CTO and product owner, adopting agile methodologies, fostering cross-functional collaboration, and refining UI/UX for educational platforms.</li>
</ul>

<h3>A Deeper Dive into Human Experience - Psychology and Psychosynthesis</h3>
<ul>
  <li>Returned to academia, completing an MSc in Psychological Sciences and psychosynthesis training.</li>
  <li>Combined prior business expertise with a holistic, people-centric perspective—yielding new solutions for well-being, growth, and social responsibility.</li>
</ul>

<hr>

<h2>Skills & Awards</h2>

<h3>Professional Skills</h3>
<p>Director • CTO • Senior Management • Product Owner • Agile Leadership</p>

<h3>Technical Proficiencies</h3>
<p>ES6/TypeScript • Python • Go • PHP • C++ • Svelte • UX/UI • SCORM/cmi5 • AI • Pydantic/FastAPI • Postgres • Graph/NoSQL • AWS/Google Cloud • Docker</p>

<h3>Music & Audio</h3>
<p>A/V Engineering • Musician • Acoustics Engineering</p>

<h3>Psychology & Philosophy</h3>
<p>Psychosynthesis • Cognitive Science • Life Coaching</p>

<h3>Education & Awards</h3>
<ul>
  <li>MSc Psychological Sciences (Brunel University)</li>
  <li>Psychosynthesis Diploma</li>
  <li>Nimble: Business Award (2017)</li>
  <li>Nimble: Stroud Business Award (2017)</li>
  <li>Senior Management Training Programme</li>
  <li>MA Creative Music Technology (Bath Spa University)</li>
  <li>BSc Music, Acoustics & Recording (Salford University)</li>
</ul>

<div class="links">
  <a href="/services">Services →</a>
</div>
`.trim()
	},
	{
		slug: 'services',
		title: 'The Best is Done Together',
		description:
			'Consulting services bridging technology and psychology. AI product design, educational technology consulting, coaching, and workshops for organisations seeking human-centred innovation.',
		content: `
<h1>The Best is Done Together</h1>

<p>I believe that the most powerful solutions emerge at the intersection of cutting-edge technology, a deep understanding of human psychology, and a commitment to fostering personal and professional growth. My services are designed to help individuals and organizations navigate this intersection, unlocking new possibilities and achieving meaningful results. Whether you're seeking to push the boundaries of AI research, develop innovative products, or embark on a journey of personal transformation, I offer a unique blend of expertise and a collaborative approach to help you succeed. I bring a unique perspective that bridges the technical and the human, the analytical and the intuitive. My approach is always tailored to your specific needs, ensuring that we're not just solving problems, but also creating opportunities for growth, innovation, and lasting impact.</p>

<h2>Collaborative Research: Exploring the Frontiers of AI and Human Understanding</h2>

<blockquote><p>Are you seeking to unravel complex questions at the intersection of AI, cognitive science, and human behavior?</p></blockquote>

<p>My background in psychological research, combined with my passion for exploring the frontiers of artificial intelligence, makes me an ideal partner for research endeavors. With a solid foundation in research methodologies from my MSc in Psychological Sciences, I bring both rigor and creativity to the research process. I am eager to contribute my skills in experimental design, data analysis, and insightful interpretation to projects that push the boundaries of knowledge.</p>

<p>I'm particularly interested in collaborations that explore:</p>
<ul>
  <li>The application of AI to enhance learning, creativity, and well-being.</li>
  <li>The ethical implications of AI development and deployment.</li>
  <li>The interplay between human cognition and artificial intelligence.</li>
  <li>The development of AI systems that promote human flourishing.</li>
</ul>

<p>I'm open to exploring new research avenues and contributing to projects that align with my passion for understanding the human mind and leveraging technology for good. Let's collaborate to uncover new insights and create knowledge that benefits individuals and society as a whole. My approach is exploratory yet grounded in evidence-based methodologies. I value collaboration and believe that the best research emerges from diverse perspectives working together.</p>

<hr>

<h2>Knowledge-Based AI Lab: Innovating at the Intersection of AI and Psychology</h2>

<blockquote><p>My Knowledge-Based AI LLM Lab is dedicated to pushing the boundaries of what's possible with artificial intelligence, particularly in creating systems that support human understanding and flourishing.</p></blockquote>

<p>I'm exploring how advanced AI architectures can bridge the gap between abstract knowledge and lived experience, creating tools that are both technically sophisticated and deeply human-centered.</p>

<h3>Current Focus Areas</h3>

<div class="section">
  <img src="/services/img/graph-systems.webp" alt="GraphRAG Systems">
  <div class="section-content">
    <h3>Retrieval-Augmented Generation (RAG) and Graph-Based Knowledge Systems</h3>
    <p>Investigating how these technologies can be applied to create AI systems with persistent memory and contextual understanding, enabling meaningful dialogue that remembers and builds on previous interactions.</p>
  </div>
</div>

<div class="section">
  <img src="/services/img/chatbot-classroom.webp" alt="AI Chatbots">
  <div class="section-content">
    <h3>AI-Driven Chatbots and Interactive Modules</h3>
    <p>Designing conversational agents and interactive learning tools that foster critical thinking, personalize learning experiences, and enhance engagement.</p>
  </div>
</div>

<div class="section">
  <img src="/services/img/pilot-studies.webp" alt="Pilot Studies">
  <div class="section-content">
    <h3>Pilot Studies for Early Adopters</h3>
    <p>Partnering with forward-thinking organizations to implement and evaluate AI solutions, including workflow automation and educational analytics, to drive innovation and efficiency.</p>
  </div>
</div>

<p>Whether you're looking to develop a cutting-edge AI product, explore new applications of AI in your field, or simply understand the potential of these technologies, my lab offers the expertise and collaborative spirit to bring your vision to life. We are committed to developing AI that not only performs tasks but also enhances human capabilities and understanding.</p>

<hr>

<h2>Product Consultation and Development: From Concept to Launch</h2>

<blockquote><p>With a background spanning directorial leadership, CTO roles, and hands-on product development, I offer comprehensive guidance across the entire product lifecycle.</p></blockquote>

<p>My expertise in both the technical and psychological aspects of product development allows me to bridge the gap between innovative ideas and successful market launches. I combine technical expertise with a deep understanding of user psychology to help you create products that are not only functional but also engaging, intuitive, and impactful.</p>

<h3>Areas of Expertise</h3>
<ul>
  <li><strong>Technology Strategy and Implementation</strong> — Guiding clients through AWS/Google Cloud deployments, advanced UX design principles, SCORM/cmi5 integration for educational products, and robust data analytics frameworks.</li>
  <li><strong>Agile Project Leadership</strong> — Leading teams through all stages of development, from feasibility assessments and prototyping to full-scale product launches and iterative improvement.</li>
  <li><strong>Bridging Psychology and Technology</strong> — Helping teams integrate insights from psychological science into the design and development process, creating products that resonate with users on a deeper level.</li>
  <li><strong>Innovation and Feasibility</strong> — Assessing the feasibility of new product ideas, identifying potential challenges, and developing innovative solutions that meet real user needs.</li>
  <li><strong>User-Centered Design</strong> — Applying principles of user-centered design to create products that are intuitive, engaging, and meet the needs of your target audience.</li>
  <li><strong>Market Positioning and Launch</strong> — Developing strategies for effectively positioning and launching your product in the market, maximizing its impact and reach.</li>
</ul>

<p>I'm passionate about helping individuals and organizations bring their innovative ideas to life, creating products that not only meet business objectives but also make a positive impact on the world.</p>

<hr>

<h2>Life Coaching</h2>
<p><em>Navigating the Path to a Meaningful Life</em></p>

<blockquote><p>In my life coaching practice, I offer a unique approach grounded in psychosynthesis, a holistic and transformative framework that recognises the inherent potential within each individual.</p></blockquote>

<p>I integrate principles from cognitive and developmental psychology with reflective practices to create a supportive and empowering space for personal growth. My coaching philosophy is centered around empowering you to connect with your inner wisdom, navigate challenges with resilience, and create a life that is both meaningful and fulfilling.</p>

<h3>My Approach</h3>
<ul>
  <li><strong>Psychosynthesis-Based</strong> — I view each individual as a unique and evolving whole, with a multitude of inner resources waiting to be discovered.</li>
  <li><strong>Integrative</strong> — My approach combines insights from various psychological disciplines with mindfulness and other reflective practices to foster holistic growth.</li>
  <li><strong>Personalized</strong> — I offer one-on-one sessions, both in-person and online, tailored to your specific needs, goals, and aspirations.</li>
  <li><strong>Focus on Mindset and Self-Efficacy</strong> — I help you identify and shift limiting beliefs, cultivate a growth mindset, and develop the self-efficacy needed to achieve your goals.</li>
</ul>

<p>Whether you're an entrepreneur, a creative professional, or simply someone seeking greater clarity, resilience, and purpose in life, my coaching services can help you unlock your potential and create the life you desire. I specialize in helping individuals navigate transitions, overcome obstacles, and align their actions with their deepest values. I am also particularly interested in helping those in the technology sector to find balance and purpose in their personal and professional lives.</p>

<hr>

<h2>Let's Connect</h2>

<p>I'm always open to exploring new collaborations and opportunities to make a positive impact. If you're interested in any of these services or have an idea you'd like to discuss, please don't hesitate to reach out. I am available to connect to explore how we might work together. Together, we can create something truly extraordinary.</p>

<div class="links">
  <a href="/contact">Contact Me</a>
  <a href="/projects">Projects →</a>
</div>
`.trim()
	},
	{
		slug: 'projects',
		title: 'Tools for You',
		description:
			'Discover Grounded Ninja and other AI-powered tools for personal growth, resilience, and meaning. Products that bridge philosophy, psychology, and technology to help integrate wisdom into daily life.',
		content: `
<h1>Tools for You</h1>

<p>At the heart of my work is a deep-seated belief in the power of technology to bridge the gap between wisdom and lived experience. The products I develop are not just tools; they are spaces for practice, designed to help people integrate philosophical and psychological insights into their daily lives. Drawing upon depth psychology, philosophy, and advanced AI, I create products that honor the complexity of human experience.</p>

<p>Here is my current project:</p>

<hr>

<div class="section">
  <img src="/projects/grounded-ninja.webp" alt="Grounded Ninja">
  <div class="section-content">
    <h2>Grounded Ninja</h2>
    <blockquote><p>A Dojo for the Mind—Where Philosophy Meets Practice</p></blockquote>
  </div>
</div>

<p>What if your journal became a dialogue with the wisest parts of yourself? What if the books you read on Stoicism, depth psychology, and philosophy could connect directly to your lived experience?</p>

<p>Grounded Ninja is a space for the practice of knowing oneself. It's designed for thoughtful individuals who value philosophy, psychology, and meaning—people who read widely but struggle to apply wisdom to their daily lives. We call them "Reflective Practitioners."</p>

<p>Most of us experience a gap between the wisdom we consume and our concrete, everyday thoughts and actions. Journaling feels shallow. AI assistants are forgetful and generic. Our reflective self, directional self, and active self are rarely in conversation.</p>

<p>Grounded Ninja integrates these fragmented parts through a continuous practice.</p>

<h3>The Integrated Core Loop</h3>

<p>At the heart of Grounded Ninja is a system inspired by the "zoom out, zoom in" practice:</p>

<ul>
  <li><strong>Mirror (Reflect)</strong> — A space to zoom out and observe your thoughts. Capture journals, crystallize insights, and use the Breaking Frame exercise (rooted in CBT) to reveal the cognitive patterns that hold you back.</li>
  <li><strong>Compass (Direct)</strong> — A space to connect with what matters. Clarify your values, explore your ikigai, and articulate aspirations that feel authentically possible—not borrowed from what you 'should' want.</li>
  <li><strong>Dojo (Act)</strong> — A space to zoom in and engage in daily practice. Build habits, complete meaningful tasks, and assess your life balance. This is where insight becomes embodied action.</li>
</ul>

<p>Everything connects. A journal can inspire a value, which creates a practice, which generates new insights. This integration is what makes Grounded Ninja unique.</p>

<h3>The Soul: Sage Dialogue</h3>

<p>This is the heart of the experience. Engage in meaningful dialogue with AI Sages—Carl Jung, Marcus Aurelius, Bell Hooks, and others—who act as wise companions on your journey.</p>

<p>Unlike generic chatbots, these Sages remember your entire journey. They cite your journals, reference your values, and understand your aspirations. This is not advice from nowhere—it's wisdom that knows YOUR journey.</p>

<p>The magic moment? When you complete the loop: a Mirror exercise reveals a difficult pattern, you discuss it with a Sage who references your core values, and this dialogue inspires a new daily Practice. This is what we mean by grounded—everything is connected to your lived experience.</p>

<h3>Psychological & Philosophical Foundations</h3>

<p>We ground our work in evidence-based psychology (CBT, ACT, depth psychology) and timeless philosophy (Stoicism, existentialism, phenomenology). We embrace two core principles:</p>

<p><strong>The Relational Self:</strong> You exist in context—relationships, career, environment, culture. Self-knowledge is inseparable from understanding your relationship with the world.</p>

<p><strong>Felt Authenticity:</strong> Change requires that it feels real to you. We honor what you actually feel, not what you "should" feel. Your values must be believable, your practices doable, your reflections genuine.</p>

<h3>Stage of Development</h3>
<p>Currently under active development, with the core loop integration as our primary focus.</p>

<h3>Who It's For</h3>
<p>Grounded Ninja is for you if you:</p>
<ul>
  <li>Read philosophy, psychology, or self-help but struggle to apply it</li>
  <li>Journal but feel it's disconnected or shallow</li>
  <li>Use ChatGPT but it forgets everything</li>
  <li>Seek meaning and integration, not just productivity</li>
  <li>Want a space for serious, playful practice</li>
</ul>

<h3>Our Commitment</h3>
<p>We are product-led, not market-led. We prioritize integrity over growth, depth over breadth, and integration over feature bloat. This is a practice for thoughtful seekers, not a viral productivity hack.</p>

<div class="links">
  <a href="https://grounded.ninja">Visit Grounded Ninja</a>
  <a href="/contact">Contact Me</a>
</div>

<hr>

<div class="section">
  <img src="/projects/meta-me.webp" alt="Meta-Me">
  <div class="section-content">
    <h2>Future Experimental Product: Meta-Me</h2>
    <p><em>Your Personal Business Coach — Optimizing Your Most Important Enterprise: You</em></p>
  </div>
</div>

<p>Building on my ongoing research into GraphRAG, AI memory, and the principles of human flourishing, I'm excited to share a vision for a future experimental product: Meta-Me. This AI-powered system is designed to be your strategic partner in personal and professional growth, applying the rigor of business principles to the enterprise of your life.</p>

<p>Imagine having a dedicated business consultant, but instead of optimizing a company, their sole focus is on helping you thrive. That's the core idea behind Meta-Me. It's an AI companion that empowers you to treat yourself as your most important client, applying proven business strategies to achieve your personal and professional goals.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>You, Inc.</strong> — Meta-Me embraces the philosophy that your life is your most vital enterprise. It's about taking ownership, setting strategic objectives, and managing your resources—time, energy, skills, and well-being—with the same care and intentionality that a successful CEO brings to their company.</li>
  <li><strong>Your AI Business Advisor</strong> — At the heart of Meta-Me is a sophisticated AI, built upon my research into GraphRAG and advanced memory models. This allows Meta-Me to function as your personal business consultant, analyzing your strengths and weaknesses, identifying opportunities for growth, and providing data-driven recommendations tailored to your unique situation.</li>
  <li><strong>Holistic Optimization</strong> — Meta-Me understands that true success is multifaceted. It goes beyond traditional productivity metrics, integrating insights from psychology, cognitive science, mindfulness, and other disciplines to help you optimize not just your performance but also your well-being, relationships, and overall life satisfaction.</li>
</ul>

<h3>Features</h3>
<ul>
  <li><strong>Strategic Life Planning</strong> — Meta-Me helps you define your personal and professional vision, set strategic goals aligned with your values, and develop a roadmap for achieving them.</li>
  <li><strong>Performance Analysis & Feedback</strong> — Through advanced analytics and natural language processing, Meta-Me provides objective insights into your performance across various life domains.</li>
  <li><strong>Resource Allocation & Optimization</strong> — Meta-Me helps you manage your most precious resources—time, energy, focus, and finances—more effectively.</li>
  <li><strong>Personalized Growth Strategies</strong> — Based on your unique profile, Meta-Me recommends tailored strategies for personal and professional development.</li>
  <li><strong>Risk Management & Resilience</strong> — Meta-Me helps you anticipate and prepare for challenges, develop contingency plans, and build the resilience needed to navigate life's inevitable ups and downs.</li>
</ul>

<h3>Stage of Development</h3>
<p>Currently an experimental concept.</p>

<h3>Future Vision</h3>
<p>Meta-Me is currently an experimental concept, representing a long-term vision for how AI can empower us to live more intentional, fulfilling lives. It's an invitation to imagine a future where we approach personal growth with the same strategic rigor and data-driven insights that we apply to successful businesses.</p>

<p>By sharing this vision, I hope to spark dialogue, inspire collaboration, and explore the exciting possibilities that lie at the intersection of AI and human flourishing. I believe that Meta-Me has the potential to revolutionize self-management, making it more effective, personalized, and empowering than ever before.</p>

<div class="links">
  <a href="/contact">Contact Me</a>
  <a href="/research">Research →</a>
</div>
`.trim()
	},
	{
		slug: 'research',
		title: 'Forever Learning',
		description:
			'Research exploring future-self visualisation, environmental psychology, AI memory systems, and the psychology of personal growth. Academic work informing practical applications.',
		content: `
<h1>Forever Learning</h1>

<h2>Current Research: Weaving Knowledge, Memory, and Identity with AI</h2>

<p>I'm currently immersed in a new and exciting area of research that bridges the power of graph databases, the flexibility of Retrieval-Augmented Generation (RAG), and advanced AI memory management techniques. The aspiration is to create personalised chatbot systems that not only provide information but also facilitate deeper self-understanding and personal grounding.</p>

<p>At its core, this research explores how we can use AI to help individuals make sense of their lives—their achievements, challenges, and future aspirations. By combining the strengths of sophisticated LLMs and memory models, we can create systems that engage in meaningful, context-aware conversations. Imagine a chatbot that not only remembers your past experiences but also helps you connect them to your present aspirations and future possibilities.</p>

<p>This work leverages cutting-edge technologies like pydantic.ai for AI agent handling and Neo4j for representing complex relationships within knowledge graphs, all brought together through a user-friendly SvelteKit interface.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>GraphRAG</strong> — This approach combines the strengths of graph databases, which excel at representing interconnected data, with RAG's ability to retrieve and synthesize information from diverse sources. This allows for more nuanced and contextually relevant responses in chatbot interactions.</li>
  <li><strong>AI Memory Management</strong> — Inspired by human cognitive processes, this research explores different types of AI memory, including short-term, long-term, and procedural memory. By mimicking these memory functions, AI systems can maintain context, adapt to individual users, and provide more personalized support.</li>
  <li><strong>Personalised Chatbots</strong> — These are not your typical chatbots. They are designed to be companions on a journey of self-discovery, helping users explore values, set meaningful goals, and navigate life's complexities.</li>
</ul>

<h3>Real-World Applications</h3>
<p>The potential applications of this research are vast, ranging from personalised education and self-improvement tools to mental wellness support and even creative collaboration. For example, a chatbot powered by these technologies could help a student connect their academic interests to potential career paths, assist an individual in overcoming personal challenges by drawing upon relevant psychological insights, or even help a creative professional brainstorm new ideas by tapping into a vast network of knowledge. This work is still in its early stages, but the initial results are incredibly promising. I envision a future where AI-powered companions help us not only navigate the world around us but also understand ourselves on a deeper level.</p>

<hr>

<h2>MSc Studies: A Thematic Overview</h2>

<p>My MSc in Psychological Sciences provided a rich and diverse exploration of human behaviour, cognition, and development, viewed through environmental, cognitive, and developmental lenses. Each research project employed rigorous evidence-based methodologies, both quantitative and qualitative, to investigate critical questions spanning our relationship with personal, societal, and environmental domains. Collectively, these studies offer an interdisciplinary perspective, merging theoretical insights with practical applications to foster personal development, collaborative innovation, and meaningful change.</p>

<p>Below is a thematic synthesis of my key research areas.</p>

<hr>

<div class="section">
  <img src="/research/future-self.webp" alt="Future-Self Research">
  <div class="section-content">
    <h2>Future-Self Visualisation and Environmental Intentions</h2>
    <p><em>Bridging Psychology and Sustainability</em></p>
  </div>
</div>

<p>This dissertation, a cornerstone of my MSc work, explored the fascinating link between our ability to envision our future selves and our willingness to engage in pro-environmental behaviours. Grounded in the concept of <strong>Future-Self Continuity</strong> (FSC), the research investigated how visualisation exercises could strengthen our psychological connection to our future identities.</p>

<p>The findings revealed that <strong>even brief visualisation interventions could significantly enhance FSC and, importantly, indirectly influence pro-environmental attitudes (PEA) and intentions (PEI)</strong>.</p>

<p>This work has direct implications for designing effective interventions to combat climate inertia, suggesting that <strong>by fostering a stronger sense of connection to our future selves, we can promote more sustainable behaviours in the present</strong>.</p>

<p>The insights gained from this research are being directly applied to the development of a journaling app designed to help users cultivate a stronger sense of future-self continuity and, in turn, make more conscious and purposeful choices.</p>

<div class="section">
  <img src="/research/img/optimism.webp" alt="Optimism Research">
  <div class="section-content">
    <h3>Age, Optimism, and Cultural Contexts</h3>
    <p>This research delved into the relationship between age, gender, and dispositional optimism, using the Life Orientation Test-Revised (LOT-R) as a key measure. Conducted across diverse cultural contexts, the study found a significant decline in optimism with age, while gender did not appear to play a significant role. These findings highlight the importance of considering age-related factors when exploring psychological well-being.</p>
  </div>
</div>

<div class="section">
  <img src="/research/img/attachment-theory.webp" alt="Attachment Theory">
  <div class="section-content">
    <h3>Attachment Theory and the Bioecological Model</h3>
    <p>This critical evaluation examined the interplay of universal and culturally specific factors in human development, drawing upon the foundational frameworks of attachment theory and Bronfenbrenner's bioecological model. By integrating biological, social, and environmental perspectives, the research provided a holistic understanding of developmental psychology.</p>
  </div>
</div>

<div class="section">
  <img src="/research/img/memory.webp" alt="Memory Systems">
  <div class="section-content">
    <h3>Memory Systems: Data-Driven vs. Concept-Driven Paradigms</h3>
    <p>This study explored the evolution of long-term memory (LTM) storage theories, contrasting early data-driven models with more contemporary concept-driven paradigms. It highlighted the integrative potential of frameworks like the embedded-processes model, which accounts for both bottom-up sensory inputs and top-down cognitive processing.</p>
  </div>
</div>

<div class="section">
  <img src="/research/img/nature.webp" alt="Human-Nature Connection">
  <div class="section-content">
    <h3>Human-Nature Synergy and Prosocial Aspirations</h3>
    <p>Employing qualitative thematic analysis, this research investigated how engagement with nature can foster personal growth, resilience, and prosocial behaviour. The findings illuminated nature's role as a mentor and motivator, inspiring awe, collaboration, and a sense of purpose.</p>
  </div>
</div>

<div class="section">
  <img src="/research/img/campaign.webp" alt="Environmental Campaigns">
  <div class="section-content">
    <h3>Social Norms and Pro-Environmental Campaigns</h3>
    <p>This research focused on strategies for improving the effectiveness of environmental sustainability campaigns by harnessing the power of social norms, collective identity, and community-based initiatives. The study highlighted the crucial interplay between social psychology and environmental action.</p>
  </div>
</div>

<div class="section">
  <img src="/research/img/identity.webp" alt="Personality Psychology">
  <div class="section-content">
    <h3>Personality vs. Social Psychology in Behavioural Insights</h3>
    <p>This comparative analysis examined the distinct yet complementary contributions of personality psychology and social psychology to our understanding of human behaviour. The study advocated for integrative approaches to address complex behavioural challenges, such as prejudice, discrimination, and identity formation.</p>
  </div>
</div>

<hr>

<h2>A Foundation in Psychosynthesis: Embracing Wholeness and Will</h2>

<p>Prior to my MSc, I pursued a diploma in Psychosynthesis, a transformative psychological approach that emphasises the inherent drive towards wholeness and self-realisation. Psychosynthesis posits that we are not merely a collection of disparate parts, but a dynamic interplay of subpersonalities, all striving for integration around a higher Self. Key concepts in Psychosynthesis that have profoundly influenced my work include:</p>

<ul>
  <li><strong>The Will</strong> — Psychosynthesis views the will not as mere willpower, but as a central force for self-actualisation, guiding us towards our unique purpose and potential.</li>
  <li><strong>Subpersonalities</strong> — These are distinct psychological patterns, each with its own needs, desires, and perspectives. Recognising and harmonising these inner voices is crucial for personal growth.</li>
  <li><strong>The Higher Self</strong> — This represents our core essence, a source of wisdom, intuition, and unconditional love. Connecting with the Higher Self provides a sense of meaning, purpose, and direction.</li>
  <li><strong>Disidentification and Self-Identification</strong> — These are core practices in Psychosynthesis, involving the ability to detach from limiting self-concepts and connect with our deeper, more authentic Self.</li>
</ul>

<p>These principles have provided me with a powerful framework for understanding human nature and have deeply informed my approach to both life coaching and the development of technology that supports personal growth.</p>

<hr>

<h2>Awakening from the Meaning Crisis</h2>
<p><em>Exploring Relevance Realisation, Insight, and Wisdom</em></p>

<p>My exploration of the human condition continued with John Vervaeke's transformative cognitive science course, 'Awakening from the Meaning Crisis.' This course provided a profound exploration of how we make sense of the world, construct meaning, and grapple with existential challenges in the 21st century. Several key themes from the course have direct relevance to my current research and the development of my journaling project:</p>

<ul>
  <li><strong>Relevance Realisation</strong> — Vervaeke argues that our cognitive processes are fundamentally driven by a continuous process of determining what is relevant to us in any given situation. This process shapes our perceptions, guides our attention, and ultimately influences our actions. Understanding relevance realisation is crucial for designing AI systems that can effectively support human decision-making and goal pursuit.</li>
  <li><strong>Insight</strong> — The course explored the nature of insight as a sudden shift in perspective, a moment of 'aha!' that allows us to see things in a new light. Cultivating insight is essential for problem-solving, creativity, and personal growth.</li>
  <li><strong>Cultural Practices and Wisdom</strong> — Vervaeke emphasises the importance of cultural practices in shaping our cognitive abilities and fostering wisdom. These practices, ranging from mindfulness and meditation to dialogue and storytelling, provide us with tools for navigating complexity, cultivating self-awareness, and connecting with something larger than ourselves.</li>
</ul>

<p>These two distinct bodies of research, Psychosynthesis and 'Awakening from the Meaning Crisis,' provide a rich theoretical foundation for my work. They offer complementary historical, psychological, and philosophical perspectives on the human condition, highlighting the importance of self-awareness, meaning-making, and the cultivation of wisdom in navigating the complexities of modern life.</p>

<div class="links">
  <a href="/contact">Contact Me →</a>
</div>
`.trim()
	},
	{
		slug: 'contact',
		title: 'Contact',
		description:
			'Get in touch with Joe Jarlett for collaborations, EdTech consulting, coaching sessions, or to discuss psychology, AI, and education technology projects.',
		content: `
<h1>Contact</h1>

<p>Whether you're interested in a collaboration, some work done, a coaching session, or just a chat :)</p>

<p><a href="mailto:joe.jarlett@gmail.com">joe.jarlett@gmail.com</a></p>

<div class="links">
  <a href="/">Back to Home →</a>
</div>
`.trim()
	},
	{
		slug: 'privacy',
		title: 'Privacy Policy',
		description: 'Privacy policy for joejarlett.co.uk',
		content: `
<h1>Privacy Policy</h1>

<p>This website respects your privacy.</p>

<h2>Analytics</h2>
<p>We use Google Analytics to understand how visitors use this site. This helps us improve the content and user experience.</p>

<h2>Data Collection</h2>
<p>We do not collect personal information unless you explicitly provide it (e.g., through a contact form).</p>

<h2>Cookies</h2>
<p>This site uses cookies for analytics purposes. You can disable cookies in your browser settings.</p>
`.trim()
	}
];

async function seed() {
	console.log('Seeding pages...');

	for (const page of pages) {
		await sql`
			INSERT INTO page (slug, title, description, content, published)
			VALUES (${page.slug}, ${page.title}, ${page.description}, ${page.content}, true)
			ON CONFLICT (slug) DO UPDATE SET
				title = ${page.title},
				description = ${page.description},
				content = ${page.content},
				updated_at = NOW()
		`;
		console.log(`  ✓ ${page.slug}`);
	}

	console.log('Done!');
	await sql.end();
}

seed().catch(console.error);
