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
				content: '<h1>Contact me</h1><p><a href="mailto:franklyskanky@gmail.com">franklyskanky@gmail.com</a></p>'
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
				content: '<h1>Links</h1><ul><li><a href="http://www.gasworkschoir.co.uk" target="_blank" rel="noopener">Gasworks Choir</a></li><li><a href="http://www.martinsolomon.com" target="_blank" rel="noopener">Martin Solomon</a> (previously known as Martin Hanstead)</li></ul>'
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
				content: "<h1>The Gasworks Choir</h1><p>The Gasworks Choir was born in 1997. Together with my sweet soul sister, Ali Orbaum, we placed an ad in Venue Magazine for people who would like to sing harmony without the need to read music, and started with 100 people. We have stopped the numbers at 150 and have a 4 year waiting list! We teach the choir fortnightly in 4 groups and bring them together for a concert in December and May every year in the wonderful acoustics of St George's, Bristol.</p><p>While people are waiting to join, they can sing with The Gasleaks, workshops run by 4 experienced members of the choir using Gasworks material. The people are fantastic, the spirit is wonderful and it is a huge amount of fun to arrange songs and hear them sung by 150 people.</p><p>See our website <a href=\"http://www.gasworkschoir.co.uk\" target=\"_blank\" rel=\"noopener\">www.gasworkschoir.co.uk</a></p>"
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
				content: "<h1>The Gasworks Studio</h1><p>If you'd like to use the studio, please email me at <a href=\"mailto:dee@franklyskanky.co.uk\">dee@franklyskanky.co.uk</a>.</p><p>Some history: I bought 27 Narroways Rd in 1994 for £69,000. It was an interesting house with a dried flower business on the side consisting of two rooms separate from the main house with its own front door. With the help of my friend John the Ghost, from Druidstone in Pembrokeshire, I brought the house up to scratch and soundproofed the back room, with thick rockwall and triple glazing and soundproofed the roof. Blues, rock and folk bands (including mine and my children's) rehearsed in the studio, playing loud but you could hardly hear it from outside. In 1997 I formed The Gasworks Choir together with Ali Orbaum. Immediately the choir was 100 people strong, and we took over most of the rehearsal time in the studio, but the choir was too successful and there was not enough space to breathe.</p><p>In 2002, armed with over 100 letters of support, with support from City Councillors, we were granted planning permission to have an extension on the studio with use for leisure activities. The little toilet and shed on the end of the studio were demolished and an extension increased the size of the hall, and two toilets (one with a shower) were added on to the back. Now the 35 people who sang in each group could sit down on chairs around the edge and the queues for the toilet at break time were shorter.</p><p>The studio is used by The Gasworks Choir and Naked Voices, and I also let it out to other worthwhile activities.</p>"
			}
		]
	},
	{
		slug: 'my-family',
		title: 'My Family',
		description: "Dee Jarlett's family history.",
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: "<h1>My Family</h1><p>I was conceived in Sweden whilst my parents were working in Scandinavia and born on 28th October 1951 in Manchester. They met through a folk dance group — my mum a dancer and my dad playing the accordion. My parents names are Donald and Audrey Willis. My Dad was brought up in Newbury where his father was the editor of the Newbury Weekly News and his mother was an invalid with rheumatoid arthritis. He had a brother and they were both sent away to school at Christ's Hospital in Horsham. He worked in electronics, was involved in building the first early computers whilst at Cambridge university and then became a businessman. He played the piano, piano accordion and the organ, conducted the church choir and a madrigal choir called The A Cappella Singers. In later life he became the Chairman of the Newbury Weekly News.</p><p>My mother was brought up in Chichester where her father had a peach nurseries. She had an elder brother, Maurice and a younger sister Mary and they were never short of food throughout the second world war as they grew all their own, including chickens and rabbits. She trained to be a nurse when she was young, but when she married and had children she stayed at home to look after my dad, my brother and I and wrote poems. They now both live in Alton, and although getting older are still very mentally sound and fairly mobile.</p><p>As Scorpio with Leo rising and a Libran moon, I think I love drama but really love harmony. I married John Jarlett in 1972 and had three children — Ben, Joe and Amy. He was a lovely man and a good father, but I felt I needed something else. In 1999 I married for the second time to Scott Wood, but didn't change my name as I like the name Jarlett and it is the name my children carry. My wonderful dog Jasper, a crafty but well behaved lurcher cross from the dogs home, died in a horrible accident last year. He bolted from the hill when a firework went off, and ended up on the M32. I have a new puppy called Sadie who is an adorable Hungarian Vizsla with a Kennel Club pedigree! She is hard work but very affectionate and is learning fast. She is going to be a fantastic pet.</p><p>I have recently become a granny! Saskia was born on 26th October 2006 — two days before my 55th birthday. She's another Scorpio! It is amazing to be a grandmother... you feel all the same connections as you do with your children. Now she is over a year old, I get to look after her sometimes. Precious one to one time with a small being that you love so much.</p><p>Scott, my present husband, is blind and has a guide dog, a german shepherd called Punch. Scott used to be a computer programmer, but when he was made redundant in 2003 he started to retrain as a teacher of adults, a trainer of software for the blind and an interfaith minister. He can now be addressed as \"Reverend\" if you like! After working as administrator for Naked Voices for two years, he has recently got full time employment as a co-ordinator for students with visual impairment in Bristol colleges working for the RNIB but in the adult education system.</p><p>Ben, my eldest son, is currently doing a PhD in electronic music, living with Jo McAndrews in Stroud, who is also a member of Naked Voices! He has been lecturing in music technology at Bath Spa and Exeter University and does web design. Jo is a psychotherapist and works with bereavement, especially with children.</p><p>Joe is living in our house and has an MA in electronic music. Although he has just about made a living doing sound and visuals at gigs with a side line in removals, he is now entering his Saturn return and has taken some courses in C++ and C# and has been earning lots of money doing web design.</p><p>Amy lives next door with her boyfriend Mark and her dog Magnut, a ridge-backed rottweiller cross. She recently had a year travelling and working in New Zealand and Australia. Also with a degree in music technology, she has been teaching drums and music to young people and has a job mixing muesli for Essential Foods. Mark also works for Essential in the warehouse, but they have also made a few films together and their aim is to start their own film company.</p><p>Auntie Mary, my mum's sister, has recently moved to Bristol and is living in a very posh home for the elderly on the Downs in Clifton. It is a massive gothic building but there is lots to do there and she is making friends. It is nice to know she is nearby if she should need us.</p>"
			}
		]
	},
	{
		slug: 'about-me',
		title: 'About me',
		description: 'About Dee Jarlett — musician, choir director, and founder of the Gasworks Choir.',
		blocks: [
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: "<h1>About me</h1><p>I was born in Manchester, apparently near a park called \"Boggart Hole Clough\", well that's what my mother told me. She also said that Manchester was a grey place in 1951, where everyone had to scrub the dirt from their steps every week. They lived in one room and it must have been very hard to have a baby there. Apparently I cried all the time.</p><p>Soon Dad got a job in Cambridge and they bought a terraced house for £3000. I remember my hard, high iron bedstead and flowery wallpaper that I drew on with pen and got into trouble. Other hazy memories of Cambridge life were an old lady living next door who put her wet washing through a massive contraption called a mangle and the sheets came out flat. On the other side of our house lived a family with loads of children who, for some reason, I wasn't allowed to play with. I remember looking through the hedge and watching them play wishing I could join them. I also remember the milkman had a horse drawn cart, and one day I was allowed to sit up front and drive it!</p><p>When I was 3 we moved to a detached house in Walton on Thames, Surrey — commuterland. I had a happy childhood playing with all my friends in the muddy track which was our road, making up plays and performing them to long-suffering parents, collecting dogs to \"train\" in the garden, making fires and cooking food over a fire in front of the old chicken shed at the bottom of the garden. My brother Jeremy and I got on well but he was sent to boarding school at 7, so I only saw him during the school holidays and was very much an only child. We had a solid fuel boiler in the kitchen which had to be lit every morning and jack frost iced up the inside of the windows on winter mornings and I got dressed in the warmth of the airing cupboard. We swam in the River Thames, I sang in the church choir and Dad's madrigal choir and I went dancing at \"Hersham Hop\" to Tamla Motown with my friend Lindsay. Walton Park is now a main road leading to Hersham Station, full of cars. Whilst a teenager, I played guitar and sang in a group called \"Dee, Pete and Viv\" that mostly sang covers of Peter, Paul and Mary. We were successful enough to do a tour of Denmark school folk clubs and sing on national Danish radio.</p>"
			},
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: "<p>I went to a posh girls school where I had to wear a red beret and grey felt hat in the winter and thick grey stockings with suspenders (!) and a straw panama and stripey dress in the summer. I was no good at Latin and was put into the German class. I wasn't good at that either and ended up learning cookery. I was a natural with music but struggled with the classical part. However I ended up with an A grade for Music A level and an E pass for English language and 9 O levels which got me into Redland Teachers Training College in Bristol. I was always overweight and was constantly on diets to get thin. They never worked. I sang with Alan, Pete and Danny in a folk group called \"Bethams\" and we did a fun summer season in McTavish's Kitchens in Fort William.</p><p>I met John, my first husband when I was 16 on the bus on my way to The Barge folk club in Kingston on Thames. We were soul mates for many years, parting for a while whilst I did my A levels and eventually marrying. I made my wedding dress myself which cost only £4 in material. He joined me in Bristol studying electronic engineering and then we both went back to Leatherhead in Surrey where we bought our first house for £8,000 and I taught in a primary school and after several miscarriages Ben was born. As soon as we could we moved back to the Bristol area, where we first bought a large maisonette in Weston Super Mare, up the hill near Grove Park with a great view of the sea. In Weston hospital Joe was born — very easily and then I nearly died giving birth to Amy with an emergency caesarian. The flat was so big the boys rode their trikes around on the amazingly thick carpet that used to belong to Elizabeth Taylor and Richard Burton. It was a shock being a mother of these three lovely little blondies in just over 4 years and sometimes I saw my reflection in shop windows — a pale tired bedraggled woman — pushing a triple buggy along and couldn't believe it was me. I needed all the help I could get and my mum and mother in law came to stay when I had the babies and Auntie Mary came to visit often as she travelled around the country with her job with the RNIB. I still kept up my music played as a duo with my friend Pete Thompson from \"Bethams\" and another duo with Jenny.</p>"
			},
			{ id: crypto.randomUUID(), type: 'hr' },
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: "<p>The thirty steps up to the front door and the lack of other young mums with kids drove us to find a more suitable house for a family. With some financial help from the family, we moved to a practical 1960s house in Winscombe on the foothills of the Mendip hills. A safe cul de sac near both playgroup and primary school with a level garden and plenty of children around for our kids to play with. Here John and I struggled to make ends meet and I worked in a mushroom farm at weekends and then as a literacy tutor in the evenings. I joined Alan and Paul in a band called \"Meridian\" which had some success around the local folk clubs and later joined Martin Hanstead and Stefan Hannigan forming a multi-instrumental folk band called \"Orion\".</p>"
			},
			{
				id: crypto.randomUUID(),
				type: 'youtube',
				videoId: 'HIc3vK05m8U',
				caption: ''
			},
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: "<p>I bought my own house in Narroways Road, St Werburghs, Bristol when Amy was 12. Gradually over the years as the kids left home to go to university, I spent more time in Bristol and less time in Winscombe. John and I divorced and I had a bit of a wild time — a reaction after being a mother of three. I sang as a duo with Martin as \"Orion\" and with \"The Sweet Soul Sisters\" and worked for thirteen years as an adult literacy and computer tutor in Hartcliffe and The Open Learning Centre in St Pauls. Amy moved to Bristol and after living in Easton for a bit moved into the next door house where the rent was incredibly low and stayed for 11 years until she married Mark and went to live in a truck in the Forest of Dean. She now lives in a lovely little cottage in the forest with their 2 gorgeous daughters. Joe came home from Manchester to stay temporarily in \"The Cupboard\" a low-ceilinged storage room in the roof space. He was there for three years rent free but when he did his MA at Bath a room became free and I thought he should have a room to study in. He moved out for a bit with various girlfriends but returned and I enjoyed his company here. He now has a little boy and lives in a characterful house with his partner on the self-build in St Werburghs. Ben moved to London to do his MSc and got a job as a technician and lecturer at Uxbridge University and then through Naked Voices, met his girlfriend Jo and moved in with her in Stroud. They have my eldest granddaughter who is a delight but have unfortunately parted company. Meanwhile I formed \"The Gasworks Choir\", a huge and lovely community choir — and a tighter more professional acappella group \"Naked Voices\" with Ali Orbaum who had more recently been a member of Sweet Soul Sisters. I co-directed both these groups for years but have recently reduced my work load in order to have more time for myself and my family. My elderly mother and aunt live in sheltered accommodation in Bristol now and I see them quite often and try to see my 4 grandchildren too. Arranging, teaching and performing songs is still my passion and I still teach Gasworks Singers, singing holidays and camps and a few other interesting jobs as they come up.</p><p>As a side-line, but a very important financial contributor to my income, I have also been for many years a family director of the Newbury Weekly News. This extra income has been a kind of \"arts council grant\" which has enabled me to live comfortably whilst working as a full-time musician which I think brings happiness and relaxation to many people. I use the studio next to my house for my choirs and it is a great place to sing, dance, pray and be at peace. Being soundproofed, it shuts out all the city noise.</p>"
			},
			{ id: crypto.randomUUID(), type: 'hr' },
			{
				id: crypto.randomUUID(),
				type: 'text',
				content: "<p>In 1997 I met Scott and he moved in with me and a couple of years later we had an amazing partly pagan, partly buddhist wedding with bagpipes, accordions, citars, guitars, dancing, poetry, theatre and singing. He is blind but having grown up with blind people in my life, through my Auntie Mary, it didn't daunt me. We lived happily together for 17 years until he fell in love with a volunteer from his work. This young girl, the same age as my youngest child, is also blind and a Muslim from Pakistan. He left me for her, converted to Islam and was divorced and married to her within a year. This has left me somewhat shell-shocked and alone. This is the burden that many women over 60 must bear but it is a hard one. I was happy with Scott and found it beyond belief that he could be so under the influence of this young un-evolved woman that he has no longer been allowed to speak to me or my children and grandchildren, who were his family for so many years. I will recover and hopefully meet another lovely man to spend the rest of my life with!</p><p>I like people around us and there have been many people living at Narroways Road, in our house. Charlie, Ian, Mike, Patrick, Neil, Lorenzo, Matt, Mark, Phil, Nick, Hugh, Mikki, Phoebe, Paul, Matt2, Giorgio, Keith, Joe, Bekki, Roger, Kayle, Leye, Sam, Rosie, Liam, Alice have all lived here. I love sharing my life, being involved in other people's lives and living communally — all helping and supporting one another through sickness and wellness, heartache and happy times. Now I share my house with a family... Keith, Sarah and daughter Freya. I have known them for many years and they live here in exchange for physical help with the house and garden.</p><p>Narroways Road is a cul de sac and is near many green spaces where we can walk the dogs. One year we had a great street party and our neighbourhood is a friendly one. When my friend Reni up the road died, her funeral wake was held in the studio and the community came together to grieve and to celebrate her life.</p>"
			}
		]
	}
];

async function seed() {
	for (const p of pages) {
		await sql`
			INSERT INTO page (slug, title, description, blocks, published, created_at, updated_at)
			VALUES (${p.slug}, ${p.title}, ${p.description}, ${sql.json(p.blocks)}, true, now(), now())
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
