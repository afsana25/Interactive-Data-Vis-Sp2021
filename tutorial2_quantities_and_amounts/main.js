// Represents the data in the javascript

d3.csv('../data/squirrelActivities.csv', d3.autoType).then(data => 
    {
   console.log("data", data)

    
 // constants

const width = window.innerWidth * .7; // 70 percent of width of the window
const height = window.innerHeight/2.5; // 1/2.5 of the height of the window

const xValue = d=>d.count;
const yValue = d=>d.activity;
const margin = {top: 10, right:5, bottom: 5, left: 100 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;

console.log(innerWidth, innerHeight)


//xscale- linear, count
const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xValue)])
            .range([0, innerWidth]);
            console.log(xScale.domain(), xScale.range());

// Scales
// yscale-Categorical Acitivity
const yScale = d3.scaleBand()
            .domain(data.map(yValue))
            .range([0, innerHeight])
            .padding(0.3);

const svg = d3.select("#barchart2")
.append("svg").
attr("width", width)
.attr("height", height)

const g = svg.append('g') //group element
           .attr('transform', `translate(${margin.left},${margin.top})`);

//g.append('g').call(d3.axisBottom(xScale)); //x axis name
g.append('g').call(d3.axisLeft(yScale)); //y axis name

//bars
//select

//data join
//style/draw elements
g.selectAll("rect").data(data) //data join
                .enter().append("rect")
                .attr('y', d=>yScale(yValue(d)))
                .attr("width", d=>xScale(xValue(d)))
                .attr("height", yScale.bandwidth());

    })
