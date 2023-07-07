let prevSentToCallback;
const strokeWidth = 12;
const dialY = pieY;
const dialX = width - pieX;
const initializeDial = (svg, callback) => {
    var width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = pieRadius - (strokeWidth/2); // to be same as the year-select pie

    var startDegree = -135;   // Start of the dial in degrees
    var endDegree = 135;   // End of the dial in degrees
    var startPos = -44; // Starting position of the dial in degrees

    var mapMin = 0;   // Start of the output range
    var mapMax = 60;  // End of the output range

    // Get the input element for displaying the mapped value
    var inputElement = document.getElementById("value-input");

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const sensitivity = 1;

    const textElem = svg.append("text");
    textElem
        .attr("x", dialX)
        .attr("y", dialY + (radius + (strokeWidth*2)))
        .text("Minimum Times Referenced")
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .attr("fill", "white");
    let textWidth = textElem.node().getBBox().width;
    textElem.attr("x", (dialX - (textWidth / 2)));

    const numText = svg.append("text");
    numText
        .attr("x", dialX)
        .attr("y", dialY + ((radius/2) + strokeWidth))
        .text("20")
        .attr("font-family", "sans-serif")
        .attr("font-size", "40px")
        .attr("fill", "white");
    let numTextWidth = numText.node().getBBox().width;
    numText.attr("x", (dialX - (numTextWidth / 2)));

    var drag = d3.drag()
        .on("start", (event, d) => {
            d.x = event.x;
            if (!d.currentDeg) d.currentDeg = startPos;
        })
        .on("drag", (event, d) => {
            var delta = event.x - d.x,
                degDelta = delta * sensitivity;

            // Constrain the rotation within the start and end degree
            d.degNew = clamp(degDelta + d.currentDeg, startDegree, endDegree);
            
            dialGroup.attr("transform", `translate(${dialX}, ${dialY}) rotate(${d.degNew})`);
            
            var mapScale = d3.scaleLinear().domain([startDegree, endDegree]).range([mapMin, mapMax]);
            var mappedValue = mapScale(d.degNew);
    
            const rounded = Math.round(mappedValue);

            numText
                .text(rounded);
            numTextWidth = numText.node().getBBox().width;
            numText.attr("x", (dialX - (numTextWidth / 2)));

            callback(rounded);
        })
        .on("end", (event, d) => {
            d.currentDeg = d.degNew;
        });


    var dialGroup = svg.append("g")
        .data([{x: 0, scale: d3.scaleLinear().domain([0, width]).range([startDegree, endDegree])}]) // initial data for dialGroup
        .attr("transform", `translate(${dialX}, ${dialY}) rotate(${startPos})`)
        .call(drag);

    // Add a transparent circle for better dragging
    dialGroup.append("circle")
        .attr("r", radius)
        .style("fill", "transparent");

    dialGroup.append("circle")
        .attr("r", radius)
        .style("fill", "none")
        .style("stroke", FAB_PALETTE[0])
        .style("stroke-width", `${strokeWidth}px`);

    dialGroup.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -(radius - strokeWidth))
        .style("stroke", FAB_PALETTE[6])
        .style("stroke-width", `${strokeWidth}px`)
        .style("stroke-linecap", "round");

    // Display the initial mapped value
    var initialScale = d3.scaleLinear().domain([startDegree, endDegree]).range([mapMin, mapMax]);
    var initialMappedValue = initialScale(startPos);
}