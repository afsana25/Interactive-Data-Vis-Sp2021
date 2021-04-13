// set the dimensions and margins of the graph
const width = window.innerWidth*0.7,
  height = window.innerHeight*0.7,
  margin = { top: 20, bottom: 55, left: 100, right: 40 };

  //let tooltip;

  //APPLICATION STATE

  let state = {

    hover: {
      position: null,
        Country_Name: null,
   Population_Count: null,
    Fertily_Rate: null,
     Per_Capita : null,
    visible: false,
    }
  }

//Read the data
d3.csv("./Data/Data_Final.csv", d3.autoType).then(data => 
    {
      state.data = data
   console.log("state", data);

   init();
    }
)
function init(){
  // Add X axis
  const xScale = d3.scaleLinear()
  //.domain([0, 20000])
  .domain(d3.extent(state.data, d=>d.Per_Capita19))
    //.range([margin.left, width-margin.right]);
    .range([0, width])

  // Add Y axis
  const yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d=>d.Fertility_rate19))
    .range([ height-margin.bottom, 0]);

//+ AXES
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
  // Add a scale for bubble size
 const z = d3.scaleLinear()
    .domain(d3.extent(state.data, d=>d.Population19))
  //.range([margin.left, margin.right]);
  .range([4, 90])

  const colorScale = d3.scaleOrdinal()
  //.domain(["Asia", "Europe", "North America", "South America", "Africa", "Australia and Ocenia"])
  .domain(Array.from(new Set(d3.map(state.data, d=>d.continent))))
  .range(d3.schemeSet2);

// Create SVG
  const container = d3.select("#d3-container").style("position", "relative")
const svg = container
  .append("svg")
    .attr("width", width+margin.right+margin.left)
    .attr("height", height+margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("text-anchor", "middle")

  svg.append("g")
    .attr("transform", `translate(${0}, ${innerHeight})`)
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height-margin.bottom})`) //translate(x,y)
    .call(xAxis)
    .append("text")
    .text("Per Capita Income in 2019")
    .attr("transform", `translate(${width/2}, ${50})`)

  svg.append("g")
  .call(yAxis)
   .attr("class", "yAxis") 
  .attr("transform", `translate(${0},${height/10-margin.bottom})`)//translate(x,y)
   .append("text")
   .attr("class", "axis-label")
   .attr("y", -60)
   .attr("x", -height/2)
   .attr("transform", `rotate(-90)`)
   .attr("text-anchor", "middle")
   .text("Fertility Rate of 2019")
  

  svg.append("g")
  .attr("class", "yaxis")
  //.call(yAxis)
  .append("text")
  .text("Fertilty rate Per Women vs Per capita Income in terms of population in Country")
  .attr("transform", `translate(${width/2}, ${0.2})`)
  .style("font-size:", "10px")




  // Add circle
 svg.append("g")
    .selectAll("circle")
    .data(state.data)
    //.attr("transform", d => `translate(${d.x},${d.y})`)
    .join(enter=>enter.append("circle")
    .attr("cx", width- margin.right)
    )
    .attr("class", "bubbles")
      .attr("cx", d=> xScale(d.Per_Capita19))
      .call(enter=> enter.transition()
  .duration(4000)
      .attr("cy", d=> yScale(d.Fertility_rate19))
      //.attr("r", 2)
      .attr("r", d=> z((d.Population19)*0.4)))
      .style("fill", d=>colorScale(d.continent))
       .attr("width", d => d.x)
        .attr("height", d => d.y)

      .style("opacity", "1")
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .call(d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([[0, 0], [width, height]]))
  .on("mouseover", (event, d)=>{
    console.log(`d`, d)
    state.hover= {

    position: [event.x, event.y],
    Country_Name:  d.Entity,
    Population_Count: d.Population19,
    Fertily_Rate: d.Fertility_rate19,
     Per_Capita : d.Per_Capita19,
    visible: true,
}
draw();
}).on("mouseout", () => {
  state.hover.visible = false;
  draw();
}) ,
      update => update,
      exit => exit
        .call(exit
          .transition()
          .duration(1000)
          .attr("cy", height))
          .remove()
      

//// legend

   

    // Add one dot in the legend for each name.
    const allgroups = Array.from(new Set(d3.map(state.data, d=>d.continent)))
    svg.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", innerWidth*0.6)
        .attr("cy", (d,i) =>innerHeight*0.2- i*15) // This is place where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", d => colorScale(d))

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", innerWidth*0.67)
        .attr("y", (d,i) => innerHeight*0.2- i*15) // This is place  where the first dot appears. 25 is the distance between dots
        .style("fill", (d) => colorScale(d))
        .text(d => d)

}
//DRAW FUNCTION

function draw(){

  d3.select("#d3-container") // want to add
    .selectAll('div.hover-content')
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-content')
    .classed("visible", d=> d.visible)
    .style("position", 'absolute')
    .style("transform", d=>{
    if (d.position)
    return`translate(${d.position[0]}px, ${d.position[1]}px)`})
    
      .html(d=> {  
        return `<div> Country name: ${d.Country_Name}</div>
      <div> Population in 2019: ${d.Population_Count}<div>
      <div> Firtilty Rate in 2019: ${d3.format(".2f")(d.Fertily_Rate)}</div>
      <div> Per Capita in 2019: ${d3.format(".2f")(d.Per_Capita) }<div>`
    

  })
  }
  

     
    

