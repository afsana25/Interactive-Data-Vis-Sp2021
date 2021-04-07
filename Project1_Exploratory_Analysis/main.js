// set the dimensions and margins of the graph
const width = window.innerWidth*0.5,
  height = window.innerHeight*0.5,
  margin = { top: 20, bottom: 50, left: 70, right: 40 };
// append the svg object to the body of the page
const svg = d3.select("#d3-container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./Data/DataN.csv", d3.autoType).then(data => 
    {
   console.log("data", data)

  // Add X axis
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.Per_cap17))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.Fertility_rate19))
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
 const z = d3.scaleLinear()
    .domain(d3.extent(data, d=>d.Population19))
  //.range([margin.left, margin.right]);
  .range([3, 100])

    
  // Add circle
  svg.append('g')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d=> x(d.Per_cap17))
      .attr("cy", d=> y(d.Fertility_rate19))
      //.attr("r", 2)
      .attr("r", d=> z(d.Population19) *0.5)
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")
      
})