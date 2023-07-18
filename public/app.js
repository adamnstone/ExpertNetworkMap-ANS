window.onload = () => {
  Tooltip = d3.select("#tooltip");
  body = document.getElementsByTagName('body')[0];

  create_not_filteredFromJSON().then(() => {
      calculateMinMaxMapFromFiltered();
      createReferenceCache();

      createNumLinksDictFrom_not_filtered(nodes_not_filtered, links_not_filtered);
      setLabs(nodes_not_filtered.map(n => n.id));

      transferNot_filteredToArrays();

      calculateMaxStrength();

      setCurrentLabHighlightList();
      createSimulation();
      createAndFormatSVG();
      initializeDefs();
      gl_ = svg.append("g").attr("transform", "translate(150, -10)");

      registerLinearGradients(links_not_filtered); // so that when they are needed all of the gradients are available; 
      // this could only use links that ever would need to have a linear gradient to improve performance

      nodesToNodeAndFormat();
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
          currentTopic = d;
          if (currentTopic != "All") {
              mapMin = minMaxMap[currentTopic].min;
              mapMax = minMaxMap[currentTopic].max;
          } else {
              [mapMin, mapMax] = [1, 60];
          }
          updateDialText(currentDialDeg, dialCallback); // calls updateData
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
      };

      const dialCallback = (roundedVal, first = false) => {
          minNumConnections = roundedVal;
          updateData({
              "minNumConnections": roundedVal,
              simulation,
              svg,
              g,
              "gl": gl_,
              "isFirst": first
          });
      };

      initializeDial(svg, dialCallback);

      initializeLabMultiselect(labs, labCallback);

  });
};