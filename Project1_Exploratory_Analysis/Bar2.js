let state2 = {

    //data = null,
    // hover: {
    //   position: null,
    //  Income_Group: null,
    // visible: false,
    // }
  }


d3.csv("./Data/Statistics.csv", d3.autoType).then(data2 => 
    {

      state2.data2 = data2
    console.log("data2", data2);

    data2.sort(function(b, a){
      return a.Employment_ratio -b.Employment_ratio
    })

    init2();
    }

)

function init2(){
 // constants

const width = window.innerWidth*0.6 ; // 50 percent of width of the window
const height = window.innerHeight*0.6 ; // 1/2 of the height of the window

const margin = {top: 70, right:20, bottom: 30., left: 20 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;

// Scales
// xscale-Categorical Acitivity
const x = d3.scaleBand()
.domain(state2.data2.map(d=> d.Region))
.range([0, innerWidth]) //visual variable
.paddingInner(0.3) //get space between bars

console.log(x.domain(), x.range())

//yscale- linear, count
const y = d3.scaleLinear()
.domain([0, d3.max(state2.data2, d=>d.Employment_ratio)]) //take 0-1435(max value of count)
.range([innerHeight, 0]) //(min, max)visual variable

console.log(y.domain(), y.range())

//+ AXES
    const xAxis1 = d3.axisBottom(x)
    //const yAxis = d3.axisLeft(yScale)


//console.log(xScale, xScale("climbing")) // the number value that correspond to that variable
const colorScale1 = d3.scaleOrdinal()
  //.domain(["Asia", "Europe", "North America", "South America", "Africa", "Australia and Ocenia"])
  .domain(d3.map(state2.data2, d=>d.Region))
  .range(d3.schemeSet2);

//svg
const svg = d3.select("#barchart1")
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
    //.attr("transform", "translate(-10,0)rotate(-45)")
      //.style("text-anchor", "middle")
    .call(xAxis1)
    .append("text")
  .text("Male and Female Employment participant ratio in terms of Region")
  .attr("transform", `translate(${width*0.5}, ${-height/1.2})`)
  .style("font-size:", "10px")

//bars
//select

//data join
//style/draw elements
svg.selectAll("rect").data(state2.data2) //data join
.enter().append("rect")
.attr("width", x.bandwidth())
.attr("height", d=>innerHeight-y(d.Employment_ratio))
.transition()
.duration(8000)
.attr("x", d=>x(d.Region))
.attr("y", d=>y(d.Employment_ratio))
.style("fill", d=>colorScale1(d.Region))
.attr("class", "bubbles")
.attr("text-anchor", 'middle')


svg.selectAll("text.Employment_ratio")
      .data(state2.data2)
      .join("text")
      .attr("class", 'Employment_ratio')
      .attr("x", d => x(d.Region) + (x.bandwidth() / 2))
      .attr("y", d => y(d.Employment_ratio))
      .attr("dy", "-1em") 
     // .attr("text-anchor", 'middle')
      .text(d => d3.format(".0%")((d.Employment_ratio)/100)) 
}
