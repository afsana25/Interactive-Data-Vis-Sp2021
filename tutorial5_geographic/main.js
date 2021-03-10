/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  // + SET UP STATE
  geojson: null,
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  //d3.csv("PATH_TO_ANOTHER_DATASET", d3.autoType),
]).then(([geojson, otherData]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  console.log("state: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const projection = d3.geoAlbersUsa() //it will goes to long/lat => x/y
  .fitSize([width, height], state.geojson)

  const colorScale = d3.scaleSequential(d3.interpolateReds)
  .domain(d3.extent(state.geojson.features, d=>d.properties.AWATER))

  const pathFunction = d3.geoPath(projection)

  const graduateCenterCoords = [{long: -73.984, lat: 40.7486}]//array of longitude and latitude
    console.log(projection, projection(graduateCenterCoords))
// create an svg element in our main 'd3-containe' element 
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


// base layer of states
const states = svg.selectAll("path")
.data(state.geojson.features)
.join("path")
.attr("stroke", "black")
.attr("fill", d=>{
  console.log(d)
  return colorScale(d.properties.AWATER)
})
.attr("d", pathFunction)

// cuny circle

svg.selectAll("circle")
.data(graduateCenterCoords)
.join("circle")
.attr("fill", "red")
.attr("r", 7)
.attr("transform", d=>{
  console.log(d)
  const point = projection([d.long, d.lat])
  console.log("point", point)
  return `translate(${point[0]}, ${point[1]})`
} )

states.on("mouseover", (event, d) =>
{
console.log("event", event)
console.log("d", d)
console.log(d.properties.NAME, pathFunction.centroid(d))
})

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {}
