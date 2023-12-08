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