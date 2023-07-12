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
          v += 1;
        }
      });
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    });
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
  
    let links = links_not_filtered.filter(l => (node_ids.includes(l.target.id)||node_ids.includes(l.target)) && (node_ids.includes(l.source.id)||node_ids.includes(l.source)));
    
    return [nodes, node_ids, links];
  };
  
  const uniqueId = l => `${l.source.id}${l.target.id}${l.topic}${l.value}`;

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
  
  const calculateMaxStrength = () => {
    maxStrength = 0;
      links.forEach(l => {
        if (l.value > maxStrength) {
          maxStrength = l.value;
        }
      });
  }

const setLabs = node_ids => labs = getAllLabs(node_ids).sort();

const setCurrentLabHighlightList = () => {
    
    currentLabHighlightList = labs;
}

const createSimulation = () => {
    simulation = d3.forceSimulation(nodes)
    .force("boundary", forceBoundary(forceBoundaryMargin,forceBoundaryMargin,width-forceBoundaryMargin, height-forceBoundaryMargin))
    .force("link", d3.forceLink(links).id(d => d.id).strength(d => (normalize(d.value, 0, maxStrength) * 10 + 1) / SCALE_FACTOR))
    .force("charge", d3.forceManyBody().strength(-50 / SCALE_FACTOR))
    .force("center", d3.forceCenter(width / 2, height / 2));
};

const createAndFormatSVG = () => {
     svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("max-width", "100%")
    .style("height", "auto")
    .style("background-color", "black");
};

const linksToLink = isFirst => {
    if (isFirst) gl = svg.append("g").attr("transform", "translate(150, -10)");

    const sel = gl.selectAll("line").data(links, l=>uniqueId(l));
    
    sel.exit()
        .remove();

    sel.enter().append("line").merge(sel)
        .attr("stroke-width", d => Math.sqrt(d.value))
        .style("stroke-linecap", "round")
        .attr("opacity", data => (normalize(data.value, 0, maxStrength) / 2 + 0.5)/ SCALE_FACTOR);

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
            return color(lab);
        })
        .attr("opacity", 0.5)
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    return g.selectAll("circle");
};

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  const calibrateSimulation = () => {
    simulation.force("collision", forceCollide.radius(d => d.r / 1.2));

  simulation.force("link", d3.forceLink(links).id(d => d.id).distance(d => {
    return Math.max(referenceCache[d.target.id][currentTopic], referenceCache[d.source.id][currentTopic]);
  }));
  };

  const setNodeTooltips = node => {
    let r = node.append("title")
    .text(d => {
      return d.id.split(";")[0];
    });
    
  r = node.on('click', (d, i) => { window.open(i.id.split(";")[1], "_blank") });

  return r;
  };

  const setSimulationTick = (node, link) => {
    simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        
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

    simulation
      .force("link", d3.forceLink(links).id(d => d.id)
        .strength(d => (normalize(d.value, 0, maxStrength) * 10 + 1) / SCALE_FACTOR)
        .distance(d => Math.max(referenceCache[d.target.id][currentTopic], referenceCache[d.source.id][currentTopic])));

    let topicLinks = [];
    links.forEach(l => {
      if (l.topic == topic || topic == "All") {
        topicLinks.push(l);
      }
    });
    node.attr("r", data => referenceCache[data.id][topic]);
      simulation.force("link", d3.forceLink(topicLinks).id(d => d.id).distance(d => Math.max(referenceCache[d.target.id][currentTopic], referenceCache[d.source.id][currentTopic])));
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

const setYear = year => {
    currentYear = year;
    node.attr("opacity", data => {
      const y = data.id.split(";")[1].split("/")[3];
      const lab = data.id.split(";")[1].split("/")[5];
      if ((y == year || year == "All") && currentLabHighlightList.includes(lab)) {
        return 0.5;
      }
      else {
        return minOpacity;
      }
    });
    link.attr("opacity", data => {
      const source = data.source.id;
      const sourceYear = source.split(";")[1].split("/")[3];
      const sourceLab = source.split(";")[1].split("/")[5];
      const target = data.target.id;
      const targetYear = target.split(";")[1].split("/")[3];
      const targetLab = target.split(";")[1].split("/")[5];
      let sourceIsOn = false;
      let targetIsOn = false;
      if ((sourceYear == year || year == "All") && (currentLabHighlightList.includes(sourceLab))) {
        sourceIsOn = true;
      } 
      if ((targetYear == year || year == "All") && (currentLabHighlightList.includes(targetLab))) {
        targetIsOn = true;
      }

      if (sourceIsOn && targetIsOn) return (normalize(data.value, 0, maxStrength) / 2 + 0.5)/ SCALE_FACTOR;

      else if (sourceIsOn || targetIsOn) {

      }

      else {
        return 0.1;
      }
    });

    link.attr("style", "opacity: url(#MyGradient)");
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
      .attr('fill', d => colorFab(d.data.key))
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
  .style('fill', 'black')
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