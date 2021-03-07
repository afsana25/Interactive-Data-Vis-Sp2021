
// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale1;
let yScale1;
//let yScale2;

// APPLICATION STATE 
let state = {
  data1: [],
  selection: "All", // + YOUR FILTER SELECTION
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
.then(data1 => {
  console.log("loaded data:", data1);
  state.data1 = data1;
init1()
});
/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init1() {
console.log('state', state)

  // + SCALES
 xScale1 = d3.scaleTime()
  .domain(d3.extent(state.data1, d=>d.year)) //state.data= holding our data
  //
.range([margin.left, width - margin.right])

yScale1 = d3.scaleLinear()
 .domain(d3.extent(state.data1, d=>d.RefPerCap) )// [min, max]
  .range([height-margin.bottom, margin.top]);
  // + AXES
const xAxis  = d3.axisBottom(xScale1)
const yAxis  = d3.axisLeft(yScale1)
//const yAxis1  = d3.axisLeft(yScale2)

//Create svg
svg = d3.selectAll('#d3-area')
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
.attr("class", "axis-label")
.attr('y', -60)
.attr('x', -height/2)
.attr('transform', `rotate(-90)`)
.attr("text-anchor", "middle")
.text("Refegees per Capita")


svg.append("g")
.attr("class", "yAxis") 
.call(yAxis)
.append("text")
.text("Refugees per Capita By Country")
.attr("transform", `translate(${width/1.8}, ${20})`)

//SETUP UI ELEMENTS

const dropdown2 = d3.select("#dropdown2")
dropdown2.selectAll("options")
.data(Array.from(new Set(state.data1.map(d=>d.country))))
.join("option")
.attr("value", d=>d)
.text(d=>d)


dropdown2.on("change", event => {
console.log("dropdown changed!", event.target.value) 
state.selection = event.target.value
console.log("new state:", state)
draw1(); //Recall draw

  })


  draw1(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw1() {

  console.log("state.selected", state.selection)
 // + FILTER DATA BASED ON STATE

 const filteredData = state.data1.filter(d=> state.selection === d.country )

 yScale1
 .domain(d3.extent(filteredData, d=> d.RefPerCap)) //update the scale
//yScale2
// .domain(d3.extent(filteredData, d=> d.RefPerCap))

 console.log(filteredData)

 // +DRAW LINE AND/OR AREA


const areaFunction = d3.area()
.x(d => xScale1(d.year))
.y0(height-margin.bottom)
.y1(d=> yScale1(d.RefPerCap))
.curve(d3.curveBasis)

svg.selectAll("path.line")
.data([filteredData])
.join("path")
.attr("class", "line")
.attr("fill", "pink")
//.attr("stroke", "black")
.attr("d", areaFunction)


//SELECT_ALL()
// JOIN DATA
// RENDER ELEMENTS


}
