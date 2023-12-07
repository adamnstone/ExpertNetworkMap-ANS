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
            .style("fill", OVERLAY_TEXT_LINK_COLOR)
            .attr("font-size", "14px")
            .text(lnk_txt);
    };

    createTxt(50, "Created by", "Adam Stone", "https://adamnstone.com")
    //createTxt(50, "To join the Mattermost channel", "click here", "https://chat.academany.org/fabacademy-2023/channels/fab-academy-data-viz");
    createTxt(35, "For documentation", "click here", "https://gitlab.fabcloud.org/pub/project/expert-network-map/-/blob/main/documentation.md")
    createTxt(20, "Took inspiration from", "Nadieh Bremer", "https://royalconstellations.visualcinnamon.com/")
    createTxt(5, "Recieved guidance and support from", "Francisco Sanchez", "https://www.fablabs.io/users/francisco")

    svg.append("text")
        .attr("font-size", "30px")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("class", "overlay-text")
        .style("fill", "red")
        .text("Join the Mattermost Channel ")
        .append("a")
        .attr("xlink:href", "https://chat.academany.org/fabacademy-2023/channels/fab-academy-data-viz")
        .attr("target", "_blank") 
        .style("fill", OVERLAY_TEXT_LINK_COLOR)
        .attr("font-size", "30px")
        .text("Here");
};