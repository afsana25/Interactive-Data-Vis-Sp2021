d3.csv("./Data/Data_Final.csv", d3.autoType).then(data => 
    {
    console.log("data", data)

 // constants

const width = window.innerWidth*0.7 ; // 50 percent of width of the window
const height = window.innerHeight*0.7 ; // 1/2 of the height of the window

const margin = {top: 70, right:20, bottom: 30., left: 20 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;

// Scales
// xscale-Categorical Acitivity
const xScale = d3.scaleBand()
.domain(Array.from(new Set(data.map(d=> d.Region))))
.range([0, innerWidth]) //visual variable
.paddingInner(0.3) //get space between bars

console.log(xScale.domain(), xScale.range())


//yscale- linear, count
const yScale = d3.scaleLinear()
.domain([0, d3.max(data, d=>d.Fertility_rate19)]) //take 0-1435(max value of count)
.range([innerHeight, 0]) //(min, max)visual variable

console.log(yScale.domain(), yScale.range())

//+ AXES
    const xAxis = d3.axisBottom(xScale)
    //const yAxis = d3.axisLeft(yScale)



//console.log(xScale, xScale("climbing")) // the number value that correspond to that variable
const colorScale = d3.scaleOrdinal()
  //.domain(["Asia", "Europe", "North America", "South America", "Africa", "Australia and Ocenia"])
  .domain(Array.from(new Set(d3.map(data, d=>d.IncomeGroup))))
  .range(d3.schemeSet2);

//svg
const svg = d3.select("#barchart")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("text-anchor", "middle")

    svg.append("g")
    .attr("transform", `translate(${0}, ${height})`)
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${innerHeight})`) //translate(x,y)
    .call(xAxis)
    .append("text")
  .text("Fertility rate in terms of Region")
  .attr("transform", `translate(${width*0.5}, ${-height/1.1})`)

  

//    svg.append("g")
//   .attr("class", "yaxis")
//   .call(yAxis)
//   .append("text")
//   .text("Fertility rate in terms of Region")
//   .attr("transform", `translate(${width/1.1}, ${0.2})`)

   



//bars
//select

//data join
//style/draw elements
svg.selectAll("rect").data(data) //data join
.enter().append("rect")
.attr("width", xScale.bandwidth())
.attr("height", d=>innerHeight-yScale(d.Fertility_rate19))
.attr("x", d=>xScale(d.Region))
.attr("y", d=>yScale(d.Fertility_rate19))
.style("fill", d=>colorScale(d.IncomeGroup))


svg.selectAll("text.Fertility_rate19")
      .data(data)
      .join("text")
      .attr("class", 'Fertility_rate19')
      .attr("x", d => xScale(d.Region) + (xScale.bandwidth() / 2))
      .attr("y", d => yScale(d.Fertility_rate19))
      .attr("dy", "-1em") // adjust the text a bit lower down
     // .attr("text-anchor", 'middle') // set the x/y to refer to the middle of the word
      .text(d => d3.format(",")(d.Fertility_rate19)) // set the text, add a formatter to properly format numbers: https://github.com/d3/d3-format
    })