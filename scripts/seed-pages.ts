import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://gn_app:WG0CReaHtBfgMq9v5TMfDBIB@localhost:5432/franklyskanky';
const sql = postgres(DATABASE_URL);

const pages = [
	{
		slug: 'contact',
		title: 'Contact me',
		description: 'Get in touch with Dee Jarlett.',
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: '<p><a href="mailto:franklyskanky@gmail.com">franklyskanky@gmail.com</a></p>'
			}
		]
	},
	{
		slug: 'links',
		title: 'Links',
		description: 'Links to related websites.',
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: '<ul><li><a href="http://www.gasworkschoir.co.uk" target="_blank" rel="noopener">Gasworks Choir</a></li><li><a href="http://www.martinsolomon.com" target="_blank" rel="noopener">Martin Solomon</a> (previously known as Martin Hanstead)</li></ul>'
			}
		]
	},
	{
		slug: 'gasworks-choir',
		title: 'The Gasworks Choir',
		description: 'The Gasworks Choir — a community harmony choir based in Bristol, co-directed by Dee Jarlett and Ali Orbaum.',
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: '<h1>The Gasworks Choir</h1><p>The Gasworks Choir was born in 1997. Together with my sweet soul sister, Ali Orbaum, we placed an ad in Venue Magazine for people who would like to sing harmony without the need to read music, and started with 100 people. We have stopped the numbers at 150 and have a 4 year waiting list! We teach the choir fortnightly in 4 groups and bring them together for a concert in December and May every year in the wonderful acoustics of St George\'s, Bristol.</p><p>While people are waiting to join, they can sing with The Gasleaks, workshops run by 4 experienced members of the choir using Gasworks material. The people are fantastic, the spirit is wonderful and it is a huge amount of fun to arrange songs and hear them sung by 150 people.</p><p>See our website <a href="http://www.gasworkschoir.co.uk" target="_blank" rel="noopener">www.gasworkschoir.co.uk</a></p>'
			}
		]
	},
	{
		slug: 'gasworks-studio',
		title: 'The Gasworks Studio',
		description: 'The Gasworks Studio in St Werburghs, Bristol — home of the Gasworks Choir and Naked Voices.',
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: '<h1>The Gasworks Studio</h1><p>If you\'d like to use the studio, please email me at <a href="mailto:dee@franklyskanky.co.uk">dee@franklyskanky.co.uk</a>.</p><p>Some history: I bought 27 Narroways Rd in 1994 for £69,000. It was an interesting house with a dried flower business on the side consisting of two rooms separate from the main house with its own front door. With the help of my friend John the Ghost, from Druidstone in Pembrokeshire, I brought the house up to scratch and soundproofed the back room, with thick rockwall and triple glazing and soundproofed the roof. Blues, rock and folk bands (including mine and my children\'s) rehearsed in the studio, playing loud but you could hardly hear it from outside. In 1997 I formed The Gasworks Choir together with Ali Orbaum. Immediately the choir was 100 people strong, and we took over most of the rehearsal time in the studio, but the choir was too successful and there was not enough space to breathe.</p><p>In 2002, armed with over 100 letters of support, with support from City Councillors, we were granted planning permission to have an extension on the studio with use for leisure activities. The little toilet and shed on the end of the studio were demolished and an extension increased the size of the hall, and two toilets (one with a shower) were added on to the back. Now the 35 people who sang in each group could sit down on chairs around the edge and the queues for the toilet at break time were shorter.</p><p>The studio is used by The Gasworks Choir and Naked Voices, and I also let it out to other worthwhile activities.</p>'
			}
		]
	},
	{
		slug: 'my-family',
		title: 'My Family',
		description: 'Dee Jarlett\'s family history.',
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: '<h1>My Family</h1><p>I was conceived in Sweden whilst my parents were working in Scandinavia and born on 28th October 1951 in Manchester. They met through a folk dance group — my mum a dancer and my dad playing the accordion. My parents names are Donald and Audrey Willis. My Dad was brought up in Newbury where his father was the editor of the Newbury Weekly News and his mother was an invalid with rheumatoid arthritis. He had a brother and they were both sent away to school at Christ\'s Hospital in Horsham. He worked in electronics, was involved in building the first early computers whilst at Cambridge university and then became a businessman. He played the piano, piano accordion and the organ, conducted the church choir and a madrigal choir called The A Cappella Singers. In later life he became the Chairman of the Newbury Weekly News.</p><p>My mother was brought up in Chichester where her father had a peach nurseries. She had an elder brother, Maurice and a younger sister Mary and they were never short of food throughout the second world war as they grew all their own, including chickens and rabbits. She trained to be a nurse when she was young, but when she married and had children she stayed at home to look after my dad, my brother and I and wrote poems. They now both live in Alton, and although getting older are still very mentally sound and fairly mobile.</p><p>As Scorpio with Leo rising and a Libran moon, I think I love drama but really love harmony. I married John Jarlett in 1972 and had three children — Ben, Joe and Amy. He was a lovely man and a good father, but I felt I needed something else. In 1999 I married for the second time to Scott Wood, but didn\'t change my name as I like the name Jarlett and it is the name my children carry. My wonderful dog Jasper, a crafty but well behaved lurcher cross from the dogs home, died in a horrible accident last year. He bolted from the hill when a firework went off, and ended up on the M32. I have a new puppy called Sadie who is an adorable Hungarian Vizsla with a Kennel Club pedigree! She is hard work but very affectionate and is learning fast. She is going to be a fantastic pet.</p><p>I have recently become a granny! Saskia was born on 26th October 2006 — two days before my 55th birthday. She\'s another Scorpio! It is amazing to be a grandmother... you feel all the same connections as you do with your children. Now she is over a year old, I get to look after her sometimes. Precious one to one time with a small being that you love so much.</p><p>Scott, my present husband, is blind and has a guide dog, a german shepherd called Punch. Scott used to be a computer programmer, but when he was made redundant in 2003 he started to retrain as a teacher of adults, a trainer of software for the blind and an interfaith minister. He can now be addressed as "Reverend" if you like! After working as administrator for Naked Voices for two years, he has recently got full time employment as a co-ordinator for students with visual impairment in Bristol colleges working for the RNIB but in the adult education system.</p><p>Ben, my eldest son, is currently doing a PhD in electronic music, living with Jo McAndrews in Stroud, who is also a member of Naked Voices! He has been lecturing in music technology at Bath Spa and Exeter University and does web design. Jo is a psychotherapist and works with bereavement, especially with children.</p><p>Joe is living in our house and has an MA in electronic music. Although he has just about made a living doing sound and visuals at gigs with a side line in removals, he is now entering his Saturn return and has taken some courses in C++ and C# and has been earning lots of money doing web design.</p><p>Amy lives next door with her boyfriend Mark and her dog Magnut, a ridge-backed rottweiller cross. She recently had a year travelling and working in New Zealand and Australia. Also with a degree in music technology, she has been teaching drums and music to young people and has a job mixing muesli for Essential Foods. Mark also works for Essential in the warehouse, but they have also made a few films together and their aim is to start their own film company.</p><p>Auntie Mary, my mum\'s sister, has recently moved to Bristol and is living in a very posh home for the elderly on the Downs in Clifton. It is a massive gothic building but there is lots to do there and she is making friends. It is nice to know she is nearby if she should need us.</p>'
			}
		]
	}
];

async function seed() {
	for (const p of pages) {
		// Upsert: insert or update if exists
		await sql`
			INSERT INTO page (slug, title, description, blocks, published, created_at, updated_at)
			VALUES (${p.slug}, ${p.title}, ${p.description}, ${JSON.stringify(p.blocks)}::jsonb, true, now(), now())
			ON CONFLICT (slug) DO UPDATE SET
				title = EXCLUDED.title,
				description = EXCLUDED.description,
				blocks = EXCLUDED.blocks,
				updated_at = now()
		`;
		console.log(`Seeded: /${p.slug}`);
	}

	await sql.end();
	console.log('Done!');
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
