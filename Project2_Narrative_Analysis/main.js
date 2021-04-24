// Load external data and boot
d3.json("./Data/world.json", d3.autoType).then( data=>{
 console.log("data", data)

 // The svg
 //svg = d3.select("svg"),

  width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 50, left: 20, right: 40 }
  
 svg = d3.select("#d3-container")
 .append("svg")
 .attr("width", width)
 .attr("height", height)

 

// Map and projection
projection = d3.geoEqualEarth()
    .fitSize([width, height], data)

    pathFunction = d3.geoPath()
                .projection(projection)



    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", pathFunction)
            .style("stroke", "#fff")
})


