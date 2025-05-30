const initializeCarousel = (callback, carousel_data, width, height, x, y, svg, colorPalette) => {
    // create SVG group (<g>) HTML element
    const g = svg.append("g"); 

    // create D3JS scale band for the y-axis of the filter
    const yScale = d3.scaleBand()
        .range([ 0, height ])
        .domain(carousel_data)
        .padding(0.2);

    // create D3JS color scale
    const color = d3.scaleOrdinal().range(colorPalette);

    // make D3JS selection for option rectangles and set aesthetic attributes based on constants
    const rect = g.selectAll("rect")
        .data(carousel_data)
        .enter()
        .append("rect")
        .attr('x', 10 + x)
        .attr('y', d => yScale(d) + y)
        .attr('width', width)
        .attr('height', yScale.bandwidth())
        .attr('stroke', CAROUSEL_RECT_STROKE_COLOR)
        .attr('stroke-width', CAROUSEL_RECT_STROKE_WIDTH)
        .attr('fill', CAROUSEL_OPTION_COLOR/*d => color(d)*/)
        .on('click', (event, d) => {
            movePointerTo(d);
        });

    // calculat width of outline selection rectangle
    var outerWidth = ((height / carousel_data.length) - yScale.bandwidth()) + width, outerHeight = height / carousel_data.length;
    var innerWidth = width, innerHeight = yScale.bandwidth();
    
    var outerRectangle = { top: yScale(carousel_data[0]) + ((yScale.bandwidth() - (height / carousel_data.length)))/2, left: 10 - ((height / carousel_data.length) - yScale.bandwidth())/2, width: outerWidth, height: outerHeight };
    var innerRectangle = { 
        top: outerRectangle.top + (outerHeight - innerHeight) / 2, 
        left: outerRectangle.left + (outerWidth - innerWidth) / 2,
        width: innerWidth,
        height: innerHeight
    };
    
    // SVG path for outer selection rectangle
    var pathData = [
        "M", outerRectangle.left, outerRectangle.top, // Move to the top-left corner of the outer rectangle
        "h", outerWidth, // Draw the top side
        "v", outerHeight, // Draw the right side
        "h", -outerWidth, // Draw the bottom side
        "v", -outerHeight, // Draw the left side
        "M", innerRectangle.left, innerRectangle.top, // Move to the top-left corner of the inner rectangle
        "h", innerWidth, // Draw the top side
        "v", innerHeight, // Draw the right side
        "h", -innerWidth, // Draw the bottom side
        "v", -innerHeight, // Draw the left side
        "Z" // Close the path
    ].join(" ");

    // create definitions section of <g>
    var defs = g.append("defs");

    // create mask (for selection rectangle outline)
    var mask = defs.append("mask")
        .attr("id", "myMask");
    
    // Add a white rectangle to the mask
    mask.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");
    
    // Add a smaller black rectangle to the mask to cut out
    mask.append("rect")
        .attr("x", innerRectangle.left + x)
        .attr("y", innerRectangle.top + y)
        .attr("width", innerRectangle.width)
        .attr("height", innerRectangle.height)
        .attr("fill", "black");
    
    // Draw a rectangle with the mask
    const selectionRect = g.append("rect")
        .attr("x", outerRectangle.left + x)
        .attr("y", outerRectangle.top + y)
        .attr("width", outerRectangle.width)
        .attr("height", outerRectangle.height)
        .attr("fill", CAROUSEL_SELECTOR_COLOR)
        .attr("mask", "url(#myMask)");

    // when an option is clicked, move the selection rectangle to that option
    const movePointerTo = d => {
        selectionRect.transition()
            .duration(1000)
            .attr('transform', "translate(0, " + (yScale(d) - yScale(carousel_data[0])) + ")");
            callback(d);
    };

    // set text attributes and click callback for option rectangles
    const text = g.selectAll("text")
        .data(carousel_data)
        .enter()
        .append("text")
        .attr('x', 10 + width/2 + x)
        .attr('y', d => yScale(d) + yScale.bandwidth()/2 + y)
        .attr('dy', '0.3em')
        .text(d => d)
        .on('click', (event, d) => {
            movePointerTo(d);
        });

    // set text style attributes
    text
        .style('text-anchor', 'middle')
        .style('fill', CAROUSEL_TEXT_COLOR)
        .attr("font-weight", 700)
        .attr("font-family", "Saira")
        .attr("font-size", 13)
};