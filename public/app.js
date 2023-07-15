//(async function(){
  /*await */create_not_filteredFromJSON().then(()=>{
  
  createReferenceCache();
  calculateMinMaxMapFromFiltered();
  createNumLinksDictFrom_not_filtered(nodes_not_filtered, links_not_filtered);
  setLabs(nodes_not_filtered.map(n=>n.id));
  
  transferNot_filteredToArrays();
  
  calculateMaxStrength();
  
  setCurrentLabHighlightList();
  createSimulation();
  createAndFormatSVG();
  initializeDefs();
  gl_ = svg.append("g").attr("transform", "translate(150, -10)");
  //link = linksToLink(true);
  
  registerLinearGradients(links_not_filtered); // so that when they are needed all of the gradients are available; this could only use links that ever would need to have a linear gradient to improve performance
  nodesToNodeAndFormat();
  /*node = configureNode(node, nodes);
  calibrateSimulation();
  node = setNodeTooltips(node);    
  setSimulationTick(node,link);    
  configureGlowDefinitions();*/
  createPie();

  createOverlayText();

  

  updateData({
    minNumConnections: 20,
      simulation,
      svg,
      g,
      "gl": gl_
  })

  initializeCarousel(d => {
    //selectByTopic(d);
    
    currentTopic = d;
    if (currentTopic != "All") {
      mapMin = minMaxMap[currentTopic].min;
      mapMax = minMaxMap[currentTopic].max + 1;
      console.log("minmax", mapMin, mapMax);
    }
    else {
      [mapMin, mapMax] = [1, 60];
    }
    /*updateData({
      minNumConnections,
      simulation,
      svg,
      g,
      "isFirst": false
    });*/
    
    updateDialText(currentDialDeg, dialCallback); // calls updateData
    //dialCallback(minNumConnections);//dialCallback(minNumConnections);
  }, topicCarouselList, 350, 600, 30, 10, svg, FAB_PALETTE);

  const labCallback = lab_list => {
    currentLabHighlightList = lab_list;
    updateData({
      minNumConnections,
      simulation,
      svg,
      g,
      "gl": gl_
    });
    /*currentLabHighlightList = lab_list;
    node.attr("opacity", data => {
      const lab = data.id.split(";")[1].split("/")[5];
      const y = data.id.split(";")[1].split("/")[3];
      if (lab_list.includes(lab) && (y == currentYear || currentYear == "All")) {
        return NODE_HIGHLIGHTED_OPACITY;
      }
      else {
        return minOpacity;
      }
    });
    setLinkOpacity();*/
  };

  const dialCallback = (roundedVal, first=false) => {
    //if (minNumConnections == roundedVal && !first) return; // CAUSES ISSUES WEHN CALLED FROM OTHER PLACES
    minNumConnections = roundedVal;
    updateData({
      "minNumConnections": roundedVal,
      simulation,
      svg,
      g,
      "gl": gl_,
      "isFirst": first
    });
    /*transferNot_filteredToArrays();
    
    calculateMaxStrength();

    link = linksToLink(false);

    let nodeNewData = configureNode(node, nodes);
    
    node = nodeNewData;
    
    //simulation.nodes(nodes);
    //forceCollide.initialize(nodes);
    //simulation.force("link").links(links);
    //calibrateSimulation();
    //setSimulationTick(node, link);

    setNodeTooltips(node);
    
    //simulation.alpha(1).restart();    
    
    selectByTopic(currentTopic);
    setYear(currentYear);
    labCallback(currentLabHighlightList);*/
  };

  //dialCallback(20, first=true);

  initializeDial(svg, dialCallback);

  initializeLabMultiselect(labs, labCallback);

});
//})();