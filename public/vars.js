

let minMaxMap = {},
  numLinksDict = {},
  links_not_filtered,
  nodes_not_filtered,
  nodes,
  node_ids,
  links,
  currentLabHighlightList,
  currentYear = "All",
  maxStrength,
  labs,
  simulation,
  svg,
  link, 
  node,
  defs,
  pieG,
  minNumConnections = 20,
  g, gl,
  referenceCache,
  currentTopic = "All",
  mapMin = 1,   // Start of the output range
  mapMax = 60,
  startDegree = -135,   // Start of the dial in degrees
  endDegree = 135,   // End of the dial in degrees
  startPos = -48,
  currentDialDeg = startPos,
  numText,
  dialGroup,
  mousePos,
  linearGradient,
  linearGradientDict = {}; 