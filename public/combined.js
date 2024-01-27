let minMaxMap={},numLinksDict={},links_not_filtered,nodes_not_filtered,nodes,node_ids,links,currentLabHighlightList,currentYear="All",maxStrength,labs,simulation,svg,link,node,defs,pieG,minNumConnections=20,g,gl,referenceCache,currentTopic="All",mapMin=1,mapMax=60,startDegree=-135,endDegree=135,startPos=-48,currentDialDeg=startPos,numText,dialGroup,mousePos,linearGradient,gl_,linearGradientDict={},Tooltip,transformation,svgPoint,boundingRect,mouseIsDragging=!1,body,tooltipFlippedX=!1,tooltipFlippedY=!1,mouseIsOver=!1,objectBeingDragged;LABS_CONTINENT={vigyanashram:"Asia",oulu:"Europe",kamplintfort:"Europe",charlotte:"North America",lccc:"North America",bahrain:"Asia",uae:"Asia",libya:"Africa",techworks:"North America",newcairo:"Africa",egypt:"Africa",lakazlab:"Africa",tecsup:"South America",wheaton:"North America",fablabuae:"Asia",qbic:"Asia",kochi:"Asia",ied:"Europe",fablabtrivandrum:"Asia",fablabakgec:"Asia",barcelona:"Europe",fablabsorbonne:"Europe",fablabcept:"Asia",rwanda:"Africa",leon:"Europe",lamachinerie:"Europe",fablabdigiscope:"Europe",energylab:"Europe",akgec:"Asia",irbid:"Asia",reykjavik:"Europe",sorbonne:"Europe",incitefocus:"North America",puebla:"North America",tecsupaqp:"South America",ucontinental:"South America",fablabopendot:"Europe",santachiara:"Europe",fablabechofab:"North America",zoi:"Asia",cidi:"North America",dassault:"Europe",stjude:"North America",aalto:"Europe",fablabzoi:"Asia",ecae:"Asia",fablabbahrain:"Asia",khairpur:"Asia",insper:"South America",trivandrum:"Asia",inphb:"Africa",digiscope:"Europe",ulb:"Europe",lima:"South America",fablabspinderihallerne:"Europe",fablabfct:"Europe",fct:"Africa",opendot:"Europe",fablabtecsup:"South America",vancouver:"North America",fablabbrighton:"Europe",akureyri:"Europe",yucatan:"North America",bhutan:"Asia",fablabaachen:"Europe",waag:"Europe",echofab:"North America",dilijan:"Asia",polytech:"Europe",agrilab:"Asia",fablabsiena:"Europe",winam:"Africa",fablaboulu:"Europe",fablabreykjavik:"Europe",kamakura:"Asia",falabvestmannaeyjar:"Europe",singapore:"Asia",oshanghai:"Asia",fablaboshanghai:"Asia",fablabutec:"South America",fablabodessa:"Europe",esan:"South America",fablabvigyanasharm:"Asia",hkispace:"Asia",taipei:"Asia",fablabmexico:"North America",ciudadmexico:"North America",aachen:"Europe",fablabbottrop:"Europe",fablabaalto:"Europe",keolab:"Asia",cpcc:"North America",fablabkamplintfort:"Europe",ingegno:"Europe",fablabkamakura:"Asia",tinkerers:"Asia",cit:"Europe",utec:"South America",fablabamsterdam:"Europe",tianhelab:"Asia",bhubaneswar:"Asia",cept:"Asia",fablabbeijing:"Asia",talents:"Europe",fablabyachay:"South America",fablabdassault:"Europe",ecostudio:"North America",fablabseoul:"Asia",kaust:"Asia",berytech:"Asia",fablabpuebla:"North America",fablabrwanda:"Africa",fablabesan:"South America",fablabberytech:"Asia",crunchlab:"Europe",ucal:"North America",vestmannaeyjar:"Europe",sedi:"Europe",isafjordur:"Europe",fablabegypt:"Africa",szoil:"Asia",formshop:"Asia",fablabkochi:"Asia",fablabincitefocus:"North America",kitakagaya:"Asia",kannai:"Asia",dhahran:"Asia",seoulinnovation:"Asia",ioannina:"Europe",fablabyucatan:"North America",fablabirbid:"Asia",deusto:"Europe",falabdeusto:"Europe",riidl:"Asia",bottrop:"Europe",fablabisafjorour:"Europe",plusx:"Asia",fablaberfindergarden:"Europe",uemadrid:"Europe",fablabtembisa:"Africa",brighton:"Europe",fablabfacens:"South America",fablableon:"Europe",fablabszoil:"Asia",fablabgearbox:"Africa",farmlabalgarve:"Europe",algarve:"Europe",twarda:"Europe",bangalore:"Asia",fablabsantiago:"South America",fablablccc:"North America",fablabcharlottelatin:"North America",fablabat3flo:"Europe",fablabecostudio:"North America",fablabsocom:"Asia",boldseoul:"Asia",napoli:"Europe",fablabkromlaboro:"Europe",seoul:"Asia",fablabtechworks:"North America",fablabkhairpur:"Asia",chaihuo:"Asia",fablabulb:"Europe",esne:"Europe",ulima:"South America",fablabseoulinnovation:"Asia",benfica:"Europe",fablabmadridceu:"Europe",chandigarh:"Asia",jubail:"Asia",ningbo:"Asia",fablabwgtn:"Oceania"};const updateCallbacks=[(e,a)=>{let t=(e,t,n)=>{let l=e.filter(e=>n(e)),o=l.map(e=>e.id);return[l,JSON.parse(JSON.stringify(t)).filter(e=>(e.topic==a.topic||"All"==a.topic)&&o.includes(e.target)&&o.includes(e.source))]},[n,l]=t(e.nodes,e.links,e=>"All"==a.topic?sumObj(numLinksDict[e.id].target)>=a.minNumConnections:numLinksDict[e.id].target[a.topic]>=a.minNumConnections);return{nodes:n,links:l}}],calculationCallbacks=[(e,a)=>{let t=0;return e.links.forEach(e=>{e.value>t&&(t=e.value)}),{maxStrength:t}},(e,a)=>({condensedLinks:condenseLinksforSimulation(e.links)}),(e,a,t)=>{let n=a.gl.selectAll("path").data(t.condensedLinks,e=>uniqueId(e));n.exit().remove();let l=n.enter().append("path").merge(n);return{link:l}},(e,a)=>{let t=a.g.selectAll("circle").data(e.nodes,e=>e.id);t.exit().remove();let n=t.enter().append("circle").merge(t);return{node:n}}],attributeCallbacks=[(e,a,t)=>{a.node.attr("r",e=>referenceCache[e.id][t.topic]),t.simulation.nodes(e.nodes),forceCollide.initialize(e.nodes)},(e,a,t)=>{t.simulation.force("link",d3.forceLink(a.condensedLinks).id(e=>e.id).distance(e=>getSimulationForceLinkDistance(e))),t.simulation.force("collision",forceCollide.radius(e=>e.r))},(e,a,t)=>{a.node.attr("fill",e=>{let a=e.id.split(";")[1].split("/")[5];return colorRegion(LABS_CONTINENT[a])}).attr("opacity",NODE_HIGHLIGHTED_OPACITY).call(d3.drag().on("start",dragstarted).on("drag",dragged).on("end",dragended))},(e,a,t)=>{a.link.attr("fill","none").attr("stroke-width",LINE_WIDTH).style("stroke-linecap","round")},(e,a,t)=>{let n=()=>{a.link.attr("d",e=>{let a=getGradientID(e),n=document.getElementById(a),{source:l,sourceYear:o,sourceLab:s,target:c,targetYear:u,targetLab:d}=getLinkSummary(e),b=activationCheck(t.year,t.currentLabHighlightList,o,s),f=activationCheck(t.year,t.currentLabHighlightList,u,d);b&&f||!(b||f)||(b?(n.setAttribute("x1",e.source.x),n.setAttribute("y1",e.source.y),n.setAttribute("x2",e.target.x),n.setAttribute("y2",e.target.y)):(n.setAttribute("x2",e.source.x),n.setAttribute("y2",e.source.y),n.setAttribute("x1",e.target.x),n.setAttribute("y1",e.target.y)));let p=d3.path();return p.moveTo(e.source.x,e.source.y),p.lineTo(e.target.x,e.target.y),p.toString()})};n(),t.simulation.on("tick",()=>{n(),a.node.attr("cx",e=>e.x).attr("cy",e=>e.y)})},(e,a,t)=>{a.node.attr("opacity",e=>{let a=e.id.split(";")[1].split("/")[3],n=e.id.split(";")[1].split("/")[5];return(a==t.year||"All"==t.year)&&t.currentLabHighlightList.includes(n)?NODE_HIGHLIGHTED_OPACITY:minOpacity})},(e,a,t)=>{a.link.attr("opacity",e=>{let{source:a,sourceYear:n,sourceLab:l,target:o,targetYear:s,targetLab:c}=getLinkSummary(e),u=!1,d=!1;return(activationCheck(t.year,t.currentLabHighlightList,n,l)&&(u=!0),activationCheck(s,c)&&(d=!0),(u||d)&&!(u&&d))?null:1}),a.link.attr("stroke",e=>{let a=e.source.id,n=a.split(";")[1].split("/")[3],l=a.split(";")[1].split("/")[5],o=e.target.id,s=o.split(";")[1].split("/")[3],c=o.split(";")[1].split("/")[5],u=!1,d=!1;return(activationCheck(t.year,t.currentLabHighlightList,n,l)&&(u=!0),activationCheck(t.year,t.currentLabHighlightList,s,c)&&(d=!0),u&&d)?"rgba("+RGB_LINE_COLOR+",1)":u||d?`url(#${getGradientID(e)})`:"rgba("+RGB_LINE_COLOR+",0.05)"})},(e,a,t)=>{a.node.each(function(e,a){let t=d3.select(this);t.on("mouseover")||(t.on("mouseover",tooltipMouseover).on("mousemove",tooltipMousemove).on("mouseleave",tooltipMouseleave),t.on("click",(e,a)=>{window.open(a.id.split(";")[1],"_blank")}))})},(e,a,t)=>t.simulation.alpha(1).restart()],filterData=(e,a)=>{let t={nodes:nodes_not_filtered,links:links_not_filtered};for(let n of e)t=n(t,a);return t},runCalculations=(e,a,t)=>{let n={};for(let l of e)n={...n,...l(a,t,n)};return n},setDataAttributes=(e,a,t,n)=>{for(let l of e)l(a,t,n)},updateData=e=>{e={...e,topic:"topic"in e?e.topic:currentTopic,year:currentYear,currentLabHighlightList};let a=filterData(updateCallbacks,e),t=runCalculations(calculationCallbacks,a,e);setDataAttributes(attributeCallbacks,a,t,e)},clamp=(e,a,t)=>Math.min(Math.max(e,a),t),toTitleCase=e=>e.replace(/\w\S*/g,function(e){return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()});function normalize(e,a,t){return(e-a)/(t-a)}const calculateMinMax=(e,a,t)=>{let n=1/0,l=-1/0;return e.forEach(e=>{let o=0;a.forEach(a=>{a.target==e.id&&(t==a.topic||"All"==t)&&(o+=a.value)}),o<n&&(n=o),o>l&&(l=o)}),{min:n,max:l}},sumObj=e=>Object.values(e).reduce((e,a)=>e+a,0),getAllLabs=e=>{let a=[];for(let t=0;t<e.length;t++){let n=e[t],l=n.split(";")[1].split("/")[5];a.includes(l)||a.push(l)}return a},filterStudents=(e,a,t)=>{let n=e.filter(e=>t(e)),l=n.map(e=>e.id),o=JSON.parse(JSON.stringify(a)).filter(e=>(l.includes(e.target.id)||l.includes(e.target))&&l.includes(e.source.id)|l.includes(e.source));return[n,l,o]},uniqueId=e=>{let a,t;return"string"==typeof e.source?(a=e.source,t=e.target):(a=e.source.id,t=e.target.id),`${a}${t}${e.topic}${e.value}`},createNumLinksDictFrom_not_filtered=()=>{for(let e=0;e<nodes_not_filtered.length;e++){let a={source:{},target:{}};for(let t=0;t<TOPICS.length;t++)a.source[TOPICS[t]]=0,a.target[TOPICS[t]]=0;numLinksDict[nodes_not_filtered[e].id]=a}for(let n=0;n<links_not_filtered.length;n++){let l=links_not_filtered[n];numLinksDict[l.target].target[l.topic]+=l.value,numLinksDict[l.source].source[l.topic]+=l.value}},create_not_filteredFromJSON=async()=>d3.json("final_data.json").then(e=>{links_not_filtered=e.links.map(e=>Object.assign({},e)).filter(e=>e.target!=e.source),nodes_not_filtered=e.nodes.map(e=>Object.assign({},e))}),assignFilter=e=>([nodes,node_ids,links]=e),transferNot_filteredToArrays=()=>{assignFilter(filterStudents(nodes_not_filtered,links_not_filtered,e=>"All"==currentTopic?sumObj(numLinksDict[e.id].target)>=minNumConnections:numLinksDict[e.id].target[currentTopic]>=minNumConnections))},initializeDefs=()=>{linearGradient=d3.select("defs").selectAll("linearGradient")},getGradientID=e=>{let a,t;try{a=e.source.id.replace(/\W/g,"_")}catch{a=e.source.replace(/\W/g,"_")}try{t=e.target.id.replace(/\W/g,"_")}catch{t=e.target.replace(/\W/g,"_")}return`gradient_${a}|${t}`},registerLinearGradients=e=>{let a=linearGradient.data(e,e=>getGradientID(e));a.exit().each(function(e,a){let t=d3.select(this);document.remove(linearGradient[getGradientID(t)]),delete linearGradient[getGradientID(t)]}).remove();let t=a.enter().append("linearGradient").attr("gradientUnits","userSpaceOnUse").attr("id",e=>getGradientID(e)).attr("x1",0).attr("x2",1).attr("y1",0).attr("y2",0);t.append("stop").attr("offset","0%").attr("stop-color","rgba("+RGB_LINE_COLOR+",1)"),t.append("stop").attr("offset","100%").attr("stop-color","rgba("+RGB_LINE_COLOR+",0)"),d3.select("defs").selectAll("linearGradient").each(function(e,a){let t=d3.select(this);linearGradientDict[getGradientID(e)]=t})},condenseLinksforSimulation=e=>{let a=[];for(let t of e){condensed=!1;for(let n=0;n<a.length;n++){r=a[n];let l,o,s,c;if(l="string"==typeof t.target?t.target:t.target.id,o="string"==typeof r.target?r.target:r.target.id,s="string"==typeof t.source?t.source:t.source.id,c="string"==typeof r.source?r.source:r.source.id,l==o&&s==c||l==c&&s==o){a[n].value+=t.value,condensed=!0;break}}condensed||(delete t.topic,a.push(t))}return a},calculateMaxStrength=()=>{maxStrength=0,links.forEach(e=>{e.value>maxStrength&&(maxStrength=e.value)})},setLabs=e=>labs=getAllLabs(e).sort(),setCurrentLabHighlightList=()=>currentLabHighlightList=labs,calculateSimulationStrength=(e,a)=>e=>MINIMUM_STRENGTH_CONSTANT+Math.sqrt((10*normalize(e.value,0,maxStrength)+1)/SCALE_FACTOR),createSimulation=()=>{simulation=d3.forceSimulation(nodes).force("boundary",forceBoundary(forceBoundaryMargin,forceBoundaryMargin,width-forceBoundaryMargin,height-forceBoundaryMargin)).force("link",d3.forceLink(links).id(e=>e.id).strength(e=>calculateSimulationStrength(e,maxStrength))).force("charge",d3.forceManyBody().strength(-60)).force("center",d3.forceCenter(width/2,height/2))},createAndFormatSVG=()=>{transformation=(svg=d3.select("svg").attr("width",width).attr("height",height).attr("viewBox",[0,0,width,height]).style("max-width","100%").style("height","auto").style("background-color","white")).node().getCTM(),svgPoint=svg.node().createSVGPoint(),boundingRect=svg.node().getBoundingClientRect()},linksToLink=e=>{e&&(gl=svg.append("g").attr("transform","translate(150, -10)"));let a=gl.selectAll("path").data(condenseLinksforSimulation(links),e=>uniqueId(e));return a.exit().remove(),a.enter().append("path").merge(a).attr("fill","none").attr("stroke-width",LINE_WIDTH).style("stroke-linecap","round"),a},calculateMinMaxMapFromFiltered=()=>{[...TOPICS,"All"].forEach(e=>{minMaxMap[e]=calculateMinMax(nodes_not_filtered,links_not_filtered,e)})},nodesToNodeAndFormat=()=>{g=node=svg.append("g").attr("transform","translate(150, -10)")},configureNode=(e,a)=>{let t=g.selectAll("circle").data(a,e=>e.id);t.exit().remove();let n=t.enter().append("circle").merge(t);return n.attr("r",e=>referenceCache[e.id].All),n.attr("fill",e=>{let a=e.id.split(";")[1].split("/")[5];return colorRegion(LABS_CONTINENT[a])}).attr("opacity",NODE_HIGHLIGHTED_OPACITY).call(d3.drag().on("start",dragstarted).on("drag",dragged).on("end",dragended)),g.selectAll("circle")};function dragstarted(e,a){objectBeingDragged=d3.select(this),e.active||simulation.alphaTarget(.3).restart(),a.fx=a.x,a.fy=a.y,mouseIsDragging=!0}function dragged(e,a){a.fx=e.x,a.fy=e.y}function dragended(e,a){e.active||simulation.alphaTarget(0),a.fx=null,a.fy=null,mouseIsDragging=!1;let t=pointerOutOfSVG();t&&tooltipMouseleave(null,null,objectBeingDragged),objectBeingDragged=null}const getSimulationForceLinkDistance=e=>referenceCache[e.target.id][currentTopic]+referenceCache[e.source.id][currentTopic],calibrateSimulation=()=>{simulation.force("collision",forceCollide.radius(e=>e.r/1.2)),simulation.force("link",d3.forceLink(links).id(e=>e.id).distance(e=>getSimulationForceLinkDistance(e)))},activationCheck=(e,a,t,n)=>(t==e||"All"==e)&&a.includes(n),linkTick=()=>{link.attr("d",e=>{let a=getGradientID(e),t=document.getElementById(a),{source:n,sourceYear:l,sourceLab:o,target:s,targetYear:c,targetLab:u}=getLinkSummary(e),d=activationCheck(l,o),b=activationCheck(c,u);d&&b||!(d||b)||(d?(t.setAttribute("x1",e.source.x),t.setAttribute("y1",e.source.y),t.setAttribute("x2",e.target.x),t.setAttribute("y2",e.target.y)):(t.setAttribute("x2",e.source.x),t.setAttribute("y2",e.source.y),t.setAttribute("x1",e.target.x),t.setAttribute("y1",e.target.y)));let f=d3.path();return f.moveTo(e.source.x,e.source.y),f.lineTo(e.target.x,e.target.y),f.toString()})},setSimulationTick=(e,a)=>{linkTick(),simulation.on("tick",()=>{linkTick(),e.attr("cx",e=>e.x).attr("cy",e=>e.y)})},selectByTopic=e=>{currentTopic=e;let a=0;links.forEach(t=>{t.value>a&&(t.topic==e||"All"==e)&&(a=t.value)}),link.attr("opacity",t=>t.topic==e||"All"==e?(normalize(t.value,0,a)/2+.5)/SCALE_FACTOR:0),simulation.force("link",d3.forceLink(links).id(e=>e.id).strength(e=>calculateSimulationStrength(e,a)).distance(e=>getSimulationForceLinkDistance(e)));let t=[];links.forEach(a=>{(a.topic==e||"All"==e)&&t.push(a)}),node.attr("r",a=>referenceCache[a.id][e]),simulation.force("link",d3.forceLink(t).id(e=>e.id).distance(e=>getSimulationForceLinkDistance(e))),forceCollide.initialize(nodes),simulation.alpha(1).restart()},configureGlowDefinitions=()=>{(defs=svg.append("defs")).append("filter").attr("id","sofGlow").attr("width","300%").attr("height","300%").attr("x","-100%").attr("y","-100%").attr("stdDeviation","1").attr("result","coloredBlur").append("feGaussianBlur").attr("in","thicken").attr("stdDeviation","1").attr("result","blurred")},getLinkSummary=e=>{let a=e.source.id,t=a.split(";")[1].split("/")[3],n=a.split(";")[1].split("/")[5],l=e.target.id,o=l.split(";")[1].split("/")[3],s=l.split(";")[1].split("/")[5];return{source:a,sourceYear:t,sourceLab:n,target:l,targetYear:o,targetLab:s}},setLinkOpacity=()=>{link.attr("opacity",e=>{let{source:a,sourceYear:t,sourceLab:n,target:l,targetYear:o,targetLab:s}=getLinkSummary(e),c=!1,u=!1;return(activationCheck(t,n)&&(c=!0),activationCheck(o,s)&&(u=!0),(c||u)&&!(c&&u))?null:1}),link.attr("stroke",e=>{let a=e.source.id,t=a.split(";")[1].split("/")[3],n=a.split(";")[1].split("/")[5],l=e.target.id,o=l.split(";")[1].split("/")[3],s=l.split(";")[1].split("/")[5],c=!1,u=!1;return((t==currentYear||"All"==currentYear)&&currentLabHighlightList.includes(n)&&(c=!0),(o==currentYear||"All"==currentYear)&&currentLabHighlightList.includes(s)&&(u=!0),c&&u)?"rgba(255,255,255"+((normalize(e.value,0,maxStrength)/2+.5)/SCALE_FACTOR).toString()+")":c||u?`url(#${getGradientID(e)})`:"rgba(255,255,255,0.05)"})},setYear=e=>{currentYear=e,updateData({minNumConnections,simulation,svg,g,gl:gl_})},createPie=()=>{let e=svg.append("g").attr("transform","translate("+pieX+","+pieY+") rotate("+360/14+")");var a={All:1};for(let t=2018;t<=2023;t++)a[t]=1;var n,l=d3.pie().value(function(e){return e.value})(Object.entries(a).map(([e,a])=>({key:e,value:a}))),o=d3.arc().innerRadius(50).outerRadius(pieRadius);let s=a=>{var t=-((a.startAngle+a.endAngle)/2);e.transition().duration(1e3).attr("transform","translate("+pieX+","+pieY+") rotate("+t/Math.PI*180+")")};e.selectAll("mySlices").data(l).enter().append("path").attr("d",o).attr("fill",PIE_SLICE_COLOR).attr("stroke","white").style("stroke-width","2px").style("opacity",1).on("click",function(e,a){setYear(a.data.key),s(a)}),e.selectAll("mySlices").data(l).enter().append("text").text(function(e){return e.data.key}).attr("dy","0.3em").attr("transform",function(e){return"translate("+o.centroid(e)+") rotate("+(e.startAngle+e.endAngle)/2*(180/Math.PI)+")"}).style("text-anchor","middle").style("fill",PIE_TEXT_COLOR).attr("font-weight",700).attr("font-family","Saira").style("font-size",18).on("click",function(e,a){setYear(a.data.key),s(a)})},createReferenceCache=()=>{referenceCache={},["All",...TOPICS.slice(1,-1)].forEach(e=>{nodes_not_filtered.forEach(a=>{let t=0;links_not_filtered.forEach(n=>{n.target==a.id&&("All"==e||n.topic==e)&&(t+=n.value)}),t=normalize(t,minMaxMap[e].min,minMaxMap[e].max)*NODE_SIZE_MULTIPLIER*((1-1/minMaxMap[e].max)/2)+NODE_SIZE_MINIMUM,t/=SCALE_FACTOR,a.r=t,a.id in referenceCache||(referenceCache[a.id]={}),referenceCache[a.id][e]=t})})},centerText=(e,a)=>{let t=e.node().getBBox().width;e.attr("x",a-t/2)},pointerOutOfSVG=()=>{let e=document.elementFromPoint(mousePos.x,mousePos.y);return!(svg.node()===e||svg.node().contains(e))},tooltipMouseover=function(e,a){mouseIsOver||(mouseIsOver=!0,Tooltip.style("display","initial").style("visibility","visible"),d3.select(this).style("stroke",HOVER_NODE_STROKE_COLOR).style("stroke-width",NODE_STROKE_WIDTH_HIGHLIGHTED))};var tooltipMousemove=function(e,a){Tooltip.html("<span>Student: "+a.id.split(";")[0]+"<br>Year: "+a.id.split(";")[1].split("/")[3]+"<br>Lab: "+namesFromCodes[a.id.split(";")[1].split("/")[5]]+'<br>Region: <span style="color:'+colorRegion(LABS_CONTINENT[a.id.split(";")[1].split("/")[5]])+';">'+LABS_CONTINENT[a.id.split(";")[1].split("/")[5]]+"</span></span>")},tooltipMouseleave=function(e,a,t=null){mouseIsDragging||(mouseIsOver=!1,Tooltip.style("display","none").style("visbility","hidden"),(null==t?d3.select(this):t).style("stroke",NOT_HOVERING_NODE_STROKE_COLOR).style("stroke-width",NOT_HOVERING_NODE_STROKE_WIDTH))};const NODE_STROKE_WIDTH_HIGHLIGHTED="1.5px",HOVER_NODE_STROKE_COLOR="black",NOT_HOVERING_NODE_STROKE_WIDTH="0px",NOT_HOVERING_NODE_STROKE_COLOR="",RGB_LINE_COLOR="0,0,0",LINE_WIDTH="0.3px",CAROUSEL_RECT_STROKE_COLOR="",CAROUSEL_RECT_STROKE_WIDTH="0px",CAROUSEL_SELECTOR_COLOR="black",DIAL_OUTLINE_COLOR="grey",DIAL_TEXT_COLOR="black",OVERLAY_TEXT_LINK_COLOR="#7e7eed",SCALE_FACTOR=1,forceBoundaryMargin=30,minOpacity=.15,NODE_HIGHLIGHTED_OPACITY=1,MINIMUM_STRENGTH_CONSTANT=100,PIE_SLICE_COLOR="grey",PIE_TEXT_COLOR="white",DIAL_STICK_COLOR="grey",CAROUSEL_OPTION_COLOR="grey",CAROUSEL_TEXT_COLOR="white",FAB_PALETTE=["#f1f2f2","#f1d2f2","#f1b2f2","#f04260","#4abfbd","#284fb5","#f05c71"],NODE_REGION_PALETTE=["#1da619","#f04260","#4abfbd","#284fb5","#f05be1","#87743d"],continent=["Africa","Asia","Europe","North America","South America","Oceania"],continentColor={};for(let i=0;i<NODE_REGION_PALETTE.length;i++)continentColor[continent[i]]=NODE_REGION_PALETTE[i];const NODE_SIZE_MULTIPLIER=50,NODE_SIZE_MINIMUM=5,TOPICS=["Prefab","Computer-Aided Design","Computer-Controlled Cutting","Embedded Programing","3D Scanning and Printing","Electronics Design","Computer-Controlled Machining","Electronics Production","Mechanical Design, Machine Design","Input Devices","Moulding and Casting","Output Devices","Embedded Networking and Communications","Interface and Application Programming","Wildcard Week","Applications and Implications","Invention, Intellectual Property and Business Models","Final Project","Other"],codesFromNames={Talents:["talents"],AgriLab:["agrilab"],Amsterdam:["fablabamsterdam"],"IED Madrid":["ied"],Bhutan:["bhutan"],"Sorbonne University":["fablabsorbonne","sorbonne"],ULB:["fablabulb","ulb"],Leon:["fablableon","leon"],Dilijan:["dilijan"],"Universitario CIDi":["cidi"],Vestmannaeyjar:["falabvestmannaeyjar","vestmannaeyjar"],Vancouver:["vancouver"],Waag:["waag"],"EnergyLab-Lom\xe9":["energylab"],Spinderihallerne:["fablabspinderihallerne"],"New Cairo":["newcairo"],EchoFab:["echofab","fablabechofab"],CEPT:["cept","fablabcept"],Khairpur:["fablabkhairpur","khairpur"],Reykjavik:["fablabreykjavik","reykjavik"],Egypt:["egypt","fablabegypt"],Oulu:["fablaboulu","oulu"],Berytech:["berytech","fablabberytech"],Bahrain:["bahrain","fablabbahrain"],"Charlotte Latin":["charlotte","fablabcharlottelatin"],"Santa Chiara":["fablabsiena","santachiara"],Digiscope:["digiscope","fablabdigiscope"],BoldLab:["seoul","fablabseoul","fablabseoulinnovation","boldseoul","seoulinnovation"],Beijing:["fablabbeijing"],"O Shanghai":["fablaboshanghai","oshanghai"],Aalto:["aalto","fablabaalto"],"La Machinerie":["lamachinerie"],"Dassault Systemes":["dassault","fablabdassault"],Kannai:["kannai"],ZOI:["fablabzoi","zoi"],Irbid:["fablabirbid","irbid"],Kamakura:["fablabkamakura","kamakura"],Brighton:["brighton","fablabbrighton"],AKGEC:["akgec","fablabakgec"],Opendot:["fablabopendot","opendot"],EcoStudio:["ecostudio","fablabecostudio"],FCT:["fct","fablabfct"],Bottrop:["bottrop","fablabbottrop"],Aachen:["aachen","fablabaachen"],Trivandrum:["fablabtrivandrum","trivandrum"],UAE:["fablabuae","uae"],Kochi:["fablabkochi","kochi"],"TechWorks Amman":["fablabtechworks","techworks"],Singapore:["singapore"],LazLab:["lakazlab"],"Vigyan Asharm":["fablabvigyanasharm","vigyanashram"],Puebla:["fablabpuebla","puebla"],Wheaton:["wheaton"],"Ciudad Mexico":["ciudadmexico"],Barcelona:["barcelona"],"Incite Focus":["incitefocus","fablabincitefocus"],Santiago:["fablabsantiago"],Winam:["winam"],"Kamp-Lintfort":["fablabkamplintfort","kamplintfort"],TECSUP:["fablabtecsup","tecsup","tecsupaqp"],QBIC:["qbic"],ESAN:["esan","fablabesan"],Rwanda:["fablabrwanda","rwanda"],"Lorain College":["fablablccc","lccc"],Bhubaneswar:["bhubaneswar"],SZOIL:["fablabszoil","szoil"],UTEC:["fablabutec","utec"],Lima:["lima"],Taipei:["taipei"],Ucontinental:["ucontinental"],Akureyri:["akureyri"],Algarve:["algarve","farmlabalgarve"],Bangalore:["bangalore"],Benfica:["benfica"],Chaihuo:["chaihuo"],Chandigarh:["chandigarh"],CIT:["cit"],CPCC:["cpcc"],Crunchlab:["crunchlab"],Deusto:["deusto","falabdeusto"],Dhahran:["dhahran"],ECAE:["ecae"],ESNE:["esne"],At3flo:["fablabat3flo"],Erfindergarden:["fablaberfindergarden"],Facens:["fablabfacens"],Gearbox:["fablabgearbox"],Isafjorour:["fablabisafjorour","isafjorour"],KromLaboro:["fablabkromlaboro"],"Madrid CEU":["fablabmadridceu"],Odessa:["fablabodessa"],Tembisa:["fablabtembisa"],Wgtn:["fablabwgtn"],Yachay:["fablabyachay"],Yucatán:["fablabyucatan","yucatan"],"Formshop Shanghai":["formshop"],"Hong Kong iSPACE":["hkispace"],Ingegno:["ingegno"],"INP-HB":["inphb"],Insper:["insper"],Ioannina:["ioannina"],Jubail:["jubail"],KAUST:["kaust"],KeoLAB:["keolab"],Kitakagaya:["kitakagaya"],Libya:["libya"],Napoli:["napoli"],"Ningbo-NexMaker":["ningbo"],PlusX:["plusx"],Polytech:["polytech"],RIIDL:["riidl"],"SEDI-Cup-ct":["sedi"],"St. Jude":["stjude"],"Tianhe Lab":["tianhelab"],Tinkerers:["tinkerers"],Twarda:["twarda"],UCAL:["ucal"],"Universidad Europea":["uemadrid"],Ulima:["ulima"],SOCOM:["fablabsocom"],Isafjordur:["isafjordur"]},namesFromCodes={talents:"Talents",agrilab:"AgriLab",fablabamsterdam:"Amsterdam",ied:"IED Madrid",bhutan:"Bhutan",fablabsorbonne:"Sorbonne University",sorbonne:"Sorbonne University",fablabulb:"ULB",ulb:"ULB",fablableon:"Leon",leon:"Leon",dilijan:"Dilijan",cidi:"Universitario CIDi",falabvestmannaeyjar:"Vestmannaeyjar",vestmannaeyjar:"Vestmannaeyjar",vancouver:"Vancouver",waag:"Waag",energylab:"EnergyLab-Lom\xe9",fablabspinderihallerne:"Spinderihallerne",newcairo:"New Cairo",echofab:"EchoFab",fablabechofab:"EchoFab",cept:"CEPT",fablabcept:"CEPT",fablabkhairpur:"Khairpur",khairpur:"Khairpur",fablabreykjavik:"Reykjavik",reykjavik:"Reykjavik",egypt:"Egypt",fablabegypt:"Egypt",fablaboulu:"Oulu",oulu:"Oulu",berytech:"Berytech",fablabberytech:"Berytech",bahrain:"Bahrain",fablabbahrain:"Bahrain",charlotte:"Charlotte Latin",fablabcharlottelatin:"Charlotte Latin",fablabsiena:"Santa Chiara",santachiara:"Santa Chiara",digiscope:"Digiscope",fablabdigiscope:"Digiscope",seoul:"BoldLab",fablabseoul:"BoldLab",fablabseoulinnovation:"BoldLab",boldseoul:"BoldLab",seoulinnovation:"BoldLab",fablabbeijing:"Beijing",fablaboshanghai:"O Shanghai",oshanghai:"O Shanghai",aalto:"Aalto",fablabaalto:"Aalto",lamachinerie:"La Machinerie",dassault:"Dassault Systemes",fablabdassault:"Dassault Systemes",kannai:"Kannai",fablabzoi:"ZOI",zoi:"ZOI",fablabirbid:"Irbid",irbid:"Irbid",fablabkamakura:"Kamakura",kamakura:"Kamakura",brighton:"Brighton",fablabbrighton:"Brighton",akgec:"AKGEC",fablabakgec:"AKGEC",fablabopendot:"Opendot",opendot:"Opendot",ecostudio:"EcoStudio",fablabecostudio:"EcoStudio",fct:"FCT",fablabfct:"FCT",bottrop:"Bottrop",fablabbottrop:"Bottrop",aachen:"Aachen",fablabaachen:"Aachen",fablabtrivandrum:"Trivandrum",trivandrum:"Trivandrum",fablabuae:"UAE",uae:"UAE",fablabkochi:"Kochi",kochi:"Kochi",fablabtechworks:"TechWorks Amman",techworks:"TechWorks Amman",singapore:"Singapore",lakazlab:"LazLab",fablabvigyanasharm:"Vigyan Asharm",vigyanashram:"Vigyan Asharm",fablabpuebla:"Puebla",puebla:"Puebla",wheaton:"Wheaton",ciudadmexico:"Ciudad Mexico",fablabmexico:"Ciudad Mexico",barcelona:"Barcelona",incitefocus:"Incite Focus",fablabincitefocus:"Incite Focus",winam:"Winam",fablabkamplintfort:"Kamp-Lintfort",kamplintfort:"Kamp-Lintfort",fablabtecsup:"TECSUP",tecsup:"TECSUP",tecsupaqp:"TECSUP",qbic:"QBIC",esan:"ESAN",fablabesan:"ESAN",fablabrwanda:"Rwanda",rwanda:"Rwanda",fablablccc:"Lorain College",lccc:"Lorain College",bhubaneswar:"Bhubaneswar",fablabszoil:"SZOIL",szoil:"SZOIL",fablabutec:"UTEC",utec:"UTEC",lima:"Lima",taipei:"Taipei",ucontinental:"Ucontinental",akureyri:"Akureyri",algarve:"Algarve",farmlabalgarve:"Algarve",bangalore:"Bangalore",benfica:"Benfica",chaihuo:"Chaihuo",chandigarh:"Chandigarh",cit:"CIT",cpcc:"CPCC",crunchlab:"Crunchlab",deusto:"Deusto",falabdeusto:"Deusto",dhahran:"Dhahran",ecae:"ECAE",esne:"ESNE",fablabat3flo:"At3flo",fablaberfindergarden:"Erfindergarden",fablabfacens:"Facens",fablabgearbox:"Gearbox",fablabisafjorour:"Isafjorour",isafjorour:"Isafjorour",fablabkromlaboro:"KromLaboro",fablabmadridceu:"Madrid CEU",fablabodessa:"Odessa",fablabtembisa:"Tembisa",fablabwgtn:"Wgtn",fablabyachay:"Yachay",fablabyucatan:"Yucat\xe1n",yucatan:"Yucat\xe1n",formshop:"Formshop Shanghai",hkispace:"Hong Kong iSPACE",ingegno:"Ingegno",inphb:"INP-HB",insper:"Insper",ioannina:"Ioannina",jubail:"Jubail",kaust:"KAUST",keolab:"KeoLAB",kitakagaya:"Kitakagaya",libya:"Libya",napoli:"Napoli",ningbo:"Ningbo-NexMaker",plusx:"PlusX",polytech:"Polytech",riidl:"RIIDL",sedi:"SEDI-Cup-ct",stjude:"St. Jude",tianhelab:"Tianhe Lab",tinkerers:"Tinkerers",twarda:"Twarda",ucal:"UCAL",uemadrid:"Universidad Europea",ulima:"Ulima",fablabsantiago:"Santiago",fablabsocom:"SOCOM",isafjordur:"Isafjordur"},nonDiacriticLetters="abcdefghijklmnopqrstuvwxyz",width=1856,height=900,colorRegion=e=>continentColor[e],colorFab=d3.scaleOrdinal().range(FAB_PALETTE),shape=d3.scaleOrdinal().range(d3.symbols),radius_dict={},forceCollide=d3.forceCollide(),pieX=210,pieY=720,pieRadius=100,topicCarouselList=["All",...TOPICS.slice(1,-1)],initializeCarousel=(e,a,t,n,l,o,s,c)=>{let u=s.append("g"),d=d3.scaleBand().range([0,n]).domain(a).padding(.2);d3.scaleOrdinal().range(c),u.selectAll("rect").data(a).enter().append("rect").attr("x",10+l).attr("y",e=>d(e)+o).attr("width",t).attr("height",d.bandwidth()).attr("stroke","").attr("stroke-width","0px").attr("fill","grey").on("click",(e,a)=>{C(a)});var b,f=n/a.length-d.bandwidth()+t,p=n/a.length,h=t,m=d.bandwidth(),y={top:d(a[0])+(d.bandwidth()-n/a.length)/2,left:10-(n/a.length-d.bandwidth())/2,width:f,height:p},A={top:y.top+(p-m)/2,left:y.left+(f-h)/2,width:h,height:m},k=["M",y.left,y.top,"h",f,"v",p,"h",-f,"v",-p,"M",A.left,A.top,"h",h,"v",m,"h",-h,"v",-m,"Z"].join(" "),E=u.append("defs").append("mask").attr("id","myMask");E.append("rect").attr("x",l).attr("y",o).attr("width","100%").attr("height","100%").attr("fill","white"),E.append("rect").attr("x",A.left+l).attr("y",A.top+o).attr("width",A.width).attr("height",A.height).attr("fill","black");let v=u.append("rect").attr("x",y.left+l).attr("y",y.top+o).attr("width",y.width).attr("height",y.height).attr("fill","black").attr("mask","url(#myMask)"),C=t=>{v.transition().duration(1e3).attr("transform","translate(0, "+(d(t)-d(a[0]))+")"),e(t)},L=u.selectAll("text").data(a).enter().append("text").attr("x",10+t/2+l).attr("y",e=>d(e)+d.bandwidth()/2+o).attr("dy","0.3em").text(e=>e).on("click",(e,a)=>{C(a)});L.style("text-anchor","middle").style("fill","white").attr("font-weight",700).attr("font-family","Saira").attr("font-size",13)};let prevSentToCallback;const strokeWidth=12,dialY=pieY,dialX=width-pieX,generateDialMapScale=()=>d3.scaleLinear().domain([startDegree,endDegree]).range([clamp(mapMin,1,1/0),mapMax]),updateDialText=(e,a)=>{if(!dialGroup)return;dialGroup.attr("transform",`translate(${dialX}, ${dialY}) rotate(${e})`);var t,n=generateDialMapScale()(e);let l=Math.round(n);numText.text(l),numTextWidth=numText.node().getBBox().width,numText.attr("x",dialX-numTextWidth/2),a(l)};function convertSVGtoScreenCoordinates(e,a,t){var n=e.createSVGPoint();n.x=a,n.y=t;var l=n.matrixTransform(e.getScreenCTM());return{x:l.x,y:l.y}}function calculateAngle(e,a){let t=a.y-e.y,n;return Math.atan2(t,a.x-e.x)}const initializeDial=(e,a)=>{var t=+e.attr("width"),n=+e.attr("height"),l=pieRadius-6,o=document.getElementById("value-input");let s=(e,a,t)=>Math.min(Math.max(e,a),t),c=e.append("text");c.attr("x",dialX).attr("y",dialY+(l+24)).text("Minimum Times Referenced").attr("font-family","sans-serif").attr("font-size","13px").attr("fill",DIAL_TEXT_COLOR),centerText(c,dialX),(numText=e.append("text")).attr("x",dialX).attr("y",dialY+(l/2+12)).text("20").attr("font-family","sans-serif").attr("font-size","40px").attr("fill",DIAL_TEXT_COLOR);let u=numText.node().getBBox().width;numText.attr("x",dialX-u/2),window.addEventListener("mousemove",e=>{mousePos={x:e.clientX,y:e.clientY}});var d,b=d3.drag().on("start",(e,a)=>{a.x=e.sourceEvent.clientX,a.y=e.sourceEvent.clientY,a.currentDeg||(a.currentDeg=startPos)}).on("drag",(e,t)=>{let n=convertSVGtoScreenCoordinates(document.getElementsByTagName("svg")[0],dialX,dialY),l={x:e.sourceEvent.clientX,y:e.sourceEvent.clientY},o=calculateAngle(n,l)*(180/Math.PI),c=calculateAngle(n,{x:t.x,y:t.y})*(180/Math.PI),u=(o-c+180+360)%360-180;t.x=l.x,t.y=l.y,t.degNew=u+t.currentDeg,t.currentDeg=t.degNew,currentDialDeg=s(u+currentDialDeg,startDegree,endDegree),updateDialText(currentDialDeg,a)}).on("end",(e,a)=>{a.currentDeg=a.degNew});(dialGroup=e.append("g").data([{x:0,scale:d3.scaleLinear().domain([0,t]).range([startDegree,endDegree])}]).attr("transform",`translate(${dialX}, ${dialY}) rotate(${startPos})`).call(b)).append("circle").attr("r",l).style("fill","transparent"),dialGroup.append("circle").attr("r",l).style("fill","none").style("stroke","grey").style("stroke-width","12px"),dialGroup.append("line").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",-(l-12)).style("stroke","grey").style("stroke-width","12px").style("stroke-linecap","round");var f=d3.scaleLinear().domain([startDegree,endDegree]).range([mapMin,mapMax])(startPos)};Array.prototype.search=function(e){for(var a=0;a<this.length;a++)if(this[a]==e)return a;return -1};var Multiselect=function(e,a){if(!$(e)){console.error("ERROR: Element %s does not exist.",e);return}this.selector=e,this.selections=[],this.callback=a,function(e){e.events(a)}(this)};Multiselect.prototype={open:function(e){$(e).parent().attr("data-target"),this.selections||(this.selections=[]),$(this.selector+".multiselect").toggleClass("active")},close:function(){$(this.selector+".multiselect").removeClass("active")},events:function(e){var a=this;$(document).on("click",a.selector+".multiselect > .title",function(e){0>e.target.className.indexOf("close-icon")&&a.open()}),$(document).on("click",a.selector+".multiselect > .title > .close-icon",function(e){a.clearSelections()}),$(document).on("click",a.selector+".multiselect option",function(t){var n=$(this).attr("value"),l=$(a.selector+".multiselect option").length;if("All"==n)0>a.selections.search("All")?a.selections=$(a.selector+".multiselect option").map(function(){return $(this).val()}).get():a.selections=[];else{var o=a.selections.search(n);if(o<0?a.selections.push(n):a.selections.splice(o,1),a.selections.length!==l&&a.selections.search("All")>=0){let s=a.selections.search("All");-1!=s&&a.selections.splice(s,1)}else a.selections.length===l-1&&0>a.selections.search("All")&&a.selections.push("All")}if(a.selectionStatus(),a.setSelectionsString(),"function"==typeof e){let c=[];a.selections.forEach(e=>{e in codesFromNames?codesFromNames[e].forEach(e=>{c.push(e)}):c.push(e)}),e(c)}})},selectionStatus:function(){var e=$(this.selector+".multiselect");this.selections.length?e.addClass("selection"):e.removeClass("selection")},clearSelections:function(){this.selections=[],this.selectionStatus(),this.setSelectionsString(),this.callback([])},getSelections:function(){return this.selections},setSelectionsString:function(){var e=this.getSelectionsString().split(", ");$(this.selector+".multiselect > .title").attr("title",e);var a=$(this.selector+".multiselect option");e.toString().length>16?$(this.selector+".multiselect > .title > .text").text(e.toString().slice(0,16)+"..."):$(this.selector+".multiselect > .title > .text").text(e);for(var t=0;t<a.length;t++)$(a[t]).removeClass("selected");for(var n=0;n<e.length;n++)for(var l=e[n],t=0;t<a.length&&($(a[t]).attr("value")!=l&&"All"!=l||($(a[t]).addClass("selected"),"All"==l));t++);},getSelectionsString:function(){return this.selections.search("All")>=0?"All":this.selections.length>0?this.selections.join(", "):"Filter Labs"},setSelections:function(e){if(!e[0]){error("ERROR: This does not look like an array.");return}this.selections=e,this.selectionStatus(),this.setSelectionsString()}};const initializeLabMultiselect=(e,a)=>{$(document).ready(function(){new Multiselect("#countries",a)});let t=d3.select("#my_dataviz").select("div div.container"),n=[];e.forEach(e=>{Object.keys(namesFromCodes).includes(e)&&!n.includes(namesFromCodes[e])?n.push(namesFromCodes[e]):Object.keys(namesFromCodes).includes(e)||n.push(e)}),n.sort(),t.selectAll("option").data(["All"].concat(n)).join("option").attr("value",e=>e).html(e=>e)},createOverlayText=()=>{createdBy()},createdBy=()=>{let e=(e,a,t,n)=>{let l=height-e;svg.append("text").attr("font-size","14px").attr("x",10).attr("y",l).attr("class","overlay-text").text(a+" ").append("a").attr("xlink:href",n).attr("target","_blank").style("fill",OVERLAY_TEXT_LINK_COLOR).attr("font-size","14px").text(t)};e(50,"Created by","Adam Stone","https://fabacademy.org/2023/labs/charlotte/students/adam-stone/"),e(35,"For documentation","click here","https://gitlab.fabcloud.org/pub/project/expert-network-map/-/blob/main/documentation.md"),e(20,"Took inspiration from","Nadieh Bremer","https://royalconstellations.visualcinnamon.com/"),e(5,"Recieved guidance and support from","Francisco Sanchez","https://www.fablabs.io/users/francisco"),svg.append("text").attr("font-size","30px").attr("x",width/2).attr("y",height-10).attr("text-anchor","middle").attr("class","overlay-text").style("fill","red").text("Join the Mattermost Channel ").append("a").attr("xlink:href","https://chat.academany.org/fab-network/channels/fab-academy-data-viz").attr("target","_blank").style("fill",OVERLAY_TEXT_LINK_COLOR).attr("font-size","30px").text("Here")};window.onload=()=>{Tooltip=d3.select("#tooltip"),body=document.getElementsByTagName("body")[0],window.addEventListener("pointermove",e=>{mousePos={x:e.clientX,y:e.clientY};let a=Tooltip.node().offsetWidth,t=Tooltip.node().offsetHeight,n=document.documentElement.clientWidth,l=document.documentElement.clientHeight,o=e.clientX+body.scrollLeft+50,s=e.clientY+body.scrollTop-10,c={x:50,y:10};o+a+c.x-body.scrollLeft>n&&(o=o-a-100),s+t+c.y-body.scrollTop>l&&(s=s-t+20),Tooltip.style("left",o+"px"),Tooltip.style("top",s+"px")}),create_not_filteredFromJSON().then(()=>{calculateMinMaxMapFromFiltered(),createReferenceCache(),createNumLinksDictFrom_not_filtered(nodes_not_filtered,links_not_filtered),setLabs(nodes_not_filtered.map(e=>e.id)),transferNot_filteredToArrays(),calculateMaxStrength(),setCurrentLabHighlightList(),createSimulation(),createAndFormatSVG(),initializeDefs(),gl_=svg.append("g").attr("transform","translate(150, -10)"),registerLinearGradients(links_not_filtered),nodesToNodeAndFormat(),createPie(),createOverlayText(),updateData({minNumConnections:20,simulation,svg,g,gl:gl_}),initializeCarousel(e=>{"All"!=(currentTopic=e)?(mapMin=minMaxMap[currentTopic].min,mapMax=minMaxMap[currentTopic].max):[mapMin,mapMax]=[1,60],updateDialText(currentDialDeg,a)},topicCarouselList,350,600,30,10,svg,FAB_PALETTE);let e=e=>{currentLabHighlightList=e,updateData({minNumConnections,simulation,svg,g,gl:gl_})},a=(e,a=!1)=>{minNumConnections=e,updateData({minNumConnections:e,simulation,svg,g,gl:gl_,isFirst:a})};initializeDial(svg,a),initializeLabMultiselect(labs,e)})};