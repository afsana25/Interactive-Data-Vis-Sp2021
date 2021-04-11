//APPLICATION STATE

  let state1 = {

    //data = null,
    // hover: {
    //   position: null,
    //  Income_Group: null,
    // visible: false,
    // }
  }


d3.csv("./Data/Statistics.csv", d3.autoType).then(data1 => 
    {

      state1.data1 = data1
    console.log("data", data1);

    init1();
    }

)

function init1(){
 // constants

const width = window.innerWidth*0.7 ; // 50 percent of width of the window
const height = window.innerHeight*0.7 ; // 1/2 of the height of the window

const margin = {top: 70, right:20, bottom: 30., left: 20 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;

// Scales
// xscale-Categorical Acitivity
const x = d3.scaleBand()
.domain(state1.data1.map(d=> d.Region))
.range([0, innerWidth]) //visual variable
.paddingInner(0.3) //get space between bars

console.log(x.domain(), x.range())

//yscale- linear, count
const y = d3.scaleLinear()
.domain([0, d3.max(state1.data1, d=>d.Participant_Rate)]) //take 0-1435(max value of count)
.range([innerHeight, 0]) //(min, max)visual variable

console.log(y.domain(), y.range())

//+ AXES
    const xAxis1 = d3.axisBottom(x)
    //const yAxis = d3.axisLeft(yScale)


//console.log(xScale, xScale("climbing")) // the number value that correspond to that variable
const colorScale1 = d3.scaleOrdinal()
  //.domain(["Asia", "Europe", "North America", "South America", "Africa", "Australia and Ocenia"])
  .domain(d3.map(state1.data1, d=>d.Region))
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
    .call(xAxis1)
    .append("text")
  .text("Female Employment participant rate in terms of Region")
  .attr("transform", `translate(${width*0.5}, ${-height/1.1})`)

//bars
//select

//data join
//style/draw elements
svg.selectAll("rect").data(state1.data1) //data join
.enter().append("rect")
.attr("width", x.bandwidth())
.attr("height", d=>innerHeight-y(d.Participant_Rate))
.attr("x", d=>x(d.Region))
.attr("y", d=>y(d.Participant_Rate))
.style("fill", d=>colorScale1(d.Region))
.attr("class", "bubbles")
.attr("text-anchor", 'middle')

svg.selectAll("text.Participant_Rate")
      .data(state1.data1)
      .join("text")
      .attr("class", 'Participant_Rate')
      .attr("x", d => x(d.Region) + (x.bandwidth() / 2))
      .attr("y", d => y(d.Participant_Rate))
      .attr("dy", "-1em") 
     // .attr("text-anchor", 'middle')
      .text(d => d3.format(".0%")((d.Participant_Rate)/100)) 
}

// .attr("width", d => d.x)
//         .attr("height", d => d.y)
// .on("mouseover", (event, d)=>{
//     console.log(`d`, d)
//     state1.hover= {

//     position: [event.x, event.y],
//     Income_Group:  d.IncomeGroup,
//     visible: true,
// }
// draw1();
// }).on("mouseout", () => {
//   state1.hover.visible = false;
//   draw();
// }) ,
//       update => update,
//       exit => exit
//         .call(exit
//           .transition()
//           .duration(1000)
//           .attr("cy", height))
//           .remove()
      
// }
// //DRAW FUNCTION

// function draw1(){

//   d3.select("#barchart") // want to add
//     .selectAll('div.hover-content')
//     .data([state1.hover])
//     .join("div")
//     .attr("class", 'hover-content')
//     .classed("visible", d=> d.visible)
//     .style("position", 'absolute')
//     .style("transform", d=>{
//     if (d.position)
//     return`translate(${d.position[0]}px, ${d.position[1]}px)`})
    
//       .html(d=> {  
//         return `<div> In group name: ${d.Income_Group}</div>`
    

//   })
//   }

    

