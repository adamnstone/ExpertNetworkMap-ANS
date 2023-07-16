const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const toTitleCase = str => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
};

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

const calculateMinMax = (ns, ls, topic) => {
    let minV = Infinity;
    let maxV = -Infinity;
    ns.forEach(n => {
      let v = 0;
      ls.forEach(l => {
        if (l.target == n.id && (topic == l.topic || topic == "All")) {
          v += l.value;//1;
        }
      });
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    });
    //console.log("TOPIC", topic, minV, maxV);
    return {min: minV, max: maxV};
  };

  const sumObj = obj => Object.values(obj).reduce((a, b) => a + b, 0);

  const getAllLabs = node_ids => {
    let labs = [];
    for (let i = 0; i < node_ids.length; i++) {
      const node_id = node_ids[i];
      const lab = node_id.split(";")[1].split("/")[5];
      if (!labs.includes(lab)) labs.push(lab);
    }
    
    return labs;
  };
  
  const filterStudents = (nodes_not_filtered, links_not_filtered, filterFunc) => {
    let nodes = nodes_not_filtered.filter(n => filterFunc(n));
  
    let node_ids = nodes.map(n => n.id);

    let links = JSON.parse(JSON.stringify(links_not_filtered)).filter(l => { // DEEPCOPY SOLVES HEISENBUG!
      //if (l.source == "Árni Björnsson;https://fabacademy.org/2022/labs/isafjordur/students/arni-bjornsson/") debugger;
      return ((node_ids.includes(l.target.id)||node_ids.includes(l.target)) && (node_ids.includes(l.source.id)|node_ids.includes(l.source)));
    });
    //debugger;
    return [nodes, node_ids, links];
  };
  
  const uniqueId = l => {
    let sT;
    let tT;
    if (typeof l.source == 'string') {sT = l.source; tT = l.target;}
    else {sT = l.source.id; tT = l.target.id;}

    return `${sT}${tT}${l.topic}${l.value}`;
  };

  const createNumLinksDictFrom_not_filtered = () => {
    for (let i = 0; i < nodes_not_filtered.length; i++) {
      let toAdd = {"source": {}, "target": {}};
      for (let j = 0; j < TOPICS.length; j++) {
        toAdd.source[TOPICS[j]] = 0;
        toAdd.target[TOPICS[j]] = 0;
      }
      numLinksDict[nodes_not_filtered[i].id] = toAdd;
    }
    for (let i = 0; i < links_not_filtered.length; i++) {
      const l = links_not_filtered[i];
      numLinksDict[l.target].target[l.topic] += l.value;
      numLinksDict[l.source].source[l.topic] += l.value;
    }
  };


  const create_not_filteredFromJSON = async () => {
    return d3.json('final_data.json').then(data => {
        links_not_filtered = data.links.map(d => Object.assign({}, d)).filter(l => l.target != l.source);
        nodes_not_filtered = data.nodes.map(d => Object.assign({}, d));
    });
  };

  const assignFilter = filterResult => [nodes, node_ids, links] = filterResult;

  const transferNot_filteredToArrays = () => {
    assignFilter(filterStudents(nodes_not_filtered, links_not_filtered, n => {
      if (currentTopic == "All") {
        return sumObj(numLinksDict[n.id].target) >= minNumConnections;
      }
      else {
        return numLinksDict[n.id].target[currentTopic] >= minNumConnections;
      }
    }));
  };

  const initializeDefs = () => {
    linearGradient = d3.select("defs").selectAll("linearGradient");
  };

  const getGradientID = l => {
    let sForm, tForm;
    try {
      sForm = l.source.id.replace(/\W/g, '_');
    }
    catch {
      sForm = l.source.replace(/\W/g, '_');
    }

    try {
      tForm = l.target.id.replace(/\W/g, '_');
    }
    catch {
      tForm = l.target.replace(/\W/g, '_');
    }

    return `gradient_${sForm}|${tForm}`
  };

  const registerLinearGradients = links => {
    //console.log("Registering liear gradients");
    const elem = linearGradient.data(links, l => getGradientID(l));
    //console.log(links);
    elem.exit()
      .each(function(e,i) {
        const d = d3.select(this);
        document.remove(linearGradient[getGradientID(d)]);
        delete linearGradient[getGradientID(d)];
      })
      .remove();

    const enter = elem.enter().append("linearGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("id", d => getGradientID(d))
      .attr("x1", 0)
      .attr("x2", 1)
      .attr("y1", 0)
      .attr("y2", 0);

    enter.append("stop").attr("offset", "0%").attr("stop-color", "rgba(255,255,255,1)");
    enter.append("stop").attr("offset", "100%").attr("stop-color", "rgba(255,255,255,0)");
    
    d3.select("defs").selectAll("linearGradient").each(function(e,i) {
      //console.log(i, d, this);
      //console.log(this);
      const d = d3.select(this)
      linearGradientDict[getGradientID(e)] = d;}/*(e, i) => {
      console.log(e, i);
        const d = d3.select(this);
        console.log(d);
        linearGradientDict[getGradientID(d)] = d;
      }*/);
  };

  const condenseLinksforSimulation = ls => {
    let toReturn = [];
    for (let l of ls) {
      condensed = false;
      for (let i = 0; i < toReturn.length; i++) {
        r = toReturn[i];
        let lTargStr;
        let rTargStr;
        let lSourStr;
        let rSourStr;
        if (typeof l.target == 'string') lTargStr = l.target;
        else lTargStr = l.target.id;
        if (typeof r.target == 'string') rTargStr = r.target;
        else rTargStr = r.target.id;
        if (typeof l.source == 'string') lSourStr = l.source;
        else lSourStr = l.source.id;
        if (typeof r.source == 'string') rSourStr = r.source;
        else rSourStr = r.source.id;
        //console.log(lTargStr, rTargStr, lSourStr, rSourStr);
        if ((lTargStr== rTargStr && lSourStr == rSourStr) || (lTargStr == rSourStr && lSourStr == rTargStr)) {
          toReturn[i].value += l.value;
          condensed = true;
          break;
        }
      }
      if (!condensed) {
        delete l.topic;
        toReturn.push(l);
      }
    }

    //reregisterLinearGradients(toReturn);

    return toReturn;
  };
  
  const calculateMaxStrength = () => {
    maxStrength = 0;
      links.forEach(l => {
        if (l.value > maxStrength) {
          maxStrength = l.value;
        }
      });
  }

const setLabs = node_ids => labs = getAllLabs(node_ids).sort();

const setCurrentLabHighlightList = () => currentLabHighlightList = labs;

const calculateSimulationStrength = (d, maxstrength) => (d => MINIMUM_STRENGTH_CONSTANT + Math.sqrt((normalize(d.value, 0, maxStrength) * 10 + 1) / SCALE_FACTOR)); // so that it returns the callback function

const createSimulation = () => {
    simulation = d3.forceSimulation(nodes)
    .force("boundary", forceBoundary(forceBoundaryMargin,forceBoundaryMargin,width-forceBoundaryMargin, height-forceBoundaryMargin))
    .force("link", d3.forceLink(links).id(d => d.id).strength(d => calculateSimulationStrength(d, maxStrength)))
    .force("charge", d3.forceManyBody().strength(-60)/*(d3.forceManyBody().strength(-50 / SCALE_FACTOR)*/)
    .force("center", d3.forceCenter(width / 2, height / 2));
};

const createAndFormatSVG = () => {
     svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("max-width", "100%")
    .style("height", "auto")
    .style("background-color", "black");

    transformation = svg.node().getCTM();
   svgPoint = svg.node().createSVGPoint();
   boundingRect = svg.node().getBoundingClientRect();

};

const linksToLink = isFirst => {
    if (isFirst) gl = svg.append("g").attr("transform", "translate(150, -10)");

    const sel = gl.selectAll("path").data(condenseLinksforSimulation(links), l=>uniqueId(l));
    
    sel.exit()
        .remove();

    sel.enter().append("path").merge(sel)
        .attr("fill", "none") //ADDED
        .attr("stroke-width", "1px"/*d => Math.sqrt(d.value)*/) // for 
        .style("stroke-linecap", "round")
        .attr("opacity", data => (normalize(data.value, 0, maxStrength) / 2 + 0.5)/ SCALE_FACTOR);
        //console.log("do I need to set opacity here?");

    return sel;
};

const calculateMinMaxMapFromFiltered = () => { // now it's not "FromFiltered"
    [...TOPICS, "All"].forEach(topic => {
        minMaxMap[topic] = calculateMinMax(nodes_not_filtered, links_not_filtered, topic);
      });
};

const nodesToNodeAndFormat = () => {
    node = svg.append("g").attr("transform", "translate(150, -10)");
    g = node;
};

const configureNode = (node, nodes) => {    
    const sel = g.selectAll("circle").data(nodes, n=>n.id);
    
    sel.exit()
        .remove();

    const ent = sel.enter().append("circle").merge(sel);
    
    ent.attr("r", data => referenceCache[data.id]["All"]);
    
    ent.attr("fill", d => {
            const lab = d.id.split(";")[1].split("/")[5]; 
            return colorRegion(LABS_CONTINENT[lab]);
        })
        .attr("opacity", NODE_HIGHLIGHTED_OPACITY)
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    return g.selectAll("circle");
};

function dragstarted(event, d) {
    objectBeingDragged = d3.select(this);
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    mouseIsDragging = true;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    mouseIsDragging = false;
    console.log("dragend", pointerOutOfSVG());
    const pointerOut = pointerOutOfSVG();
    if (pointerOut) {
      tooltipMouseleave(null, null, objectBeingDragged);
    }
    objectBeingDragged = null;
  }

  const getSimulationForceLinkDistance = d => referenceCache[d.target.id][currentTopic] + referenceCache[d.source.id][currentTopic];// this is good but it doesn't completely fix the circle overlapping problem because of circles that are touching but aren't linked  //Math.max(referenceCache[d.target.id][currentTopic], referenceCache[d.source.id][currentTopic]);

  const calibrateSimulation = () => {
    simulation.force("collision", forceCollide.radius(d => d.r / 1.2));

    simulation.force("link", d3.forceLink(links).id(d => d.id).distance(d => {
      return getSimulationForceLinkDistance(d);
    }));
  };

  /*const setNodeTooltips = node => {
    /*let r = node.append("title")
    .text(d => {
      return d.id.split(";")[0];
    });
    
  r = node.on('click', (d, i) => { window.open(i.id.split(";")[1], "_blank") });

  return r;
  };*/

  //const activationCheck = (year, lab) => (year == currentYear || currentYear == "All") && (currentLabHighlightList.includes(lab));
  const activationCheck = (currentYear, currentLabHighlightList, year, lab) => (year == currentYear || currentYear == "All") && (currentLabHighlightList.includes(lab));

  const linkTick = () => {
    link.attr("d", d => {
      const gradientID = getGradientID(d);
      //const lg = linearGradientDict[gradientID];
      const lg = document.getElementById(gradientID);
      /*lg.attr("x1", d.source.x)
        .attr("y1", d.source.y)
        .attr("x2", d.target.x)
        .attr("y2", d.target.y)*/
      const {source,
        sourceYear,
        sourceLab,
        target,
        targetYear,
        targetLab} = getLinkSummary(d);
      const sourceIsActivated = activationCheck(sourceYear, sourceLab);
      const targetIsActivated = activationCheck(targetYear, targetLab);
      if (!((sourceIsActivated && targetIsActivated) || (!(sourceIsActivated || targetIsActivated)))) { // if only one is activated
        if (sourceIsActivated) {
          lg.setAttribute("x1", d.source.x);
          lg.setAttribute("y1", d.source.y);
          lg.setAttribute("x2", d.target.x);
          lg.setAttribute("y2", d.target.y);
        }
        else {
          lg.setAttribute("x2", d.source.x);
          lg.setAttribute("y2", d.source.y);
          lg.setAttribute("x1", d.target.x);
          lg.setAttribute("y1", d.target.y);
        }
      }

      const path = d3.path();
      path.moveTo(d.source.x, d.source.y);
      path.lineTo(d.target.x, d.target.y);
      return path.toString();  // return the path data as a string
      /*const path = d3.path();
      path.moveTo(d.source.x, d.source.y);
      path.lineTo(d.target.x, d.target.y);
      const gradientID = getGradientID(d);
      const lg = linearGradientDict[gradientID];
      lg.attr("x1", d.source.x);
      lg.attr("x2", d.target.x);
      lg.attr("y1", d.source.y);
      lg.attr("y2", d.target.y);
      console.log(lg);
      return path;*/
    });
  };

  const setSimulationTick = (node, link) => {

    linkTick(); // so that the directions and everything are correct before the user first drags on the simulation
    simulation.on("tick", () => {
        /*link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);*/
        
        linkTick();
        
        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
      });
  };

  const selectByTopic = topic => {
    currentTopic = topic;
    let maxStrength = 0;
    links.forEach(l => {
      if (l.value > maxStrength && (l.topic == topic || topic == "All")) {
        maxStrength = l.value;
      }
    });

    link
      .attr('opacity', data => {
        if (data.topic == topic || topic == "All") {
          return (normalize(data.value, 0, maxStrength) / 2 + 0.5) / SCALE_FACTOR;
        }
        else {
          return 0;
        }
      });
      //console.log("also do I need to set opacity for lines here?");

    simulation
      .force("link", d3.forceLink(links).id(d => d.id)
        .strength(d => calculateSimulationStrength(d, maxStrength))
        .distance(d => getSimulationForceLinkDistance(d)));

    let topicLinks = [];
    links.forEach(l => {
      if (l.topic == topic || topic == "All") {
        topicLinks.push(l);
      }
    });
    
    node.attr("r", data => referenceCache[data.id][topic]);
      simulation.force("link", d3.forceLink(topicLinks).id(d => d.id).distance(d => getSimulationForceLinkDistance(d)));
      forceCollide.initialize(nodes);
      simulation.alpha(1).restart();
    };

const configureGlowDefinitions = () => {
    defs = svg.append("defs");

  //Filter for the outside glow
  defs.append("filter")
      .attr("id", "sofGlow")
      .attr("width", "300%")
      .attr("height", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%")
      .attr("stdDeviation","1")
      .attr("result","coloredBlur")
      .append("feGaussianBlur")
      .attr("in", "thicken")
      .attr("stdDeviation", "1")
      .attr("result", "blurred");
};

const getLinkSummary = data => {
  const source = data.source.id;
  const sourceYear = source.split(";")[1].split("/")[3];
  const sourceLab = source.split(";")[1].split("/")[5];
  const target = data.target.id;
  const targetYear = target.split(";")[1].split("/")[3];
  const targetLab = target.split(";")[1].split("/")[5];
  return {
    source,
    sourceYear,
    sourceLab,
    target,
    targetYear,
    targetLab
  };
};

const setLinkOpacity = () => {
  link.attr("opacity", data => {
    const {source,
      sourceYear,
      sourceLab,
      target,
      targetYear,
      targetLab} = getLinkSummary(data);
    let sourceIsOn = false;
    let targetIsOn = false;

    if (activationCheck(sourceYear, sourceLab)) {
      sourceIsOn = true;
    } 
    if (activationCheck(targetYear, targetLab)) {
      targetIsOn = true;
    }

    if ((sourceIsOn || targetIsOn) && !(sourceIsOn && targetIsOn)) {
      return null;
      /*if (sourceIsOn) {
        return "url(#LineFadeForward)";
      }
      return "url(#LineFadeBackward)";*/
    }
    return 1;
  });
  link.attr("stroke", data => { // SHOULD USE LINKS FROM SIMULATION BC OF CONDENSING?
    const source = data.source.id;
    const sourceYear = source.split(";")[1].split("/")[3];
    const sourceLab = source.split(";")[1].split("/")[5];
    const target = data.target.id;
    const targetYear = target.split(";")[1].split("/")[3];
    const targetLab = target.split(";")[1].split("/")[5];
    let sourceIsOn = false;
    let targetIsOn = false;
    
    if ((sourceYear == currentYear || currentYear == "All") && (currentLabHighlightList.includes(sourceLab))) {
      sourceIsOn = true;
    } 
    if ((targetYear == currentYear || currentYear == "All") && (currentLabHighlightList.includes(targetLab))) {
      targetIsOn = true;
    }

    if (sourceIsOn && targetIsOn) {
      return "rgba(255,255,255"+((normalize(data.value, 0, maxStrength) / 2 + 0.5)/ SCALE_FACTOR).toString()+")";
    }
    else if (sourceIsOn || targetIsOn) {
      return `url(#${getGradientID(data)})`;
      /*if (sourceIsOn) {
        return "url(#LineFadeForward)";
      }
      return "url(#LineFadeBackward)";*/
    }
    else {
      return "rgba(255,255,255,0.05)";
    }
  });
};

const setYear = year => {
    currentYear = year;
    /*node.attr("opacity", data => {
      const y = data.id.split(";")[1].split("/")[3];
      const lab = data.id.split(";")[1].split("/")[5];
      if ((y == year || year == "All") && currentLabHighlightList.includes(lab)) {
        return NODE_HIGHLIGHTED_OPACITY;
      }
      else {
        return minOpacity;
      }
    });
    setLinkOpacity();
    linkTick();*/
    updateData({
      minNumConnections,
      simulation,
      svg,
      g,
      "gl": gl_
    })
  };

const createPie = () => {
    const pieG = svg.append("g")
    .attr("transform", "translate(" + pieX + "," + pieY + ") rotate(" + 360/14 + ")");

  var pieData = {"All": 1};

  for (let i = 2018; i <= 2023; i++) {
    pieData[i] = 1;
  }

  var pieColor = d3.scaleOrdinal()
  .domain(Object.keys(pieData))
  .range(COLOR_PALETTE);

  var pie = d3.pie()
  .value(function(d) {return d.value; })
  var data_ready = pie(Object.entries(pieData).map(([key, value]) => ({key, value})));

  var arcGenerator = d3.arc()
  .innerRadius(50)
  .outerRadius(pieRadius)

  const rotatePie = d => {
    var rotate = -((d.startAngle + d.endAngle) / 2);
    pieG.transition()
      .duration(1000)
      .attr("transform", "translate(" + pieX + "," + pieY + ") rotate(" + (rotate / Math.PI * 180) + ")");
  };

  pieG
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
      .attr('d', arcGenerator)
      .attr('fill', PIE_SLICE_COLOR/*d => colorFab(d.data.key)*/)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .on('click', function (event, d) {
          // Rotate pie to clicked segment
          setYear(d.data.key);
          rotatePie(d);
        });

  pieG
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){ return d.data.key})
  .attr("dy", "0.3em")
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ") rotate(" + (d.startAngle + d.endAngle)/2 * (180/Math.PI) + ")";  })
  .style('text-anchor', 'middle')
  .style('fill', PIE_TEXT_COLOR)
  .attr("font-weight", 700)
  .attr("font-family", "Saira")
  .style("font-size", 18)
  .on('click', function (event, d) {
    // Rotate pie to clicked segment
    setYear(d.data.key);
    rotatePie(d);
  });
};

const createReferenceCache = () => {
  referenceCache = {};
  ["All", ...TOPICS.slice(1, -1)].forEach(topic => {
    nodes_not_filtered.forEach(data => {
      let r = 0;
      links_not_filtered.forEach(l => {
        if (l.target == data.id && (topic == "All" || l.topic == topic)) {
          r += l.value;
        }
      });
      r = normalize(r, minMaxMap[topic].min, minMaxMap[topic].max) * NODE_SIZE_MULTIPLIER * ((1 - (1/minMaxMap[topic].max))/2) + NODE_SIZE_MINIMUM;
      r /= SCALE_FACTOR;
      data.r = r;
      if (!(data.id in referenceCache)) referenceCache[data.id] = {};
      referenceCache[data.id][topic] = r;
    });
  });
};

const centerText = (txt, xPos) => {
  let textWidth = txt.node().getBBox().width;
    txt.attr("x", (xPos - (textWidth / 2)));
};

window.addEventListener('pointermove', (event) => {
  mousePos = { x: event.clientX, y: event.clientY };
  /*Tooltip.style("left", (mousePos.x + body.scrollLeft + 50) + "px"); // offset good aesthetically and prevents "event bubbling" when tooltip blocks circle
  Tooltip.style("top", (mousePos.y + body.scrollTop - 10) + "px");*/

  let tooltipWidth = Tooltip.node().offsetWidth; // Width of the tooltip
  let tooltipHeight = Tooltip.node().offsetHeight; // Height of the tooltip
  let windowWidth = document.documentElement.clientWidth; // Width of the window
  let windowHeight = document.documentElement.clientHeight; // Height of the window
  
  let x = event.clientX + body.scrollLeft + 50;
  let y = event.clientY + body.scrollTop - 10;

  //console.log("y", y, "event.clientY", event.clientY, "scrollTOp", body.scrollTop, "tooltipHeight", tooltipHeight, "windowHeight", windowHeight);

  //console.log(x, tooltipWidth, innerWidth);

  // Consider a buffer of 10 pixels or so to ensure that 
  // the tooltip doesn't touch the edge of the viewport.
  let buffer = {"x": 50, "y": 10};

  // If the tooltip would go off the right side of the screen
  if (x + tooltipWidth + buffer.x - body.scrollLeft > windowWidth) {
    x = x - tooltipWidth - (50 * 2);
  }

  // If the tooltip would go off the bottom of the screen
  if (y + tooltipHeight + buffer.y - body.scrollTop > windowHeight) {
    y = y - tooltipHeight + (10*2);
  }

  Tooltip.style("left", x + "px");
  Tooltip.style("top", y + "px");
});

const pointerOutOfSVG = () => {
  const el = document.elementFromPoint(mousePos.x, mousePos.y);
  return !(svg.node() === el || svg.node().contains(el));
};

const tooltipMouseover = function(event, d) {
  if (mouseIsOver) return;
  mouseIsOver = true;
  //console.log("mouseover");
  Tooltip
    .style("display", "initial")
    .style("visibility", "visible");
  
  d3.select(this)
    .style("stroke", "black");
}

var tooltipMousemove = function(event, d) {
  //console.log("mousemove");
  //var pos = cursorPoint(event);
  //pos = {"x": d.x, "y": d.y};
  Tooltip
    .html("<span>Student: " + d.id.split(";")[0] + "<br>Year: " + d.id.split(";")[1].split("/")[3] + "<br>Lab: " + d.id.split(";")[1].split("/")[5] + "<br>Region: <span style=\"color:"+colorRegion(LABS_CONTINENT[d.id.split(";")[1].split("/")[5]])+";\">" + LABS_CONTINENT[d.id.split(";")[1].split("/")[5]] + "</span></span>");
    //.style("left", (pos.x + 70) + "px")
    //.style("top", (pos.y) + "px");
}

var tooltipMouseleave = function(event, d, obj=null) {
  if (mouseIsDragging) return;
  mouseIsOver = false;
  Tooltip
    .style("display", "none")
    .style("visbility", "hidden");

  (obj == null ? d3.select(this) : obj)
    .style("stroke", "white");
}