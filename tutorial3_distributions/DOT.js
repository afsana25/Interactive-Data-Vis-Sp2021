

let xScale1;
let yScale1;


let id = { //id is just an object keep track of user selection
data1: [], // one of the property data, it will keep track of whole data sets
  selectedPaid: "All" // + YOUR FILTER SELECTIONs
};

/* LOAD DATA */
d3.csv('../data/BusinessFinance.csv', d3.autoType).then(raw_data1 => {
  // + SET YOUR DATA PATH
  console.log("raw_data1", raw_data1);
  id.data1 = raw_data1; //save our data to application id
init1(); //initializing function
});

/* INITIALIZING FUNCTION */
function init1() {
  console.log('id', id)

  //SCALES
xScale1 = d3.scaleLinear()
  .domain(d3.extent(id.data1, d=>d.numSubscribers)) //id.data= holding our data
  //
    .range([margin.left, width - margin.right])
  //console.log("xScale", xScale, xScale(0.8417651235))

  yScale1 = d3.scaleLinear()
 .domain(d3.extent(id.data1, d=>d.numReviews) )// [min, max]
  .range([height-margin.bottom, margin.top]);
  
  //console.log("yScale", yScale, yScale(7))

  // + AXES
const xAxis1  = d3.axisBottom(xScale1)
const yAxis1 = d3.axisLeft(yScale1)

//Create svg
svg = d3.selectAll('#d3-dot')
.append("svg")
.attr('width', width)
.attr('height', height)

// already set transform to (x,y)=(0, 240px)
svg.append("g")
.attr("class", "xAxis1")
.attr("transform", `translate(${0}, ${height-margin.bottom})`) //translate(x,y)
.call(xAxis1)
.append("text") // Call x-axis name
.text("The number of subsribers")
.attr("transform", `translate(${width/2}, ${40})`)

svg.append("g")
.attr("class", "yAxis1")
.attr("transform", `translate(${margin.left},${0})`) //translate(x,y)
.call(yAxis1)
//.text("The number of Reviews")



//SET UP UI Elements
const dropdown2 = d3.select("#dropdown2")
dropdown2.selectAll("options")
.data(["All", "YES", "No"])
.join("option")
.attr("value", d=>d)
.text(d=>d)

dropdown2.on("change", event => {
console.log("dropdown changed!", event.target.value) 
id.selectedPaid = event.target.value
console.log("new id:", id)
draw1(); //Recall draw
})

draw1();
}

/* DRAW FUNCTION */
//we call this everytime there is an update to the data/id

function draw1(){
  console.log("I am in the draw function!")

  //Filter data besed on id

const filteredData1 = id.data1
.filter(d=> {
  if (id.selectedPaid=== "All") return true
 else return  d.isPaid === id.selectedPaid
})

// +DRAW Circles

svg.selectAll("circle")
  .data(filteredData1, d=>d.publishedTime) // Array of object [{},{}]
  .join(
    enter=>enter.append("circle")
  .attr("r", radius)
  .attr("cx", width-margin.right)
  .attr("fill", d => {
  if (d.isPaid=== "YES") return "purple"
  if (d.isPaid=== "No") return "darkblue"
  })
  )
  // start a transition
  .attr("cy", d=>yScale1(d.numReviews))
  .call(enter=> enter.transition()
  .duration(1000) // 1000 miliseconds
  //set the end attribute
  .attr("cx", d=>xScale1(d.numSubscribers))),

 update =>update,
  exit => exit
  .call(exit.transition()
  .duration(100)
  .attr("cy", height)
  .remove())
}