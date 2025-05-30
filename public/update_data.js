const updateCallbacks = [
    (data, absl) => {
        const f = (nodes_not_filtered, links_not_filtered, filterFunc) => {
            let nodes = nodes_not_filtered.filter(n => filterFunc(n));
  
            let node_ids = nodes.map(n => n.id);
            let links = JSON.parse(JSON.stringify(links_not_filtered)).filter(l => { // deepcopy solves heisenbug
                return (l.topic == absl.topic || absl.topic == "All") && (node_ids.includes(l.target)) && (node_ids.includes(l.source));
            });
  
            return [nodes, links];
        };
        const [nodes, links] = f(data.nodes, data.links, n => {
            if (absl.topic == "All") {
                return sumObj(numLinksDict[n.id].target) >= absl.minNumConnections;
            } else {
                return numLinksDict[n.id].target[absl.topic] >= absl.minNumConnections;
            }
        });
        return {
            nodes,
            links
        };
    }
  ];
  
  const calculationCallbacks = [
    (data, absl) => {
        let maxStrength = 0;
        data.links.forEach(l => {
            if (l.value > maxStrength) {
                maxStrength = l.value;
            }
        });
        return {
            maxStrength
        };
    },
    (data, absl) => {
        return {
            "condensedLinks": condenseLinksforSimulation(data.links)
        }
    },
    (data, absl, calcs) => {
        const sel = absl.gl.selectAll("path").data(calcs.condensedLinks, l => uniqueId(l));
  
        sel.exit()
            .remove();
  
        const ent = sel.enter().append("path").merge(sel);
  
        return {
            "link": ent
        };
    },
    (data, absl) => {
        const sel = absl.g.selectAll("circle").data(data.nodes, n => n.id);
        sel.exit()
            .remove();
  
        const ent = sel.enter().append("circle").merge(sel);
  
        return {
            "node": ent
        };
    }
  ];
  
  const attributeCallbacks = [
      (data, calcs, absl) => { // node radii
          calcs.node.attr("r", d => {
              return referenceCache[d.id][absl.topic];
          });
          absl.simulation.nodes(data.nodes);
          forceCollide.initialize(data.nodes);
      }, // simulation edges + node collision circles
      (data, calcs, absl) => {
          absl.simulation.force("link", d3.forceLink(calcs.condensedLinks).id(d => d.id).distance(d => getSimulationForceLinkDistance(d)));
          absl.simulation.force("collision", forceCollide.radius(d => d.r));
      },
      (data, calcs, absl) => { // coloring nodes by continent, setting node opacity, defining dragging behavior
          calcs.node.attr("fill", d => {
                  const lab = d.id.split(";")[1].split("/")[5];
                  return colorRegion(LABS_CONTINENT[lab]);
              })
              .attr("opacity", NODE_HIGHLIGHTED_OPACITY)
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));
      },
      (data, calcs, absl) => { // setting edge stroke width and linecap
          calcs.link.attr("fill", "none")
              .attr("stroke-width", LINE_WIDTH)
              .style("stroke-linecap", "round");
      },
      (data, calcs, absl) => { // manipulate linear gradient SVGs for edges where one node is highlighted and one isn't
          const linkTick = () => {
              calcs.link.attr("d", d => {
                  const gradientID = getGradientID(d);
                  const lg = document.getElementById(gradientID);
                  const {
                      source,
                      sourceYear,
                      sourceLab,
                      target,
                      targetYear,
                      targetLab
                  } = getLinkSummary(d);
                  const sourceIsActivated = activationCheck(absl.year, absl.currentLabHighlightList, sourceYear, sourceLab);
                  const targetIsActivated = activationCheck(absl.year, absl.currentLabHighlightList, targetYear, targetLab);
                  if (!((sourceIsActivated && targetIsActivated) || (!(sourceIsActivated || targetIsActivated)))) { // if only one is activated
    
                      if (sourceIsActivated) {
                          lg.setAttribute("x1", d.source.x);
                          lg.setAttribute("y1", d.source.y);
                          lg.setAttribute("x2", d.target.x);
                          lg.setAttribute("y2", d.target.y);
                      } else {
                          lg.setAttribute("x2", d.source.x);
                          lg.setAttribute("y2", d.source.y);
                          lg.setAttribute("x1", d.target.x);
                          lg.setAttribute("y1", d.target.y);
                      }
                  }
                  const path = d3.path();
                  path.moveTo(d.source.x, d.source.y);
                  path.lineTo(d.target.x, d.target.y);
                  return path.toString();
              });
          }
          linkTick();
          absl.simulation.on("tick", () => {
              linkTick();
              calcs.node
                  .attr("cx", d => d.x)
                  .attr("cy", d => d.y)
          });
      },
      (d, calcs, absl) => { // reduce opacity of unselected nodes
          calcs.node.attr("opacity", data => {
              const y = data.id.split(";")[1].split("/")[3];
              const lab = data.id.split(";")[1].split("/")[5];
              if ((y == absl.year || absl.year == "All") && absl.currentLabHighlightList.includes(lab)) {
                  return NODE_HIGHLIGHTED_OPACITY;
              } else {
                  return minOpacity;
              }
          });
      },
      (d, calcs, absl) => { // set opacity of edges where either both nodes are highlighted or not highlighted
          calcs.link.attr("opacity", data => {
              const {
                  source,
                  sourceYear,
                  sourceLab,
                  target,
                  targetYear,
                  targetLab
              } = getLinkSummary(data);
              let sourceIsOn = false;
              let targetIsOn = false;
    
              if (activationCheck(absl.year, absl.currentLabHighlightList, sourceYear, sourceLab)) {
                  sourceIsOn = true;
              }
              if (activationCheck(targetYear, targetLab)) {
                  targetIsOn = true;
              }
    
              if ((sourceIsOn || targetIsOn) && !(sourceIsOn && targetIsOn)) {
                  return null;
              }
              return 1;
          });
          calcs.link.attr("stroke", data => {
              const source = data.source.id;
              const sourceYear = source.split(";")[1].split("/")[3];
              const sourceLab = source.split(";")[1].split("/")[5];
              const target = data.target.id;
              const targetYear = target.split(";")[1].split("/")[3];
              const targetLab = target.split(";")[1].split("/")[5];
              let sourceIsOn = false;
              let targetIsOn = false;
    
              if (activationCheck(absl.year, absl.currentLabHighlightList, sourceYear, sourceLab)) {
                  sourceIsOn = true;
              }
              if (activationCheck(absl.year, absl.currentLabHighlightList, targetYear, targetLab)) {
                  targetIsOn = true;
              }
    
              if (sourceIsOn && targetIsOn) {
                  return "rgba(" + RGB_LINE_COLOR + ",1)";
              } else if (sourceIsOn || targetIsOn) {
                  return `url(#${getGradientID(data)})`;
              } else {
                  return "rgba(" + RGB_LINE_COLOR + ",0.05)";
              }
          });
      },
      (data, calcs, absl) => { // when a student's node is clicked, open their documentation website
    
          calcs.node.each(function(e, i) {
              const currentNode = d3.select(this);
              if (!currentNode.on("mouseover")) {
                  currentNode.on("mouseover", tooltipMouseover)
                      .on("mousemove", tooltipMousemove)
                      .on("mouseleave", tooltipMouseleave);
                  currentNode.on('click', (d, i) => {
                      window.open(i.id.split(";")[1], "_blank")
                  })
              }
          });
      },
      (data, calcs, absl) => absl.simulation.alpha(1).restart() // reheat simulation
    ];
  
  
  // filter nodes and edges based on `absolutes`
  const filterData = (funcs, absolutes) => {
      let d = {
          "nodes": nodes_not_filtered,
          "links": links_not_filtered
      };
      for (let f of funcs) {
          d = f(d, absolutes);
      }
      return d;
    };
    
    // run calculations for visualization
    const runCalculations = (funcs, data, absolutes) => {
      let calcs = {};
      for (let f of funcs) {
          calcs = {
              ...calcs,
              ...f(data, absolutes, calcs)
          };
      }
      return calcs;
    }
    
    // update the visualization
    const setDataAttributes = (funcs, data, calcs, absolutes) => {
      for (let f of funcs) {
          f(data, calcs, absolutes);
      }
    }
  
  const updateData = absolutes => {
    absolutes = {
        ...absolutes,
        "topic": ("topic" in absolutes ? absolutes.topic : currentTopic),
        "year": currentYear,
        currentLabHighlightList
    };
    const data = filterData(updateCallbacks, absolutes);
    const calculationDict = runCalculations(calculationCallbacks, data, absolutes);
    setDataAttributes(attributeCallbacks, data, calculationDict, absolutes);
  }