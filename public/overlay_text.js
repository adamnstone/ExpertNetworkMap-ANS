const createOverlayText = () => {
    createdBy();
};

const createdBy = () => {
    const xPos = 10; // 10px from the left edge
    const yPos = height - 10; // 10px from the bottom edge
    svg.append("text")
        .attr("font-size", "14px")
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("class", "overlay-text")
        .text("Created by ")
        .append("a")
        .attr("xlink:href", "https://fabacademy.org/2023/labs/charlotte/students/adam-stone/")
        .attr("target", "_blank") 
        .style("fill", "#aaaaff")
        .attr("font-size", "14px")
        .text("Adam Stone");
};