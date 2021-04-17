



// Parse the Data
d3.csv("./Data/Final_Statistics2.csv", d3.autoType).then (data => {


  const width = window.innerWidth*0.7 ; //  80 percent of width of the window
const height = window.innerHeight*0.7 ; // 70 percent of the height of the window

const margin = {top: 20, right:30, bottom: 10., left: 100 };
const innerWidth = width-margin.left-margin.right;
const innerHeight = height-margin.top-margin.bottom;


  const Category = data.columns[0] // IncomeGroup 
  const Indicators = data.columns.slice(1) // 
console.log("Indicators", Indicators)
  //const groups = d3.map(data, d=>(d.IncomeGroup))
  console.log("Category", Category)


  /* Sort The data via Average_Female_Population */

   data.sort(function(b, a){  
      return a.Average_Female_Population -b.Average_Female_Population
    })


    x0 = d3.scaleBand()
    .domain(data.map(d => d[Category]))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1)

  // // Add X axis
  const x = d3.scaleBand()
      .domain(Indicators)
      .range([0, x0.bandwidth()])
      .padding([0.2])

      console.log("x", x.domain())


     // // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(Indicators, Indicators => d[Indicators]))]).nice()
    .rangeRound([innerHeight, margin.top ]);
    
     console.log("x", y.domain())

     const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))


const xAxis = g => g
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x0))
  


  
const colorScale = d3.scaleOrdinal()
  .domain(Indicators)
  .range(["#80ced6", "#ffef96"]);


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
      .attr("transform", d => `translate(${x0(d[Category])},0)`)
      .selectAll("rect")
    .data(d => Indicators.map(key=> ({key:key, value:d[key]})))
    .enter().append("rect")
    .transition()
    .duration(8000)
      .attr("x", d => x(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight- y(d.value))
      .attr("fill", d => colorScale(d.key))
      .attr("class", "bubbles")


/** Add lengend and Color **/

const Groupname = ["Average Female Population", "Average Male Population" ]

console.log("Groupname", Groupname)

const legend  = svg.selectAll(".LegendItem")
.data(Groupname).join("g")
.attr("class", "LegendItem" )
 .style("fill", d=> colorScale(d))
.attr("transform", `translate(${0},${innerHeight*0.05})`)

 legend.append("circle")
    .attr("cx", innerWidth*0.68)
    .attr("cy", (d,i) =>innerHeight*0.008+i*25)
    .attr("r", 7)


  

// // Add one dot in the legend for each grroup name.
legend.append("text")
    .attr("x",innerWidth*0.7)
    .attr("y", (d, i)=> innerHeight*0.07 - i*25) //  where the first dot appears. 25 is the distance between dots
    .text(d=> d)


    // Add text

    // svg.append("g")
    // .selectAll("g")
    // .data(data)
    // .enter()
    // .append("g")
    //   .attr("transform", d => `translate(${x0(d[Category])},0)`)
    // .data(d => Indicators.map(key=> ({key:key, value:d[key]})))
    // .enter()
    //   .attr("x", d => x(d.key))
    //   .attr("y", d => y(d.value))
    //   .attr("width", x.bandwidth())
    //   .attr("height", d => innerHeight- y(d.value))
      //  .attr("dy", "-1em") 
      // .text(d => d3.format(".0%")((d.value)/100)) 




})
