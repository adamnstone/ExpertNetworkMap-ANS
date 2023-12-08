// run when page loads
window.onload = () => {
    Tooltip = d3.select("#tooltip");
    body = document.getElementsByTagName('body')[0];

    window.addEventListener('pointermove', (event) => {
        mousePos = {
            x: event.clientX,
            y: event.clientY
        };

        let tooltipWidth = Tooltip.node().offsetWidth; // Width of the tooltip
        let tooltipHeight = Tooltip.node().offsetHeight; // Height of the tooltip
        let windowWidth = document.documentElement.clientWidth; // Width of the window
        let windowHeight = document.documentElement.clientHeight; // Height of the window

        let x = event.clientX + body.scrollLeft + 50;
        let y = event.clientY + body.scrollTop - 10;

        // Consider a buffer to ensure that 
        // the tooltip doesn't touch the edge of the viewport.
        let buffer = {
            "x": 50,
            "y": 10
        };

        // If the tooltip would go off the right side of the screen
        if (x + tooltipWidth + buffer.x - body.scrollLeft > windowWidth) {
            x = x - tooltipWidth - (50 * 2);
        }

        // If the tooltip would go off the bottom of the screen
        if (y + tooltipHeight + buffer.y - body.scrollTop > windowHeight) {
            y = y - tooltipHeight + (10 * 2);
        }

        Tooltip.style("left", x + "px");
        Tooltip.style("top", y + "px");
    });

    // load the json data and filter out all references by students to themselves
    create_not_filteredFromJSON().then(() => {

        // store the most and least amount of references for a student in each subject area
        calculateMinMaxMapFromFiltered();

        // go through all of the data and create an dictionary where you can look up a student and their subject area and recieve the number of times they were referenced in that subject area
        createReferenceCache();

        // create a dictionary of each time a student referenced another student for a certain topic
        createNumLinksDictFrom_not_filtered(nodes_not_filtered, links_not_filtered);

        // stores each student's lab (using their website URL) and removes all repeats
        setLabs(nodes_not_filtered.map(n => n.id));

        // stores all of the nodes and edges who meet the default filter criteria into the main `nodes`, `node_ids`, and `links` arrays
        transferNot_filteredToArrays();

        // stores the strongest edge between nodes
        calculateMaxStrength();

        // make the lab filter display the default option
        setCurrentLabHighlightList();

        // initialize the force graph simulation
        createSimulation();

        // initialize the HTML elements that the SVGs of the visualization
        createAndFormatSVG();

        // initialize linear gradients
        initializeDefs();

        // create the container SVG element for the graph
        gl_ = svg.append("g").attr("transform", "translate(150, -10)");

        // pair the linear gradient SVGs to all of the references, not only the selected ones, so that elements aren't created in real-time as filters are changed. (Doesn't take into account that some edges will never have a linear gradient)
        registerLinearGradients(links_not_filtered);

        // create SVG container for all of the nodes
        nodesToNodeAndFormat();

        // initialize year-select pie
        createPie();

        // create overlay text and links, such as link to documentation, mattermost channel, etc
        createOverlayText();

        // update the graph to display network on the SVG
        updateData({
            minNumConnections: 20,
            simulation,
            svg,
            g,
            "gl": gl_
        })

        // initialize subject-area-selection carousel
        initializeCarousel(d => { // anonymous function defines behavior on carousel update
            currentTopic = d;
            if (currentTopic != "All") {
                mapMin = minMaxMap[currentTopic].min;
                mapMax = minMaxMap[currentTopic].max;
            } else {
                [mapMin, mapMax] = [1, 60];
            }
            updateDialText(currentDialDeg, dialCallback);
        }, topicCarouselList, 350, 600, 30, 10, svg, FAB_PALETTE);

        // defines callback function for lab filter being altered 
        const labCallback = lab_list => {
            currentLabHighlightList = lab_list;
            updateData({ // updates visualization with new filters
                minNumConnections,
                simulation,
                svg,
                g,
                "gl": gl_
            });
        };

        // defines callback function for minimum number of times referenced filter being altered
        const dialCallback = (roundedVal, first = false) => {
            minNumConnections = roundedVal;
            updateData({ // updates visualization wth new filters
                "minNumConnections": roundedVal,
                simulation,
                svg,
                g,
                "gl": gl_,
                "isFirst": first
            });
        };

        // initializes minimum number of times referenced dial
        initializeDial(svg, dialCallback);

        // initialize lab multiselect dropdown functionalityW
        initializeLabMultiselect(labs, labCallback);

    });
};