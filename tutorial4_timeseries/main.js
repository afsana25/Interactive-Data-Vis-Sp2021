/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 100, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg1;
let xScale;
let yScale;

/* APPLICATION STATE */
let state1 = {
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
  state1.data = data;
init()
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
console.log('state1', state1)

  // + SCALES
 xScale = d3.scaleTime()
  .domain(d3.extent(state1.data, d=>d.year)) //state.data= holding our data
  //
.range([margin.left, width - margin.right])

yScale = d3.scaleLinear()
 .domain(d3.extent(state1.data, d=>d.RefPerCap) )// [min, max]
  .range([height-margin.bottom, margin.top]);
  
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
.text("Year")
.attr("transform", `translate(${width/2}, ${40})`)

svg1.append("g")
.attr("class", "yAxis") 
.attr('y', -60)
.attr("transform", `translate(${margin.left},${0})`)//translate(x,y)
.call(yAxis)
.append("text")
.attr("class", "axis-label")
.attr('y', -60)
.attr('x', -height/2)
.attr('transform', `rotate(-90)`)
.attr("text-anchor", "middle")
.text("Refegees per Capita")

svg1.append("g")
.attr("class", "yAxis") 
.call(yAxis)
.append("text")
.text("Refugees per Capita By Country")
.attr("transform", `translate(${width/1.8}, ${20})`)

//SETUP UI ELEMENTS

const dropdown1 = d3.select("#dropdown1")
dropdown1.selectAll("options")
.data(Array.from(new Set(state1.data.map(d=>d.country))))
.join("option")
.attr("value", d=>d)
.text(d=>d)


dropdown1.on("change", event => {
console.log("dropdown changed!", event.target.value) 
state1.selection = event.target.value
console.log("new state:", state1)
draw(); //Recall draw

  })


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {

  console.log("state1.selected", state1.selection)
 // + FILTER DATA BASED ON STATE

 const filteredData1 = state1.data.filter(d=> state1.selection === d.country )

 yScale.domain(d3.extent(filteredData1, d=> d.RefPerCap)) //update the scale


 // +DRAW LINE AND/OR AREA


const lineFunction = d3.line()
.x(d => xScale(d.year))
.y(d=> yScale(d.RefPerCap))


svg1.selectAll("path.line")
.data([filteredData1])
.join("path")
.attr("class", "line")
.attr("fill", "none")
.attr("stroke", "maroon")
.attr("d", lineFunction)

//SELECT_ALL()
// JOIN DATA
// RENDER ELEMENTS


}
