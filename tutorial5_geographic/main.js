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
  Temperature: null,
  hover: {
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
    mapPosition: null, // will be array of [long, lat] once mouse is hovered on something
    Name : null,
    temp: null,
    visible: false,
  }
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, Temperature]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  state.Temperature = Temperature
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


  //const colorScale = d3.scaleSequential(d3.interpolateReds)
  //.domain(d3.extent(state.Temperature, d=>d.Change_in_95_percent_Days))

  const colorScaleL = d3.scaleLinear([0, d3.max(state.Temperature)])

  const pathFunction = d3.geoPath(projection)

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
.attr("fill", "white")
.attr("d", pathFunction)

// cuny circle

svg.selectAll("circle")
.data(state.Temperature)
.join("circle")
.attr("fill", d=>{
  if (d.Change_in_95_percent_Days>10) return "red"
  //else if (d.Change_in_95_percent_Days>0 || d.Change_in_95_percent_Days<10) return "pink"
  else if (d.Change_in_95_percent_Days<10) return "blue"
  //else return "blue"
})
.attr("r", d=>{
  if (d.Change_in_95_percent_Days>10) return 15;
  else if (d.Change_in_95_percent_Days>5 || d.Change_in_95_percent_Days<10) return 6;
  else if (d.Change_in_95_percent_Days>0 || d.Change_in_95_percent_Days<5) return 3;
  else return 1
})
.attr("fill-opacity", "0.4")
.attr("transform", d=>{
  console.log(d)
  const point = projection([d.Long, d.Lat])
  return `translate(${point[0]}, ${point[1]})`
} )

states.on("mouseover", function(event, d){
  const {clientX, clientY} = event
  
  const [long, lat] = projection.invert([clientX, clientY])

  state.hover= {
    Name: d.State,
    temp: d.Change_in_95_percent_Days,
    screenPosition: [clientX, clientY],
    mapPosition: [long, lat],
    visible: true,

  }

  draw();

}).on("mouseout", event => {
  state.hover.visible = true
  draw(); // calls the draw function
})

draw();
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {

d3.select("#d3-container") // want to add
    .selectAll('div.hover-content')
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-content')
    .classed("visible", d=> d.visible)
    .style("position", 'absolute')
    .style("transform", d=> {
      // only move if we have a value for screenPosition
      if (d.screenPosition)
      return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1]}px)`
    })
    .html(d=> {
      return `<div> Location: ${d.mapPosition}</div>
      <div> State name: ${d.Name}</div>
      <div> Temperature: ${d.temp}<div>`}
      )
}