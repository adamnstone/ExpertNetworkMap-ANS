(async function(){


  await create_not_filteredFromJSON();
  calculateMinMaxMapFromFiltered();
  createReferenceCache();
  createNumLinksDictFrom_not_filtered(nodes_not_filtered, links_not_filtered);
  setLabs(nodes_not_filtered.map(n=>n.id));
  transferNot_filteredToArrays();
  calculateMaxStrength();
  setCurrentLabHighlightList();
  createSimulation();
  createAndFormatSVG();
  link = linksToLink(true);
  nodesToNodeAndFormat();
  node = configureNode(node, nodes);
  calibrateSimulation();
  node = setNodeTooltips(node);    
  setSimulationTick(node,link);    
  configureGlowDefinitions();
  createPie();

  createOverlayText();

  

  initializeCarousel(d => {
    selectByTopic(d);
    if (currentTopic != "All") {
      mapMin = minMaxMap[currentTopic].min;
      mapMax = minMaxMap[currentTopic].max + 1;
    }
    else {
      [mapMin, mapMax] = [1, 60];
    }
    updateDialText(currentDialDeg, dialCallback);
    dialCallback(minNumConnections);//dialCallback(minNumConnections);
  }, topicCarouselList, 350, 600, 30, 10, svg, FAB_PALETTE);

  const labCallback = lab_list => {
    currentLabHighlightList = lab_list;
    node.attr("opacity", data => {
      const lab = data.id.split(";")[1].split("/")[5];
      const y = data.id.split(";")[1].split("/")[3];
      if (lab_list.includes(lab) && (y == currentYear || currentYear == "All")) {
        return 0.5;
      }
      else {
        return minOpacity;
      }
    });
    setLinkOpacity();
  };

  const dialCallback = roundedVal => {
    minNumConnections = roundedVal;
    transferNot_filteredToArrays();
    
    calculateMaxStrength();

    link = linksToLink(false);

    let nodeNewData = configureNode(node, nodes);
    
    node = nodeNewData;
    
    simulation.nodes(nodes);
    forceCollide.initialize(nodes);
    simulation.force("link").links(links);
    calibrateSimulation();
    setSimulationTick(node, link);

    setNodeTooltips(node);
    
    simulation.alpha(1).restart();    
    
    selectByTopic(currentTopic);
    setYear(currentYear);
    labCallback(currentLabHighlightList);
  };

  dialCallback(20);

  initializeDial(svg, dialCallback);

    initializeLabMultiselect(labs, labCallback);
})();