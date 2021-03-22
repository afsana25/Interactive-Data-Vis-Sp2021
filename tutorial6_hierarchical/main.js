/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth,
  height = window.innerHeight ,
  margin = { top: 20, bottom: 50, left: 60, right: 40 }
  ;

let svg;
let tooltip;
//let radius;

/**
 * APPLICATION STATE
 * */
let state = {
  // + INITIALIZE STATE
};

/**
 * LOAD DATA
 * */
d3.json("../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const colorScale = d3.scaleOrdinal(d3.schemeSet3)
  //const sizeScale = d3.scaleSqrt()
  //.range([5, 10])
  console.log(state.data)
  const container = d3.select("#d3-container").style("position", "relative");

  svg = container
    .append("svg")
    .attr("width", width+30)
    .attr("height", height+30)
    .attr("viewBox", [0, 0, width, height])
    .style("font", "6px sans-serif")
      .attr("text-anchor", "middle");

    tooltip = container
    .append("div")
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0)
    .style("background-color", "white")

    const root = d3.hierarchy(state.data)
    .sum(d=>d.value)
    .sort((a, b)=> b.value- a.value)

    console.log("state.data", state.data)
    console.log("root", root)

    const treeLayout = d3.pack()
    .size([width, height])
    .padding(1)
  
    
    treeLayout(root)
    //console.log("root after layout function", root)

  // Join our leaves to data

  const leaves = root.leaves()
  console.log("leaves", leaves)
  
const leafGroup = svg.selectAll("g")
.data(leaves)
.join("g")
.attr("transform", d=>`translate(${d.x+1}, ${d.y+1})`)


//append rect
leafGroup.append("circle")
.attr("fill", d => {
  const level1Ancestor = d.ancestors().find(a=> a.depth===1)
  return colorScale(level1Ancestor.data.name)
})
.attr("stroke","red")
.attr("height", d=> d.x+30)
.attr("width", d=>d.y+30)
.attr("r", d=>d.r)


leafGroup.append("text")
//.attr("dy", "1em")
.text(d=>d.data.name)

leafGroup.on("mouseenter", (event, d)=>{
  state.hoverLeaf = d.data.name
  state.hoverPositionX = d.x
 state.hoverPositionY = d.y
  //state.hoverPositionR = d.r

draw()

})

  draw(); // calls the draw function
}

//append text


/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // + UPDATE TOOLTIP

  console.log(state.hoverLeaf)
  tooltip
  .style("transform", `translate(${state.hoverPositionX}px, ${state.hoverPositionY}px)`)
  .html(`
  <div>${state.hoverLeaf}</div>`)

}
