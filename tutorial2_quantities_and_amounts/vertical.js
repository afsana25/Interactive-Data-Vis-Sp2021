d3.csv('../data/squirrelActivities.csv', d3.autoType).then(data =>
    {
    console.log("data", data)

 // constants

const width = window.innerWidth * 0.50; // 50 percent of width of the window
const height = window.innerHeight /1.7  ; // 1/1.7 of the height of the window

const margin = {top: 10, right:20, bottom: 20., left: 20 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;

// Scales
// xscale-Categorical Acitivity
const xScale = d3.scaleBand()
.domain(data.map(d=> d.activity))
.range([0, innerWidth]) //visual variable
.paddingInner(0.5) //get space between bars

console.log(xScale.domain(), xScale.range())


//yscale- linear, count
const yScale = d3.scaleLinear()
.domain([0, d3.max(data, d=>d.count)]) //take 0-1435(max value of count)
.range([innerHeight, 0]) //(min, max)visual variable

//console.log(yScale.domain(), yScale.range())


//console.log(xScale, xScale("climbing")) // the number value that correspond to that variable

//svg
const svg = d3.select("#barchart1")
.append("svg")
.attr("width", width)
.attr("height", height)

const g = svg.append('g') //group element
    .attr('transform', `translate(${margin.top},${margin.right})`);

g.append('g').call(d3.axisTop(xScale)); //x axis name
//g.append('g').call(d3.axisLeft(yScale)); //y axis name


//bars
//select

//data join
//style/draw elements
g.selectAll("rect").data(data) //data join
.enter().append("rect")
.attr("width", xScale.bandwidth())
.attr("height", d => innerHeight-yScale(d.count))
.attr("x", d=>xScale(d.activity))
.attr("y", d=>yScale(d.count))
    })