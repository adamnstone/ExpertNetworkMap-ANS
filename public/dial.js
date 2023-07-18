let prevSentToCallback;
const strokeWidth = 12;
const dialY = pieY;
const dialX = width - pieX;

const generateDialMapScale = () => {
    return d3.scaleLinear().domain([startDegree, endDegree]).range([clamp(mapMin, 1, Infinity), mapMax])
};

const updateDialText = (currentDialDeg, callback) => {
    if (!dialGroup) return;
    dialGroup.attr("transform", `translate(${dialX}, ${dialY}) rotate(${currentDialDeg})`);

    var mapScale = generateDialMapScale();
    var mappedValue = mapScale(currentDialDeg);

    const rounded = Math.round(mappedValue);

    numText
        .text(rounded);
    numTextWidth = numText.node().getBBox().width;
    numText.attr("x", (dialX - (numTextWidth / 2)));

    callback(rounded);
};

function convertSVGtoScreenCoordinates(svgElement, dialX, dialY) {
    var pt = svgElement.createSVGPoint();
    pt.x = dialX;
    pt.y = dialY;

    // getScreenCTM returns the matrix that transforms current user units to screen coordinates
    var svgP = pt.matrixTransform(svgElement.getScreenCTM());

    return {
        x: svgP.x,
        y: svgP.y
    };
}

function calculateAngle(center, point) {
    let dy = point.y - center.y;
    let dx = point.x - center.x;
    let theta = Math.atan2(dy, dx);
    return theta;
}

const initializeDial = (svg, callback) => {
    var width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = pieRadius - (strokeWidth / 2); // to be same as the year-select pie

    // Get the input element for displaying the mapped value
    var inputElement = document.getElementById("value-input");

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const sensitivity = 1;

    const textElem = svg.append("text");
    textElem
        .attr("x", dialX)
        .attr("y", dialY + (radius + (strokeWidth * 2)))
        .text("Minimum Times Referenced")
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .attr("fill", DIAL_TEXT_COLOR);
    centerText(textElem, dialX);

    numText = svg.append("text");
    numText
        .attr("x", dialX)
        .attr("y", dialY + ((radius / 2) + strokeWidth))
        .text("20")
        .attr("font-family", "sans-serif")
        .attr("font-size", "40px")
        .attr("fill", DIAL_TEXT_COLOR);
    let numTextWidth = numText.node().getBBox().width;
    numText.attr("x", (dialX - (numTextWidth / 2)));

    window.addEventListener('mousemove', (event) => {
        mousePos = {
            x: event.clientX,
            y: event.clientY
        };
    });

    var drag = d3.drag()
        .on("start", (event, d) => {
            d.x = event.sourceEvent.clientX;
            d.y = event.sourceEvent.clientY;
            if (!d.currentDeg) d.currentDeg = startPos;
        })
        .on("drag", (event, d) => {
            let vals = convertSVGtoScreenCoordinates(document.getElementsByTagName('svg')[0], dialX, dialY);
            let newXY = {
                "x": event.sourceEvent.clientX,
                "y": event.sourceEvent.clientY
            };
            let theta = calculateAngle(vals, /*mousePos*/ newXY);
            let thetaDegrees = theta * (180 / Math.PI);
            let oldXY = {
                "x": d.x,
                "y": d.y
            };
            let oldAngle = calculateAngle(vals, oldXY);
            let oldAngleDegrees = oldAngle * (180 / Math.PI)
            let angleDelta = ((thetaDegrees - oldAngleDegrees + 180 + 360) % 360) - 180;
            d.x = newXY.x;
            d.y = newXY.y;

            d.degNew = angleDelta + d.currentDeg;
            d.currentDeg = d.degNew;
            currentDialDeg = clamp(angleDelta + currentDialDeg, startDegree, endDegree);

            updateDialText(currentDialDeg, callback);
        })
        .on("end", (event, d) => {
            d.currentDeg = d.degNew;
        });


    dialGroup = svg.append("g")
        .data([{
            x: 0,
            scale: d3.scaleLinear().domain([0, width]).range([startDegree, endDegree])
        }]) // initial data for dialGroup
        .attr("transform", `translate(${dialX}, ${dialY}) rotate(${startPos})`)
        .call(drag);

    // Add a transparent circle for better dragging
    dialGroup.append("circle")
        .attr("r", radius)
        .style("fill", "transparent");

    dialGroup.append("circle")
        .attr("r", radius)
        .style("fill", "none")
        .style("stroke", DIAL_OUTLINE_COLOR)
        .style("stroke-width", `${strokeWidth}px`);

    dialGroup.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -(radius - strokeWidth))
        .style("stroke", DIAL_STICK_COLOR)
        .style("stroke-width", `${strokeWidth}px`)
        .style("stroke-linecap", "round");

    // Display the initial mapped value
    var initialScale = d3.scaleLinear().domain([startDegree, endDegree]).range([mapMin, mapMax]);
    var initialMappedValue = initialScale(startPos);
}