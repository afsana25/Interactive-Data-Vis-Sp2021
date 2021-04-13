

// set the dimensions and margins of the graph



// Parse the Data
d3.csv("./Data/Statistics2.csv", d3.autoType).then (data => {

  // List of subgroups = header of the csv files = soil condition here

  const width = window.innerWidth*0.8 ; // 50 percent of width of the window
const height = window.innerHeight*0.7 ; // 1/2 of the height of the window

const margin = {top: 20, right:30, bottom: 10., left: 30 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;


  const groupKey = data.columns[0]
  const keys = data.columns.slice(1)
console.log("keys", keys)
  //const groups = d3.map(data, d=>(d.Region))
  console.log("groupKey", groupKey)



    x0 = d3.scaleBand()
    .domain(data.map(d => d[groupKey]))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1)

  // // Add X axis
  const x = d3.scaleBand()
      .domain(keys)
      .range([0, x0.bandwidth()])
      .padding([0.2])

      console.log("x", x.domain())


     // // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(keys, keys => d[keys]))]).nice()
    .rangeRound([innerHeight, margin.top ]);
    
     console.log("x", y.domain())

     const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))


const xAxis = g => g
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x0))
  


  
const colorScale = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeSet2);


const svg = d3.select("#barchart")
.append("svg")
.attr("width", width)
.attr("height", height)

 svg.append("g")
      .call(xAxis)

  svg.append("g")
      .call(yAxis)

    svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
      .selectAll("rect")
    .data(d => keys.map(key=> ({key:key, value:d[key]})))
    .enter().append("rect")
    .transition()
    .duration(8000)
      .attr("x", d => x(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight- y(d.value))
      .attr("fill", d => colorScale(d.key))
      .attr("class", "bubbles")



svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", innerWidth*0.75)
    .attr("cy", (d,i) =>innerHeight*0.1- i*25)
    .attr("r", 7)
    .style("fill", d=> colorScale(d))

// Add one dot in the legend for each name.
svg.selectAll("mylabels")
  .data(keys)
  .enter()
  //.join("mylabels")
  .append("text")
    .attr("x",innerWidth*0.8)
    .attr("y", (d, i)=> innerHeight*0.05 + i*25) //  where the first dot appears. 25 is the distance between dots
    .style("fill", d=> colorScale(d.keys))
    .text(d=> d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "left")


})
