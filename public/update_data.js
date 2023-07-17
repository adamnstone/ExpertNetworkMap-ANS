const updateCallbacks = [
    (data, absl) => {
        const f = (nodes_not_filtered, links_not_filtered, filterFunc) => { // from filterStudents       
            let nodes = nodes_not_filtered.filter(n => filterFunc(n));

            let node_ids = nodes.map(n => n.id);
            let links = JSON.parse(JSON.stringify(links_not_filtered)).filter(l => { // DEEPCOPY SOLVES HEISENBUG!
              return (l.topic == absl.topic || absl.topic == "All") && (node_ids.includes(l.target)) && (node_ids.includes(l.source));
            });
            
            return [nodes, links];
        };
        const [nodes, links] = f(data.nodes, data.links, n => {
            if (absl.topic == "All") {
                return sumObj(numLinksDict[n.id].target) >= absl.minNumConnections;
            }
            else {
                return numLinksDict[n.id].target[absl.topic] >= absl.minNumConnections;
            }
        });
        return {nodes, links};
    } // code from transfernot_filtered...
];

const calculationCallbacks = [
    (data, absl) => {
        let maxStrength = 0;
        data.links.forEach(l => {
            if (l.value > maxStrength) {
            maxStrength = l.value;
            }
        });
        return {maxStrength};
    }, // code from calculateMaxStrength
    (data, absl) => {
      return {"condensedLinks": condenseLinksforSimulation(data.links)}
    },
    (data, absl, calcs) => {

        //gl.selectAll("path").remove(); // exit() isn't working and wouldn't unless I saved sel across calls, and that caused the not deleting circles error again
        //console.log(calcs.condensedLinks);
        const sel = absl.gl.selectAll("path").data(calcs.condensedLinks, l=>uniqueId(l));
    
        sel.exit()
            .remove();

        const ent = sel.enter().append("path").merge(sel);

        return {"link": ent};
    }, // code from linksToLink
    (data, absl) => {//from configureNode
        
        /*const toRemove = absl.g.selectAll("circle");
        console.log(toRemove);
        toRemove.remove();
        console.log(data.nodes);*/
        const sel = absl.g.selectAll("circle").data(data.nodes, n=>n.id);
        //if (data.nodes.length != 0 && data.nodes.length != 84) throw("error");
        sel.exit()
            .remove();
    
        const ent = sel.enter().append("circle").merge(sel);

        //absl.g.selectAll("circle").data(data.nodes, n=>n.id).enter().append("circle");

        return {"node": /*absl.g.selectAll("circle")*/ent};
    }
];

const attributeCallbacks = [
    (data, calcs, absl) => { // from selectByTopic
        calcs.node.attr("r", d => 
        {
          //console.log(d, referenceCache[d.id]);
          return referenceCache[d.id][absl.topic];
        });
        absl.simulation.nodes(data.nodes);
        forceCollide.initialize(data.nodes);
    },
    (data, calcs, absl) => {
        absl.simulation.force("link", d3.forceLink(calcs.condensedLinks).id(d => d.id).distance(d => getSimulationForceLinkDistance(d)));
        absl.simulation.force("collision", forceCollide.radius(d => d.r));
    },
    (data, calcs, absl) => {//also from configureNode
        //calcs.node.attr("r", d => referenceCache[d.id]["All"]);
        
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
    (data, calcs, absl) => {//also from linksToLink
        calcs.link.attr("fill", "none") //ADDED
            .attr("stroke-width", LINE_WIDTH)
            .style("stroke-linecap", "round");
    },
    (data, calcs, absl) => {
        const linkTick = () => {
            calcs.link.attr("d", d => {
                const gradientID = getGradientID(d);
                const lg = document.getElementById(gradientID);
                const {source,
                  sourceYear,
                  sourceLab,
                  target,
                  targetYear,
                  targetLab} = getLinkSummary(d);
                const sourceIsActivated = activationCheck(absl.year, absl.currentLabHighlightList, sourceYear, sourceLab);
                const targetIsActivated = activationCheck(absl.year, absl.currentLabHighlightList, targetYear, targetLab);
                if (!((sourceIsActivated && targetIsActivated) || (!(sourceIsActivated || targetIsActivated)))) { // if only one is activated
                    
                    if (sourceIsActivated) {
                        //console.log(gradientID);
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
    (d, calcs, absl) => { // code from setYear
        calcs.node.attr("opacity", data => {
            const y = data.id.split(";")[1].split("/")[3];
            const lab = data.id.split(";")[1].split("/")[5];
            if ((y == absl.year || absl.year == "All") && absl.currentLabHighlightList.includes(lab)) {
              return NODE_HIGHLIGHTED_OPACITY;
            }
            else {
              return minOpacity;
            }
          });
    },
    (d, calcs, absl) => {// code from setLinkOpacity
        calcs.link.attr("opacity", data => {
            const {source,
              sourceYear,
              sourceLab,
              target,
              targetYear,
              targetLab} = getLinkSummary(data);
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
              /*if (sourceIsOn) {
                return "url(#LineFadeForward)";
              }
              return "url(#LineFadeBackward)";*/
            }
            return 1;
          });
          calcs.link.attr("stroke", data => { // SHOULD USE LINKS FROM SIMULATION BC OF CONDENSING?
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
              return "rgba(" + RGB_LINE_COLOR + ",1)"; // this used to have opacity being set !!
            }
            else if (sourceIsOn || targetIsOn) {
              return `url(#${getGradientID(data)})`;
            }
            else {
              return "rgba(" + RGB_LINE_COLOR + ",0.05)";
            }
          });
    },
    (data, calcs, absl) => { // from setNodeTooltips
        
        calcs.node.each(function(e,i) {
            /*if (d3.select(this).selectAll("title").size() == 0) {d3.select(this).append("title").text(d => {
                return d.id.split(";")[0];
                });
            }
            //console.log(e,i);
            r = calcs.node.on('click', (d, i) => { window.open(i.id.split(";")[1], "_blank") });*/
            const currentNode = d3.select(this);
            if (!currentNode.on("mouseover")) {
              currentNode.on("mouseover", tooltipMouseover)
                .on("mousemove", tooltipMousemove)
                .on("mouseleave", tooltipMouseleave);
              currentNode.on('click', (d, i) => { window.open(i.id.split(";")[1], "_blank") })
            }
        });
    
        /*let r = calcs.node.append("title")
            .text(d => {
            return d.id.split(";")[0];
            });*/
            
        
    },
    (data, calcs, absl) => absl.simulation.alpha(1).restart()
];


const filterData = (funcs, absolutes) => {
    let d = {"nodes": nodes_not_filtered,
                "links": links_not_filtered};
    for (let f of funcs) {
        d = f(d, absolutes);
    }
    return d;
};

const runCalculations = (funcs, data, absolutes) => {
    let calcs = {};
    for (let f of funcs) {
        calcs = {...calcs, ...f(data, absolutes, calcs)};
    }
    return calcs;
}

const setDataAttributes = (funcs, data, calcs, absolutes) => {
    for (let f of funcs) {
        f(data, calcs, absolutes);
    }
}

const updateData = absolutes => {
    absolutes = {...absolutes, "topic": ("topic" in absolutes ? absolutes.topic : currentTopic), "year": currentYear, currentLabHighlightList};
    //console.log(JSON.stringify(absolutes));
    //console.log("updateData called with parameters: ", absolutes);
    const data = filterData(updateCallbacks, absolutes);
    //console.log(data);
    const calculationDict = runCalculations(calculationCallbacks, data, absolutes);
    setDataAttributes(attributeCallbacks, data, calculationDict, absolutes);
}