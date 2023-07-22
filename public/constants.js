const NODE_STROKE_WIDTH_HIGHLIGHTED = "1.5px",
    HOVER_NODE_STROKE_COLOR = "black",
    NOT_HOVERING_NODE_STROKE_WIDTH = "0px",
    NOT_HOVERING_NODE_STROKE_COLOR = "",
    RGB_LINE_COLOR = "0,0,0",
    LINE_WIDTH = "0.3px",
    CAROUSEL_RECT_STROKE_COLOR = "",
    CAROUSEL_RECT_STROKE_WIDTH = "0px",
    CAROUSEL_SELECTOR_COLOR = "black",
    DIAL_OUTLINE_COLOR = "grey",
    DIAL_TEXT_COLOR = "black",
    OVERLAY_TEXT_LINK_COLOR = "#7e7eed";
// there are also CSS variables under :root

const SCALE_FACTOR = 1,
    forceBoundaryMargin = 30;

const minOpacity = 0.15;

const NODE_HIGHLIGHTED_OPACITY = 1;
const MINIMUM_STRENGTH_CONSTANT = 100;

const PIE_SLICE_COLOR = 'grey',
    PIE_TEXT_COLOR = 'white',
    DIAL_STICK_COLOR = 'grey',
    CAROUSEL_OPTION_COLOR = 'grey',
    CAROUSEL_TEXT_COLOR = 'white';

const FAB_PALETTE = [
    "#f1f2f2",
    "#f1d2f2",
    "#f1b2f2",
    "#f04260",
    "#4abfbd",
    "#284fb5",
    "#f05c71"
];

const NODE_REGION_PALETTE = [
    "#1da619",
    "#f04260",
    "#4abfbd",
    "#284fb5",
    "#f05be1",
    "#87743d"
];
const continent = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania"
];
const continentColor = {};
for (let i = 0; i < NODE_REGION_PALETTE.length; i++) continentColor[continent[i]] = NODE_REGION_PALETTE[i];

const NODE_SIZE_MULTIPLIER = 50;
const NODE_SIZE_MINIMUM = 5;

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

const width = 2 * 928;
const height = 1.5 * 600;

const colorRegion = key => {
    return continentColor[key];
};
const colorFab = d3.scaleOrdinal().range(FAB_PALETTE);
const shape = d3.scaleOrdinal().range(d3.symbols);

const radius_dict = {};

const forceCollide = d3.forceCollide();

const pieX = 210,
    pieY = 720;
const pieRadius = 100;

const topicCarouselList = ["All", ...TOPICS.slice(1, -1)];