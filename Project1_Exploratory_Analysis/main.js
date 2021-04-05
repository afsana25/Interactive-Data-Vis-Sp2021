/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 70, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let xScale;
let yScale;
let z;

//let svg1;

/* APPLICATION STATE */
let state = { //state is just an object keep track of user selection
 data: [], // one of the property data, it will keep track of whole data sets
 // selectedParty: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.csv('./data/Data2019.csv', d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data; //save our data to application state
//init(); //initializing function
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
//function init() {

  //console.log('state', state)

  // + SCALES
 xScale = d3.scaleLinear()
  .domain(d3.extent(state.data, d=>d.fertility2019)) //state.data= holding our data
  //
.range([margin.left, width - margin.right])

  console.log("xScale", xScale)
//}

const svg = d3.select("#d3-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

 yScale = d3.scaleLinear()
 .domain(d3.extent(state.data, d=>d.population) )// [min, max]
  .range([height-margin.bottom, margin.top]);


    z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([ 1, 40]);
 svg.append('g')
    .selectAll("dot")
    .data(state.data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return xScale(d.fertility2019); } )
      .attr("cy", function (d) { return yScale(d.population); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")