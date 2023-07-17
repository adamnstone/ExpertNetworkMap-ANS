const NODE_STROKE_WIDTH_HIGHLIGHTED = "1.5px",
      HOVER_NODE_STROKE_COLOR = "black",
      NOT_HOVERING_NODE_STROKE_WIDTH = "0px",
      NOT_HOVERING_NODE_STROKE_COLOR = "",
      RGB_LINE_COLOR = "0,0,0",
      LINE_WIDTH = "0.3px",
      CAROUSEL_RECT_STROKE_COLOR = "",
      CAROUSEL_RECT_STROKE_WIDTH = "0px",
      CAROUSEL_SELECTOR_COLOR = "black",
      DIAL_OUTLINE_COLOR = "grey"/*FAB_PALETTE[0]*/,
      DIAL_TEXT_COLOR = "black"/*"white"*/,
      OVERLAY_TEXT_LINK_COLOR = "#7e7eed"/*"#aaaaff"*/;

      // TO MODIFY WITH CSS: tooltip stroke + stroke-width, can make node stroke more efficient, text color

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

//const COLOR_PALETTE = ["#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9", "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe", "#875b44", "#699ab3", "#94bc19", "#7d5bf0", "#d24dfe", "#c85b74", "#68ff57", "#b62347", "#994b91", "#646b8c", "#977ab4", "#d694fd", "#c4d5b5", "#fdc4bd", "#1cae05", "#7bd972", "#e9700a", "#d08f5d", "#8bb9e1", "#fde945", "#a29d98", "#1682fb", "#9ad9e0", "#d6cafe", "#8d8328", "#b091a7", "#647579", "#1f8d11", "#e7eafd", "#b9660b", "#a4a644", "#fec24c", "#b1168c", "#188cc1", "#7ab297", "#4468ae", "#c949a6", "#d48295", "#eb6dc2", "#d5b0cb", "#ff9ffb", "#fdb082", "#af4d44", "#a759c4", "#a9e03a", "#0d906b", "#9ee3bd", "#5b8846", "#0d8995", "#f25c58", "#70ae4f", "#847f74", "#9094bb", "#ffe2f1", "#a67149", "#936c8e", "#d04907", "#c3b8a6", "#cef8c4", "#7a9293", "#fda2ab", "#2ef6c5", "#807242", "#cb94cc", "#b6bdd0", "#b5c75d", "#fde189", "#b7ff80", "#fa2d8e", "#839a5f", "#28c2b5", "#e5e9e1", "#bc79d8", "#7ed8fe", "#9f20c3", "#4f7a5b", "#f511fd", "#09c959", "#bcd0ce", "#8685fd", "#98fcff", "#afbff9", "#6d69b4", "#5f99fd", "#aaa87e", "#b59dfb", "#5d809d", "#d9a742", "#ac5c86", "#9468d5", "#a4a2b2", "#b1376e", "#d43f3d", "#05a9d1", "#c38375", "#24b58e", "#6eabaf", "#66bf7f", "#92cbbb", "#ddb1ee", "#1be895", "#c7ecf9", "#a6baa6", "#8045cd", "#5f70f1", "#a9d796", "#ce62cb", "#0e954d", "#a97d2f", "#fcb8d3", "#9bfee3", "#4e8d84", "#fc6d3f", "#7b9fd4", "#8c6165", "#72805e", "#d53762", "#f00a1b", "#de5c97", "#8ea28b", "#fccd95", "#ba9c57", "#b79a82", "#7c5a82", "#7d7ca4", "#958ad6", "#cd8126", "#bdb0b7", "#10e0f8", "#dccc69", "#d6de0f", "#616d3d", "#985a25", "#30c7fd", "#0aeb65", "#e3cdb4", "#bd1bee", "#ad665d", "#d77070", "#8ea5b8", "#5b5ad0", "#76655e", "#598100", "#86757e", "#5ea068", "#a590b8", "#c1a707", "#85c0cd", "#e2cde9", "#dcd79c", "#d8a882", "#b256f9", "#b13323", "#519b3b", "#dd80de", "#f1884b", "#74b2fe", "#a0acd2", "#d199b0", "#f68392", "#8ccaa0", "#64d6cb", "#e0f86a", "#42707a", "#75671b", "#796e87", "#6d8075", "#9b8a8d", "#f04c71", "#61bd29", "#bcc18f", "#fecd0f", "#1e7ac9", "#927261", "#dc27cf", "#979605", "#ec9c88", "#8c48a3", "#676769", "#546e64", "#8f63a2", "#b35b2d", "#7b8ca2", "#b87188", "#4a9bda"]

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
  "#f05be1"
];
const continent = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America"
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

const width = 2*928;
const height = 1.5*600;
//const color = d3.scaleOrdinal().range(COLOR_PALETTE);
//const color = d3.scaleOrdinal().range(NODE_REGION_PALETTE);//d3.scaleOrdinal().range(COLOR_PALETTE);
const colorRegion = key => {
  return continentColor[key];
};
const colorFab = d3.scaleOrdinal().range(FAB_PALETTE);
const shape = d3.scaleOrdinal().range(d3.symbols);

const radius_dict = {};

const forceCollide = d3.forceCollide();

const pieX = 210, pieY = 720;
const pieRadius = 100;

const topicCarouselList = ["All", ...TOPICS.slice(1, -1)];