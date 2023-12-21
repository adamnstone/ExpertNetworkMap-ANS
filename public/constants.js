const NODE_STROKE_WIDTH_HIGHLIGHTED = "1.5px", // width of circle around node circle on hover
    HOVER_NODE_STROKE_COLOR = "black", // color of circle around node circle on hover
    NOT_HOVERING_NODE_STROKE_WIDTH = "0px", // width of circle around node circle when not hovering
    NOT_HOVERING_NODE_STROKE_COLOR = "", // color of circle around node circle when not hovering
    RGB_LINE_COLOR = "0,0,0", // color of edges
    LINE_WIDTH = "0.3px", // width of edges
    CAROUSEL_RECT_STROKE_COLOR = "", // color of rectangular outline of each rectangle in the subject-area-selection carousel
    CAROUSEL_RECT_STROKE_WIDTH = "0px", // width of rectangular outline of each rectangle in the subject-area-selection carousel
    CAROUSEL_SELECTOR_COLOR = "black", // color of the rectangular path that displays which subject area you have selected
    DIAL_OUTLINE_COLOR = "grey", // color of the outline of the minimum times referenced dial
    DIAL_TEXT_COLOR = "black", // color of the text labeling the minimum times referenced dial
    OVERLAY_TEXT_LINK_COLOR = "#7e7eed"; // color of the links

// all CSS customizable values not controlled through JS/D3JS are included as variables under :root in style.css

const SCALE_FACTOR = 1, // factor that the strength of edges in the force-simulation are multiplied by (higher number = nodes are pulled closer together)
    forceBoundaryMargin = 30; // margin along the defined edges of the force simulation 

const minOpacity = 0.15; // opacity of a node if the selected filters do not include the node

const NODE_HIGHLIGHTED_OPACITY = 1; // opacity of a node if the selected filters do include the node
const MINIMUM_STRENGTH_CONSTANT = 100; // lowest possible strength of edges (increasing this will linearly increase the strength of all edges in the graph)

// colors of years-pie and subject-area-selection carousel
const PIE_SLICE_COLOR = 'grey',
    PIE_TEXT_COLOR = 'white',
    DIAL_STICK_COLOR = 'grey',
    CAROUSEL_OPTION_COLOR = 'grey',
    CAROUSEL_TEXT_COLOR = 'white';

// color pallete of Fab Academy
const FAB_PALETTE = [
    "#f1f2f2",
    "#f1d2f2",
    "#f1b2f2",
    "#f04260",
    "#4abfbd",
    "#284fb5",
    "#f05c71"
];

// color pallete of nodes by continent - encodes geographical data
const NODE_REGION_PALETTE = [
    "#1da619",
    "#f04260",
    "#4abfbd",
    "#284fb5",
    "#f05be1",
    "#87743d"
];

// list of continent names
const continent = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania"
];

// zips the continent color pallete and list of continents above into an object
const continentColor = {};
for (let i = 0; i < NODE_REGION_PALETTE.length; i++) continentColor[continent[i]] = NODE_REGION_PALETTE[i];

// node radius parameters
const NODE_SIZE_MULTIPLIER = 50;
const NODE_SIZE_MINIMUM = 5;

// list of Fab Academy subject-areas
const TOPICS = [
    "Prefab",
    "Computer-Aided Design",
    "Computer-Controlled Cutting",
    "Embedded Programing",
    "3D Scanning and Printing",
    "Electronics Design",
    "Computer-Controlled Machining",
    "Electronics Production",
    "Mechanical Design, Machine Design",
    "Input Devices",
    "Moulding and Casting",
    "Output Devices",
    "Embedded Networking and Communications",
    "Interface and Application Programming",
    "Wildcard Week",
    "Applications and Implications",
    "Invention, Intellectual Property and Business Models",
    "Final Project",
    "Other"
]

const codesFromNames = {"Talents": ["talents"], "AgriLab": ["agrilab"], "Amsterdam": ["fablabamsterdam"], "IED Madrid": ["ied"], "Bhutan": ["bhutan"], "Sorbonne University": ["fablabsorbonne", "sorbonne"], "ULB": ["fablabulb", "ulb"], "Leon": ["fablableon", "leon"], "Dilijan": ["dilijan"], "Universitario CIDi": ["cidi"], "Vestmannaeyjar": ["falabvestmannaeyjar", "vestmannaeyjar"], "Vancouver": ["vancouver"], "Waag": ["waag"], "EnergyLab-Lomé": ["energylab"], "Spinderihallerne": ["fablabspinderihallerne"], "New Cairo": ["newcairo"], "EchoFab": ["echofab", "fablabechofab"], "CEPT": ["cept", "fablabcept"], "Khairpur": ["fablabkhairpur", "khairpur"], "Reykjavik": ["fablabreykjavik", "reykjavik"], "Egypt": ["egypt", "fablabegypt"], "Oulu": ["fablaboulu", "oulu"], "Berytech": ["berytech", "fablabberytech"], "Bahrain": ["bahrain", "fablabbahrain"], "Charlotte Latin": ["charlotte", "fablabcharlottelatin"], "Santa Chiara": ["fablabsiena", "santachiara"], "Digiscope": ["digiscope", "fablabdigiscope"], "BoldLab": ["seoul", "fablabseoul", "fablabseoulinnovation", "boldseoul", "seoulinnovation"], "Beijing": ["fablabbeijing"], "O Shanghai": ["fablaboshanghai", "oshanghai"], "Aalto": ["aalto", "fablabaalto"], "La Machinerie": ["lamachinerie"], "Dassault Systemes": ["dassault", "fablabdassault"], "Kannai": ["kannai"], "ZOI": ["fablabzoi", "zoi"], "Irbid": ["fablabirbid", "irbid"], "Kamakura": ["fablabkamakura", "kamakura"], "Brighton": ["brighton", "fablabbrighton"], "AKGEC": ["akgec", "fablabakgec"], "Opendot": ["fablabopendot", "opendot"], "EcoStudio": ["ecostudio", "fablabecostudio"], "FCT": ["fct", "fablabfct"], "Bottrop": ["bottrop", "fablabbottrop"], "Aachen": ["aachen", "fablabaachen"], "Trivandrum": ["fablabtrivandrum", "trivandrum"], "UAE": ["fablabuae", "uae"], "Kochi": ["fablabkochi", "kochi"], "TechWorks Amman": ["fablabtechworks", "techworks"], "Singapore": ["singapore"], "LazLab": ["lakazlab"], "Vigyan Asharm": ["fablabvigyanasharm", "vigyanashram"], "Puebla": ["fablabpuebla", "puebla"], "Wheaton": ["wheaton"], "Ciudad Mexico": ["ciudadmexico"], "Barcelona": ["barcelona"], "Incite Focus": ["incitefocus", "fablabincitefocus"], "Santiago": ["fablabsantiago"], "Winam": ["winam"], "Kamp-Lintfort": ["fablabkamplintfort", "kamplintfort"], "TECSUP": ["fablabtecsup", "tecsup", "tecsupaqp"], "QBIC": ["qbic"], "ESAN": ["esan", "fablabesan"], "Rwanda": ["fablabrwanda", "rwanda"], "Lorain College": ["fablablccc", "lccc"], "Bhubaneswar": ["bhubaneswar"], "SZOIL": ["fablabszoil", "szoil"], "UTEC": ["fablabutec", "utec"], "Lima": ["lima"], "Taipei": ["taipei"], "Ucontinental": ["ucontinental"], "Akureyri": ["akureyri"], "Algarve": ["algarve", "farmlabalgarve"], "Bangalore": ["bangalore"], "Benfica": ["benfica"], "Chaihuo": ["chaihuo"], "Chandigarh": ["chandigarh"], "CIT": ["cit"], "CPCC": ["cpcc"], "Crunchlab": ["crunchlab"], "Deusto": ["deusto", "falabdeusto"], "Dhahran": ["dhahran"], "ECAE": ["ecae"], "ESNE": ["esne"], "At3flo": ["fablabat3flo"], "Erfindergarden": ["fablaberfindergarden"], "Facens": ["fablabfacens"], "Gearbox": ["fablabgearbox"], "Isafjorour": ["fablabisafjorour", "isafjorour"], "KromLaboro": ["fablabkromlaboro"], "Madrid CEU": ["fablabmadridceu"], "Odessa": ["fablabodessa"], "Tembisa": ["fablabtembisa"], "Wgtn": ["fablabwgtn"], "Yachay": ["fablabyachay"], "Yucatán": ["fablabyucatan", "yucatan"], "Formshop Shanghai": ["formshop"], "Hong Kong iSPACE": ["hkispace"], "Ingegno": ["ingegno"], "INP-HB": ["inphb"], "Insper": ["insper"], "Ioannina": ["ioannina"], "Jubail": ["jubail"], "KAUST": ["kaust"], "KeoLAB": ["keolab"], "Kitakagaya": ["kitakagaya"], "Libya": ["libya"], "Napoli": ["napoli"], "Ningbo-NexMaker": ["ningbo"], "PlusX": ["plusx"], "Polytech": ["polytech"], "RIIDL": ["riidl"], "SEDI-Cup-ct": ["sedi"], "St. Jude": ["stjude"], "Tianhe Lab": ["tianhelab"], "Tinkerers": ["tinkerers"], "Twarda": ["twarda"], "UCAL": ["ucal"], "Universidad Europea": ["uemadrid"], "Ulima": ["ulima"], "SOCOM": ["fablabsocom"], "Isafjordur": ["isafjordur"]};

const namesFromCodes = {"talents": "Talents", "agrilab": "AgriLab", "fablabamsterdam": "Amsterdam", "ied": "IED Madrid", "bhutan": "Bhutan", "fablabsorbonne": "Sorbonne University", "sorbonne": "Sorbonne University", "fablabulb": "ULB", "ulb": "ULB", "fablableon": "Leon", "leon": "Leon", "dilijan": "Dilijan", "cidi": "Universitario CIDi", "falabvestmannaeyjar": "Vestmannaeyjar", "vestmannaeyjar": "Vestmannaeyjar", "vancouver": "Vancouver", "waag": "Waag", "energylab": "EnergyLab-Lomé", "fablabspinderihallerne": "Spinderihallerne", "newcairo": "New Cairo", "echofab": "EchoFab", "fablabechofab": "EchoFab", "cept": "CEPT", "fablabcept": "CEPT", "fablabkhairpur": "Khairpur", "khairpur": "Khairpur", "fablabreykjavik": "Reykjavik", "reykjavik": "Reykjavik", "egypt": "Egypt", "fablabegypt": "Egypt", "fablaboulu": "Oulu", "oulu": "Oulu", "berytech": "Berytech", "fablabberytech": "Berytech", "bahrain": "Bahrain", "fablabbahrain": "Bahrain", "charlotte": "Charlotte Latin", "fablabcharlottelatin": "Charlotte Latin", "fablabsiena": "Santa Chiara", "santachiara": "Santa Chiara", "digiscope": "Digiscope", "fablabdigiscope": "Digiscope", "seoul": "BoldLab", "fablabseoul": "BoldLab", "fablabseoulinnovation": "BoldLab", "boldseoul": "BoldLab", "seoulinnovation": "BoldLab", "fablabbeijing": "Beijing", "fablaboshanghai": "O Shanghai", "oshanghai": "O Shanghai", "aalto": "Aalto", "fablabaalto": "Aalto", "lamachinerie": "La Machinerie", "dassault": "Dassault Systemes", "fablabdassault": "Dassault Systemes", "kannai": "Kannai", "fablabzoi": "ZOI", "zoi": "ZOI", "fablabirbid": "Irbid", "irbid": "Irbid", "fablabkamakura": "Kamakura", "kamakura": "Kamakura", "brighton": "Brighton", "fablabbrighton": "Brighton", "akgec": "AKGEC", "fablabakgec": "AKGEC", "fablabopendot": "Opendot", "opendot": "Opendot", "ecostudio": "EcoStudio", "fablabecostudio": "EcoStudio", "fct": "FCT", "fablabfct": "FCT", "bottrop": "Bottrop", "fablabbottrop": "Bottrop", "aachen": "Aachen", "fablabaachen": "Aachen", "fablabtrivandrum": "Trivandrum", "trivandrum": "Trivandrum", "fablabuae": "UAE", "uae": "UAE", "fablabkochi": "Kochi", "kochi": "Kochi", "fablabtechworks": "TechWorks Amman", "techworks": "TechWorks Amman", "singapore": "Singapore", "lakazlab": "LazLab", "fablabvigyanasharm": "Vigyan Asharm", "vigyanashram": "Vigyan Asharm", "fablabpuebla": "Puebla", "puebla": "Puebla", "wheaton": "Wheaton", "ciudadmexico": "Ciudad Mexico", "fablabmexico": "Ciudad Mexico", "barcelona": "Barcelona", "incitefocus": "Incite Focus", "fablabincitefocus": "Incite Focus", "winam": "Winam", "fablabkamplintfort": "Kamp-Lintfort", "kamplintfort": "Kamp-Lintfort", "fablabtecsup": "TECSUP", "tecsup": "TECSUP", "tecsupaqp": "TECSUP", "qbic": "QBIC", "esan": "ESAN", "fablabesan": "ESAN", "fablabrwanda": "Rwanda", "rwanda": "Rwanda", "fablablccc": "Lorain College", "lccc": "Lorain College", "bhubaneswar": "Bhubaneswar", "fablabszoil": "SZOIL", "szoil": "SZOIL", "fablabutec": "UTEC", "utec": "UTEC", "lima": "Lima", "taipei": "Taipei", "ucontinental": "Ucontinental", "akureyri": "Akureyri", "algarve": "Algarve", "farmlabalgarve": "Algarve", "bangalore": "Bangalore", "benfica": "Benfica", "chaihuo": "Chaihuo", "chandigarh": "Chandigarh", "cit": "CIT", "cpcc": "CPCC", "crunchlab": "Crunchlab", "deusto": "Deusto", "falabdeusto": "Deusto", "dhahran": "Dhahran", "ecae": "ECAE", "esne": "ESNE", "fablabat3flo": "At3flo", "fablaberfindergarden": "Erfindergarden", "fablabfacens": "Facens", "fablabgearbox": "Gearbox", "fablabisafjorour": "Isafjorour", "isafjorour": "Isafjorour", "fablabkromlaboro": "KromLaboro", "fablabmadridceu": "Madrid CEU", "fablabodessa": "Odessa", "fablabtembisa": "Tembisa", "fablabwgtn": "Wgtn", "fablabyachay": "Yachay", "fablabyucatan": "Yucatán", "yucatan": "Yucatán", "formshop": "Formshop Shanghai", "hkispace": "Hong Kong iSPACE", "ingegno": "Ingegno", "inphb": "INP-HB", "insper": "Insper", "ioannina": "Ioannina", "jubail": "Jubail", "kaust": "KAUST", "keolab": "KeoLAB", "kitakagaya": "Kitakagaya", "libya": "Libya", "napoli": "Napoli", "ningbo": "Ningbo-NexMaker", "plusx": "PlusX", "polytech": "Polytech", "riidl": "RIIDL", "sedi": "SEDI-Cup-ct", "stjude": "St. Jude", "tianhelab": "Tianhe Lab", "tinkerers": "Tinkerers", "twarda": "Twarda", "ucal": "UCAL", "uemadrid": "Universidad Europea", "ulima": "Ulima", "fablabsantiago": "Santiago", "fablabsocom": "SOCOM", "isafjordur": "Isafjordur"};

const nonDiacriticLetters = "abcdefghijklmnopqrstuvwxyz";

// simulation dimensions
const width = 2 * 928;
const height = 1.5 * 600;

// function to access zipped continent color pallete list
const colorRegion = key => {
    return continentColor[key];
};

// D3JS scaleOrdinal to access color and node shape pallets
const colorFab = d3.scaleOrdinal().range(FAB_PALETTE);
const shape = d3.scaleOrdinal().range(d3.symbols);

// define empty object that stores radiuses of each student/node based on their ID
const radius_dict = {};

// declare D3JS forceCollide
const forceCollide = d3.forceCollide();

// coordinates and radius of year-select pie
const pieX = 210,
    pieY = 720;
const pieRadius = 100;

// list of subject-area carousel options
const topicCarouselList = ["All", ...TOPICS.slice(1, -1)];