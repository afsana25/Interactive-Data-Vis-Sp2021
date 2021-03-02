/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 70, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let xScale;
let yScale;

let svg1;

/* APPLICATION STATE */
let state = { //state is just an object keep track of user selection
  data: [], // one of the property data, it will keep track of whole data sets
  selectedParty: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.json('../data/environmentRatings.json', d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data; //save our data to application state
init(); //initializing function
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {

  console.log('state', state)

  // + SCALES
 xScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d=>d.ideologyScore2020)) //state.data= holding our data
  //
.range([margin.left, width - margin.right])

  console.log("xScale", xScale, xScale(0.8417651235))

yScale = d3.scaleLinear()
 .domain(d3.extent(state.data, d=>d.envScore2020) )// [min, max]
  .range([height-margin.bottom, margin.top]);
  
  console.log("yScale", yScale, yScale(7))
  // + AXES
const xAxis  = d3.axisBottom(xScale)
const yAxis  = d3.axisLeft(yScale)

//Create svg
svg1 = d3.selectAll('#d3-container')
.append("svg")
.attr('width', width)
.attr('height', height)

// already set transform to (x,y)=(0, 240px)
svg1.append("g")
.attr("class", "xAxis")
.attr("transform", `translate(${0}, ${height-margin.bottom})`) //translate(x,y)
.call(xAxis)
.append("text")
.text("ideologyScore2020")
.attr("transform", `translate(${width/2}, ${40})`)

svg1.append("g")
.attr("class", "yAxis") 
.attr("transform", `translate(${margin.left},${0})`)//translate(x,y)
.call(yAxis)
.append("text")
.text("envScore2020")
//.attr("transform", "rotate(-90)")
.attr("transform", `translate(${0}, ${height/2})`)

//SETUP UI ELEMENTS

const dropdown1 = d3.select("#dropdown1")
dropdown1.selectAll("options")
.data(["All", "R", "D"])
.join("option")
.attr("value", d=>d)
.text(d=>d)

dropdown1.on("change", event => {
console.log("dropdown changed!", event.target.value) 
state.selectedParty = event.target.value
console.log("new state:", state)
draw(); //Recall draw
})

draw();

}

function draw(){
  console.log("I am in the draw function!")

  //Filter data besed on state

const filteredData = state.data
.filter(d=> {
  if (state.selectedParty=== "All") return true
 else return  d.Party === state.selectedParty
})

// +DRAW Circles

svg1.selectAll("circle")
  .data(filteredData, d=>d.BioID) // Array of object [{},{}]
  .join(
    enter=>enter.append("circle")
  .attr("r", radius)
  // set attribute before
  .attr("cx", width- margin.right)
  //.attr("fill", "magenta")
  .attr("fill", i =>{
  if (i.Party=== "R") return "red"
  else return "blue"
  })
  )
  // start a transition
  .attr("cy", i=>yScale(i.envScore2020))
  .call(enter=> enter.transition()
  .duration(1000) // 1000 miliseconds
  //set the end attribute
  .attr("cx", i=>xScale(i.ideologyScore2020))
  ) 
//set the end attribute
  ,
  update=>update,
  exit => exit
  .call(exit
   .transition()
   .duration(1000)
   .attr("cy", height)
   .remove())

}

