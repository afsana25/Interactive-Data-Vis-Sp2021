let state3 = {

    //data = null,
    // hover: {
    //   position: null,
    //  Income_Group: null,
    // visible: false,
    // }
  }


d3.csv("./Data/Average_Literacy_IncomeGroup.csv", d3.autoType).then(data3 => 
    {

      state3.data3 = data3
    console.log("data3", data3);

    data3.sort(function(b, a){
      return a.Average_Literacy_rate_2018-b.Average_Literacy_rate_2018
    })

    init3();
    }

)

function init3(){
 // constants

const width = window.innerWidth*.6; // 50 percent of width of the window
const height = window.innerHeight*0.6 ; // 1/2 of the height of the window

const margin = {top: 70, right:20, bottom: 30., left: 20 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;

// Scales
// xscale-Categorical Acitivity
const x = d3.scaleBand()
.domain(state3.data3.map(d=> d.IncomeGroup))
.range([0, innerWidth]) //visual variable
.paddingInner(0.3) //get space between bars

console.log(x.domain(), x.range())

//yscale- linear, count
const y = d3.scaleLinear()
.domain([0, d3.max(state3.data3, d=>d.Average_Literacy_rate_2018)]) //take 0-1435(max value of count)
.range([innerHeight, 0]) //(min, max)visual variable

console.log(y.domain(), y.range())

//+ AXES
    const xAxis1 = d3.axisBottom(x)
    //const yAxis = d3.axisLeft(yScale)


//console.log(xScale, xScale("climbing")) // the number value that correspond to that variable
const colorScale1 = d3.scaleOrdinal()
  //.domain(["Asia", "Europe", "North America", "South America", "Africa", "Australia and Ocenia"])
  .domain(d3.map(state3.data3, d=>d.IncomeGroup))
  .range(d3.schemeSet3);

//svg
const svg = d3.select("#barchart2")
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
  .text("Average Literacy Rate of Women in terms  of IncomeGroup")
  .attr("transform", `translate(${width*0.5}, ${-height/1.1})`)
  .style("font-size:", "20px")
  .attr("fill", "black")

//bars
//select

//data join
//style/draw elements
svg.selectAll("rect").data(state3.data3) //data join
.enter().append("rect")
.attr("width", x.bandwidth())
.attr("height", d=>innerHeight-y(d.Average_Literacy_rate_2018))
.transition()
.duration(8000)
.attr("x", d=>x(d.IncomeGroup)) 
.attr("y", d=>y(d.Average_Literacy_rate_2018))
.style("fill", d=>colorScale1(d.IncomeGroup))
.attr("class", "bubbles")
.attr("text-anchor", 'middle')


svg.selectAll("text.Average_Literacy_rate_2018")
      .data(state3.data3)
      .join("text")
      .attr("class", 'Average_Literacy_rate_2018e')
      .attr("x", d => x(d.IncomeGroup) + (x.bandwidth() / 2))
      .attr("y", d => y(d.Average_Literacy_rate_2018))
      .attr("dy", "-1em") 
     .attr("text-anchor", 'middle')
      .text(d => d3.format(".0%")((d.Average_Literacy_rate_2018)/100)) 
}
