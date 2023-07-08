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
    
    callback(rounded);//return rounded;
};

function convertSVGtoScreenCoordinates(svgElement, dialX, dialY) {
    var pt = svgElement.createSVGPoint();
    pt.x = dialX;
    pt.y = dialY;
    
    // getScreenCTM returns the matrix that transforms current user units to screen coordinates.
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
        radius = pieRadius - (strokeWidth/2); // to be same as the year-select pie

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
    centerText(textElem, dialX);

    numText = svg.append("text");
    numText
        .attr("x", dialX)
        .attr("y", dialY + ((radius/2) + strokeWidth))
        .text("20")
        .attr("font-family", "sans-serif")
        .attr("font-size", "40px")
        .attr("fill", "white");
    let numTextWidth = numText.node().getBBox().width;
    numText.attr("x", (dialX - (numTextWidth / 2)));

    window.addEventListener('mousemove', (event) => {
        mousePos = { x: event.clientX, y: event.clientY };
      });

    var drag = d3.drag()
        .on("start", (event, d) => {
            //d.x = event.x;
            d.x = event.sourceEvent.clientX;// mousePos.x;
            d.y = event.sourceEvent.clientY;//mousePos.y;            
            if (!d.currentDeg) d.currentDeg = startPos;
        })
        .on("drag", (event, d) => {
           /* var delta = event.x - d.x,
                degDelta = delta * sensitivity;

            // Constrain the rotation within the start and end degree
            d.degNew = clamp(degDelta + d.currentDeg, startDegree, endDegree);
            currentDialDeg = d.degNew;

            updateDialText(currentDialDeg, callback);*/

            let vals = convertSVGtoScreenCoordinates(document.getElementsByTagName('svg')[0], dialX, dialY);

            /*let h = vals.x,
                k = vals.y,
                x1 = d.x,
                y1 = d.y,
                x2 = event.sourceEvent.clientX,//mousePos.x,//event.x,
                y2 = event.sourceEvent.clientY;//mousePos.y;//event.y;

            console.log(h,k,x1,y1,x2,y2);
            
            let m = Math.sqrt(Math.pow(x2-h,2)+Math.pow(y2-k,2));
            let e = Math.sqrt(Math.pow(x1-h,2)+Math.pow(y1-k,2));
            let g = y1 - k;
            let j = Math.sqrt(Math.abs(Math.pow(e,2) - Math.pow(g,2)));
            let n0 = Math.atan(g/j);
            let p = Math.cos(n0) * m;            
            let h2 = Math.sqrt(Math.abs(Math.pow(m, 2) - Math.pow(Math.cos(n0)*m, 2)));
            let q = h2/(Math.tan(90 - (n0/2)));
            let zDeg = Math.acos((x2-h)/(y2-k));
            let mDeg = zDeg - n0;
            let r = (p+q)/(Math.cos(mDeg));
            let s = Math.sqrt(Math.abs(Math.pow(p+q, 2) - Math.pow(r, 2)));

            let x1t = x1 + (e - Math.sqrt(Math.pow(e,2)-Math.pow(g,2)));
            let y1t = k;
            let x2t = h+r;
            let y2t = k+s;

            let theta = Math.atan((y2t-y1t)/(x2t-h)) * (180/Math.PI);
            console.log("NUMS", h,k,x1,y1,x2,y2,m,e,g,h,n0,p,h2,q,"Z",zDeg,mDeg,r,s,x1t,y1t,x2t,y2t,theta);*/
            let newXY = {"x": event.sourceEvent.clientX, "y": event.sourceEvent.clientY};
            let theta = calculateAngle(vals, /*mousePos*/newXY);
            let thetaDegrees = theta * (180/Math.PI);
            let oldXY = {"x": d.x, "y": d.y};
            let oldAngle = calculateAngle(vals, oldXY);
            let oldAngleDegrees = oldAngle * (180/Math.PI)
            let angleDelta = ((thetaDegrees - oldAngleDegrees + 180 + 360) % 360) - 180;
//let angleDelta = thetaDegrees - oldAngleDegrees;
            d.x = newXY.x;
            d.y = newXY.y;

            d.degNew = angleDelta + d.currentDeg;
            d.currentDeg = d.degNew;
            console.log("degnew, currentdeg, CDD, angledelta", d.degNew, d.currentDeg, currentDialDeg, angleDelta);
            currentDialDeg = clamp(angleDelta + currentDialDeg, startDegree, endDegree);
            console.log(currentDialDeg);

            updateDialText(currentDialDeg, callback);
        })
        .on("end", (event, d) => {
            d.currentDeg = d.degNew;
        });


    dialGroup = svg.append("g")
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