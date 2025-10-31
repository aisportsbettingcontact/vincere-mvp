const fs = require('fs');

// Read current data
const currentData = JSON.parse(fs.readFileSync('src/data/latest-odds.json', 'utf8'));

// Parse CSV data
const dkNflData = `20251102	20251102NFL00036	chicago-bears	Chicago Bears	cincinnati-bengals	Cincinnati Bengals	-2.5	2.5	0.79	0.21	0.54	0.46	51.5	0.84	0.16	0.51	0.49	-142	120	0.57	0.43	0.5	0.5	DK
20251102	20251102NFL00048	san-francisco-49ers	San Francisco 49ers	new-york-giants	New York Giants	-2.5	2.5	0.9	0.1	0.81	0.19	48.5	0.83	0.17	0.47	0.53	-148	124	0.7	0.3	0.78	0.22	DK
20251102	20251102NFL00033	atlanta-falcons	Atlanta Falcons	new-england-patriots	New England Patriots	5.5	-5.5	0.15	0.85	0.19	0.81	44.5	0.7	0.3	0.75	0.25	205	-250	0.23	0.77	0.11	0.89	DK
20251102	20251102NFL00038	indianapolis-colts	Indianapolis Colts	pittsburgh-steelers	Pittsburgh Steelers	-3	3	0.91	0.09	0.82	0.18	50.5	0.56	0.44	0.72	0.28	-166	140	0.73	0.27	0.79	0.21	DK
20251102	20251102NFL00053	carolina-panthers	Carolina Panthers	green-bay-packers	Green Bay Packers	12.5	-12.5	0.21	0.79	0.38	0.62	44.5	0.24	0.76	0.64	0.36	650	-1000	0.31	0.69	0.05	0.95	DK
20251102	20251102NFL00052	minnesota-vikings	Minnesota Vikings	detroit-lions	Detroit Lions	8.5	-8.5	0.06	0.94	0.12	0.88	47.5	0.59	0.41	0.73	0.27	380	-500	0.16	0.84	0.05	0.95	DK
20251102	20251102NFL00039	denver-broncos	Denver Broncos	houston-texans	Houston Texans	1.5	-1.5	0.52	0.48	0.74	0.26	39.5	0.7	0.3	0.77	0.23	102	-122	0.67	0.33	0.79	0.21	DK
20251102	20251102NFL00042	los-angeles-chargers	Los Angeles Chargers	tennessee-titans	Tennessee Titans	-9.5	9.5	0.88	0.12	0.87	0.13	43.5	0.84	0.16	0.74	0.26	-500	380	0.91	0.09	0.97	0.03	DK
20251102	20251102NFL00045	jacksonville-jaguars	Jacksonville Jaguars	las-vegas-raiders	Las Vegas Raiders	-3	3	0.75	0.25	0.82	0.18	43.5	0.29	0.71	0.41	0.59	-155	130	0.67	0.33	0.85	0.15	DK
20251102	20251102NFL00062	new-orleans-saints	New Orleans Saints	los-angeles-rams	Los Angeles Rams	14	-14	0.2	0.8	0.21	0.79	43.5	0.72	0.28	0.72	0.28	700	-1100	0.07	0.93	0.03	0.97	DK
20251102	20251102NFL00031	kansas-city-chiefs	Kansas City Chiefs	buffalo-bills	Buffalo Bills	-1.5	1.5	0.58	0.42	0.52	0.48	52.5	0.86	0.14	0.73	0.27	-130	110	0.59	0.41	0.43	0.57	DK
20251102	20251102NFL00050	seattle-seahawks	Seattle Seahawks	washington-commanders	Washington Commanders	-3	3	0.85	0.15	0.74	0.26	48.5	0.69	0.31	0.63	0.37	-162	136	0.71	0.29	0.8	0.2	DK
20251103	20251103NFL00047	arizona-cardinals	Arizona Cardinals	dallas-cowboys	Dallas Cowboys	2.5	-2.5	0.1	0.9	0.13	0.87	54.5	0.52	0.48	0.42	0.58	124	-148	0.17	0.83	0.12	0.88	DK
20251106	20251106NFL00043	las-vegas-raiders	Las Vegas Raiders	denver-broncos	Denver Broncos	10.5	-10.5	0.81	0.19	0.33	0.67	42.5	0.63	0.37	0.75	0.25	425	-575	0.57	0.43	0.1	0.9	DK
20251109	20251109NFL00040	atlanta-falcons	Atlanta Falcons	indianapolis-colts	Indianapolis Colts	6.5	-6.5	0.21	0.79	0.16	0.84	48.5	0.19	0.81	0.74	0.26	260	-325	0.11	0.89	0.2	0.8	DK
20251109	20251109NFL00034	cleveland-browns	Cleveland Browns	new-york-jets	New York Jets	1.5	-1.5	0.68	0.32	0.53	0.47	38.5	0.19	0.81	0.69	0.31	105	-125	0.69	0.31	0.69	0.31	DK
20251109	20251109NFL00056	new-orleans-saints	New Orleans Saints	carolina-panthers	Carolina Panthers	3.5	-3.5	0.08	0.92	0.16	0.84	41.5	0	1	0.29	0.71	154	-185	0.04	0.96	0.15	0.85	DK
20251109	20251109NFL00032	buffalo-bills	Buffalo Bills	miami-dolphins	Miami Dolphins	-8.5	8.5	0.87	0.13	0.86	0.14	50.5	0.03	0.97	0.4	0.6	-410	320	0.95	0.05	0.94	0.06	DK
20251109	20251109NFL00039	jacksonville-jaguars	Jacksonville Jaguars	houston-texans	Houston Texans	3	-3	0.32	0.68	0.21	0.79	41.5	0.22	0.78	0.76	0.24	140	-166	0.97	0.03	0.35	0.65	DK
20251109	20251109NFL00054	baltimore-ravens	Baltimore Ravens	minnesota-vikings	Minnesota Vikings	-4.5	4.5	0.96	0.04	0.9	0.1	47.5	0.09	0.91	0.56	0.44	-225	185	0.74	0.26	0.84	0.16	DK
20251109	20251109NFL00058	new-england-patriots	New England Patriots	tampa-bay-buccaneers	Tampa Bay Buccaneers	2.5	-2.5	0.47	0.53	0.4	0.6	48.5	0.14	0.86	0.57	0.43	124	-148	0.91	0.09	0.33	0.67	DK
20251109	20251109NFL00051	new-york-giants	New York Giants	chicago-bears	Chicago Bears	3	-3	0.07	0.93	0.22	0.78	47.5	0.02	0.98	0.24	0.76	142	-170	0.46	0.54	0.32	0.68	DK
20251109	20251109NFL00061	arizona-cardinals	Arizona Cardinals	seattle-seahawks	Seattle Seahawks	6.5	-6.5	0.27	0.73	0.21	0.79	45.5	0.08	0.92	0.49	0.51	225	-278	0.33	0.67	0.16	0.84	DK
20251109	20251109NFL00050	detroit-lions	Detroit Lions	washington-commanders	Washington Commanders	-3	3	1	0	0.98	0.02	51.5	0.27	0.73	0.81	0.19	-170	142	0.99	0.01	0.92	0.08	DK
20251109	20251109NFL00060	los-angeles-rams	Los Angeles Rams	san-francisco-49ers	San Francisco 49ers	-3	3	0.91	0.09	0.84	0.16	48.5	0	1	0.49	0.51	-162	136	0.81	0.19	0.76	0.24	DK
20251109	20251109NFL00046	pittsburgh-steelers	Pittsburgh Steelers	los-angeles-chargers	Los Angeles Chargers	4.5	-4.5	0.48	0.52	0.37	0.63	46.5	0.74	0.26	0.7	0.3	180	-218	0.8	0.2	0.34	0.66	DK
20251110	20251110NFL00053	philadelphia-eagles	Philadelphia Eagles	green-bay-packers	Green Bay Packers	3	-3	0.88	0.12	0.78	0.22	45.5	0.98	0.02	0.93	0.07	140	-166	0.94	0.06	0.84	0.16	DK`;

const circaNflData = `20251102	20251102NFL00036	chicago-bears	Chicago Bears	cincinnati-bengals	Cincinnati Bengals	-2.5	2.5	0.08	0.92	0.77	0.23	51	0.78	0.22	0.63	0.38	-150	130	0	1	0.14	0.86	CIRCA
20251102	20251102NFL00048	san-francisco-49ers	San Francisco 49ers	new-york-giants	New York Giants	-2.5	2.5	1	0	0.97	0.03	48.5	0.94	0.06	0.6	0.4	-145	125	0.02	0.98	0.4	0.6	CIRCA
20251102	20251102NFL00033	atlanta-falcons	Atlanta Falcons	new-england-patriots	New England Patriots	5.5	-5.5	0.16	0.84	0.42	0.58	45	1	0	1	0	205	-240	0.09	0.91	0.6	0.4	CIRCA
20251102	20251102NFL00038	indianapolis-colts	Indianapolis Colts	pittsburgh-steelers	Pittsburgh Steelers	-3	3	0.94	0.06	0.83	0.17	50.5	1	0	1	0	-160	140	0.51	0.49	0.67	0.33	CIRCA
20251102	20251102NFL00053	carolina-panthers	Carolina Panthers	green-bay-packers	Green Bay Packers	13	-13	0.54	0.46	0.38	0.62	44	0.64	0.36	0.5	0.5	575	-800	0.4	0.6	0.67	0.33	CIRCA
20251102	20251102NFL00052	minnesota-vikings	Minnesota Vikings	detroit-lions	Detroit Lions	8.5	-8.5	0.72	0.28	0.14	0.86	48	0.63	0.37	0.63	0.38	360	-450	0.01	0.99	0.33	0.67	CIRCA
20251102	20251102NFL00039	denver-broncos	Denver Broncos	houston-texans	Houston Texans	1.5	-1.5	0.61	0.39	0.62	0.38	40	0.87	0.13	0.56	0.44	105	-125	0.94	0.06	0.73	0.27	CIRCA
20251102	20251102NFL00042	los-angeles-chargers	Los Angeles Chargers	tennessee-titans	Tennessee Titans	-9.5	9.5	0.97	0.03	0.86	0.14	43.5	1	0	1	0	-485	385	0.96	0.04	0.57	0.43	CIRCA
20251102	20251102NFL00045	jacksonville-jaguars	Jacksonville Jaguars	las-vegas-raiders	Las Vegas Raiders	-2.5	2.5	0.33	0.67	0.71	0.29	44	0.45	0.55	0.55	0.45	-145	125	0.52	0.48	0.67	0.33	CIRCA
20251102	20251102NFL00062	new-orleans-saints	New Orleans Saints	los-angeles-rams	Los Angeles Rams	14	-14	0.25	0.75	0.33	0.67	44	0.24	0.76	0.43	0.57	775	-1200	0.75	0.25	0.71	0.29	CIRCA
20251102	20251102NFL00031	kansas-city-chiefs	Kansas City Chiefs	buffalo-bills	Buffalo Bills	-2	2	0.64	0.36	0.5	0.5	52.5	0.76	0.24	0.6	0.4	-135	115	0.09	0.91	0.31	0.69	CIRCA
20251102	20251102NFL00050	seattle-seahawks	Seattle Seahawks	washington-commanders	Washington Commanders	-3	3	0.95	0.05	0.86	0.14	48.5	1	0	1	0	-160	140	0.59	0.41	0.5	0.5	CIRCA
20251103	20251103NFL00047	arizona-cardinals	Arizona Cardinals	dallas-cowboys	Dallas Cowboys	2.5	-2.5	0.24	0.76	0.22	0.78	53	0.41	0.59	0.83	0.17	130	-150	0.89	0.11	0.25	0.75	CIRCA`;

const dkNbaData = `20251031	20251031NBA00073	atlanta-hawks	Atlanta Hawks	indiana-pacers	Indiana Pacers	-2.5	2.5	0.35	0.65	0.4	0.6	232.5	0.7	0.3	0.72	0.28	-135	114	0.46	0.54	0.43	0.57	DK
20251031	20251031NBA00083	boston-celtics	Boston Celtics	philadelphia-76ers	Philadelphia 76ers	1.5	-1.5	0.71	0.29	0.44	0.56	233.5	0.67	0.33	0.67	0.33	-108	-112	0.85	0.15	0.46	0.54	DK
20251031	20251031NBA00067	toronto-raptors	Toronto Raptors	cleveland-cavaliers	Cleveland Cavaliers	5.5	-5.5	0.4	0.6	0.34	0.66	239.5	0.79	0.21	0.59	0.41	200	-245	0.2	0.8	0.12	0.88	DK
20251031	20251031NBA00066	new-york-knicks	New York Knicks	chicago-bulls	Chicago Bulls	-4.5	4.5	0.63	0.37	0.47	0.53	233.5	0.63	0.37	0.7	0.3	-192	160	0.6	0.4	0.71	0.29	DK
20251031	20251031NBA00076	la-lakers	La Lakers	memphis-grizzlies	Memphis Grizzlies	-2.5	2.5	0.57	0.43	0.55	0.45	240.5	0.67	0.33	0.62	0.38	-142	120	0.62	0.38	0.62	0.38	DK
20251031	20251031NBA00085	denver-nuggets	Denver Nuggets	portland-trail-blazers	Portland Trail Blazers	-4.5	4.5	0.83	0.17	0.8	0.2	238.5	0.89	0.11	0.62	0.38	-205	170	0.84	0.16	0.89	0.11	DK
20251031	20251031NBA00084	utah-jazz	Utah Jazz	phoenix-suns	Phoenix Suns	3.5	-3.5	0.2	0.8	0.55	0.45	236.5	0.86	0.14	0.64	0.36	130	-155	0.21	0.79	0.42	0.58	DK
20251031	20251031NBA00074	new-orleans-pelicans	New Orleans Pelicans	la-clippers	La Clippers	10.5	-10.5	0.27	0.73	0.42	0.58	222.5	0.17	0.83	0.62	0.38	400	-535	0.21	0.79	0.1	0.9	DK`;

const dkNhlData = `20251031	20251031NHL01725	colorado-avalanche	Colorado Avalanche	vegas-golden-knights	Vegas Golden Knights	-1.5	1.5	0.62	0.38	0.25	0.75	6.5	0.74	0.26	0.67	0.33	-120	100	0.71	0.29	0.57	0.43	DK
20251031	20251031NHL00107	ny-islanders	Ny Islanders	washington-capitals	Washington Capitals	1.5	-1.5	0.38	0.62	0.34	0.66	6.5	0.51	0.49	0.47	0.53	190	-230	0.33	0.67	0.23	0.77	DK
20251031	20251031NHL00118	detroit-red-wings	Detroit Red Wings	anaheim-ducks	Anaheim Ducks	1.5	-1.5	0.52	0.48	0.78	0.22	6.5	0.74	0.26	0.58	0.42	100	-120	0.48	0.52	0.6	0.4	DK
20251101	20251101NHL00098	carolina-hurricanes	Carolina Hurricanes	boston-bruins	Boston Bruins	-1.5	1.5	0.68	0.32	0.42	0.58	6.5	0.64	0.36	0.6	0.4	-192	160	0.39	0.61	0.72	0.28	DK
20251101	20251101NHL00103	pittsburgh-penguins	Pittsburgh Penguins	winnipeg-jets	Winnipeg Jets	1.5	-1.5	0.23	0.77	0.55	0.45	6.5	0.79	0.21	0.68	0.32	154	-185	0.47	0.53	0.27	0.73	DK
20251101	20251101NHL00111	calgary-flames	Calgary Flames	nashville-predators	Nashville Predators	1.5	-1.5	0.11	0.89	0.6	0.4	5.5	0.85	0.15	0.73	0.27	114	-135	0.24	0.76	0.42	0.58	DK
20251101	20251101NHL00122	colorado-avalanche	Colorado Avalanche	san-jose-sharks	San Jose Sharks	-1.5	1.5	0.22	0.78	0.59	0.41	6.5	0.07	0.93	0.61	0.39	-218	180	0.58	0.42	0.86	0.14	DK
20251101	20251101NHL00105	dallas-stars	Dallas Stars	florida-panthers	Florida Panthers	1.5	-1.5	0.75	0.25	0.72	0.28	5.5	0.36	0.64	0.65	0.35	110	-130	0.3	0.7	0.49	0.51	DK
20251101	20251101NHL00096	toronto-maple-leafs	Toronto Maple Leafs	philadelphia-flyers	Philadelphia Flyers	-1.5	1.5	0.98	0.02	0.27	0.73	6.5	0.38	0.62	0.56	0.44	-125	105	0.93	0.07	0.7	0.3	DK
20251101	20251101NHL00100	ottawa-senators	Ottawa Senators	montreal-canadiens	Montreal Canadiens	1.5	-1.5	0.18	0.82	0.61	0.39	6.5	0.18	0.82	0.59	0.41	110	-130	0.11	0.89	0.23	0.77	DK
20251101	20251101NHL00099	washington-capitals	Washington Capitals	buffalo-sabres	Buffalo Sabres	-1.5	1.5	0.67	0.33	0.3	0.7	6.5	0.56	0.44	0.36	0.64	-112	-108	0.04	0.96	0.38	0.62	DK
20251101	20251101NHL00109	st-louis-blues	St Louis Blues	columbus-blue-jackets	Columbus Blue Jackets	1.5	-1.5	0.92	0.08	0.67	0.33	6.5	0.39	0.61	0.56	0.44	110	-130	0.38	0.62	0.34	0.66	DK
20251101	20251101NHL00116	vancouver-canucks	Vancouver Canucks	minnesota-wild	Minnesota Wild	1.5	-1.5	0.05	0.95	0.55	0.45	5.5	0.73	0.27	0.6	0.4	136	-162	0.67	0.33	0.28	0.72	DK
20251101	20251101NHL00120	new-jersey-devils	New Jersey Devils	los-angeles-kings	Los Angeles Kings	-1.5	1.5	0.75	0.25	0.32	0.68	5.5	0.48	0.52	0.66	0.34	-115	-105	0.76	0.24	0.62	0.38	DK
20251101	20251101NHL00115	chicago-blackhawks	Chicago Blackhawks	edmonton-oilers	Edmonton Oilers	1.5	-1.5	0.06	0.94	0.39	0.61	6.5	0.93	0.07	0.65	0.35	250	-310	0.81	0.19	0.17	0.83	DK
20251101	20251101NHL01845	ny-rangers	Ny Rangers	seattle-kraken	Seattle Kraken	-1.5	1.5	0.01	0.99	0.3	0.7	5.5	0.16	0.84	0.7	0.3	-135	114	0.37	0.63	0.63	0.37	DK`;

const dkMlbData = `20251031	20251031MLB00005	los-angeles-dodgers	Los Angeles Dodgers	toronto-blue-jays	Toronto Blue Jays	-1.5	1.5	0.65	0.35	0.54	0.46	7.5	0.6	0.4	0.67	0.33	-144	118	0.57	0.43	0.52	0.48	DK`;

function parseCSV(csv, book) {
  const lines = csv.trim().split('\n');
  const gamesByDate = {};
  
  lines.forEach(line => {
    const parts = line.split('\t');
    const date = parts[0];
    const gameId = parts[1];
    const sport = parts[23] === 'DK' || parts[23] === 'CIRCA' ? (gameId.includes('NFL') ? 'NFL' : gameId.includes('NBA') ? 'NBA' : gameId.includes('NHL') ? 'NHL' : 'MLB') : '';
    
    const game = {
      id: gameId,
      d: date,
      a: parts[2],
      h: parts[4],
      spr: [parseFloat(parts[6]), parseFloat(parts[7]), [parseFloat(parts[8]), parseFloat(parts[9])], [parseFloat(parts[10]), parseFloat(parts[11])]],
      tot: [parseFloat(parts[12]), [parseFloat(parts[13]), parseFloat(parts[14])], [parseFloat(parts[15]), parseFloat(parts[16])]],
      ml: [parseFloat(parts[17]), parseFloat(parts[18]), [parseFloat(parts[19]), parseFloat(parts[20])], [parseFloat(parts[21]), parseFloat(parts[22])]],
      b: book,
      s: sport
    };
    
    if (!gamesByDate[date]) {
      gamesByDate[date] = [];
    }
    gamesByDate[date].push(game);
  });
  
  return gamesByDate;
}

// Parse all data
const dkNfl = parseCSV(dkNflData, 'DK');
const circaNfl = parseCSV(circaNflData, 'CIRCA');
const dkNba = parseCSV(dkNbaData, 'DK');
const dkNhl = parseCSV(dkNhlData, 'DK');
const dkMlb = parseCSV(dkMlbData, 'DK');

// Update DK data
currentData.books.DK.NFL = dkNfl;
currentData.books.DK.NBA = dkNba;
currentData.books.DK.NHL = dkNhl;
currentData.books.DK.MLB = dkMlb;

// Update CIRCA NFL data
if (!currentData.books.CIRCA) {
  currentData.books.CIRCA = {};
}
currentData.books.CIRCA.NFL = circaNfl;

// Preserve CBB for both books (already exists in currentData)

// Write updated data
fs.writeFileSync('src/data/latest-odds.json', JSON.stringify(currentData));

console.log('Successfully updated odds data!');
