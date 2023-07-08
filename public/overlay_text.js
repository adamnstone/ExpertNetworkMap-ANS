const createOverlayText = () => {
    createdBy();
};

const createdBy = () => {
    const xPos = 10; // 10px from the left edge
    
    const createTxt = (ySub, txt, lnk_txt, lnk) => {
        const yPos = height - ySub; // 10px from the bottom edge
        svg.append("text")
            .attr("font-size", "14px")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("class", "overlay-text")
            .text(txt + " ")
            .append("a")
            .attr("xlink:href", lnk)
            .attr("target", "_blank") 
            .style("fill", "#aaaaff")
            .attr("font-size", "14px")
            .text(lnk_txt);
    };

    createTxt(30, "Created by", "Adam Stone", "https://fabacademy.org/2023/labs/charlotte/students/adam-stone/")
    createTxt(10, "For documentation", "click here", "https://fabacademy.org/2023/labs/charlotte/students/adam-stone/lessons/side-projects/lab-link-graph/")
};