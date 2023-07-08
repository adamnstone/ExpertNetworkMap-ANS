const createOverlayText = () => {
    const xPos = 10; // 10px from the left edge
    const yPos = height - 10; // 10px from the bottom edge
    svg.append("text")
    .attr("x", xPos)
    .attr("y", yPos)
    .attr("class", "bottom-left")
    .text("Created by ")
    .append("a")
    .attr("xlink:href", "https://fabacademy.org/2023/labs/charlotte/students/adam-stone/")
    .attr("target", "_blank") 
    .style("fill", "#aaaaff")
    .text("Adam Stone");
};