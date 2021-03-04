/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 100, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale1;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "Afganistan", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('../data/refugees_per_capita.csv', (d)=>{
  const formattedObj= {
country: d.Country,
population: +d.Population,
Refugees: +d.Refugees,
RefPerCap: +d.RefPerCap,
year: new Date(+d.Year, 01, 01) //(year, month, day)
  }
  //console.log(d, formattedObj)
  return formattedObj
})
.then(data => {
  console.log("loaded data:", data);
  state.data = data;
init()
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
console.log('state', state)

  // + SCALES
 xScale = d3.scaleTime()
  .domain(d3.extent(state.data, d=>d.year)) //state.data= holding our data
  //
.range([margin.left, width - margin.right])

yScale = d3.scaleLinear()
 .domain(d3.extent(state.data, d=>d.RefPerCap) )// [min, max]
  .range([height-margin.bottom, margin.top]);
  
  // + AXES
const xAxis  = d3.axisBottom(xScale)
const yAxis  = d3.axisLeft(yScale)

//Create svg
svg = d3.selectAll('#d3-container')
.append("svg")
.attr('width', width)
.attr('height', height)

// already set transform to (x,y)=(0, 240px)
svg.append("g")
.attr("class", "xAxis")
.attr("transform", `translate(${0}, ${height-margin.bottom})`) //translate(x,y)
.call(xAxis)
.append("text")
.text("Year")
.attr("transform", `translate(${width/2}, ${40})`)

svg.append("g")
.attr("class", "yAxis") 
.attr("transform", `translate(${margin.left},${0})`)//translate(x,y)
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.text("Population")
.attr("transform", `translate(${0}, ${height/2})`)

//SETUP UI ELEMENTS

const dropdown = d3.select("#dropdown")
dropdown.selectAll("options")
.data(Array.from(new Set(state.data.map(d=>d.country))))
.join("option")
.attr("value", d=>d)
.text(d=>d)


dropdown.on("change", event => {
console.log("dropdown changed!", event.target.value) 
state.selection = event.target.value
console.log("new state:", state)
draw(); //Recall draw

  })


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {

  console.log("state.selected", state.selection)
 // + FILTER DATA BASED ON STATE

 const filteredData = state.data.filter(d=> state.selection === d.country )

 yScale
 .domain(d3.extent(filteredData, d=> d.RefPerCap)) //update the scale

 console.log(filteredData)

 // +DRAW LINE AND/OR AREA


const lineFunction = d3.line()
.x(d => xScale(d.year))
.y(d=> yScale(d.RefPerCap))


svg.selectAll("path.line")
.data([filteredData])
.join("path")
.attr("class", "line")
.attr("fill", "none")
.attr("stroke", "black")
.attr("d", lineFunction)

//SELECT_ALL()
// JOIN DATA
// RENDER ELEMENTS


}
