const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

let state = {
  // + SET UP STATE
  geojson: null,
  population: null,
  hover: {
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
     mapPosition: null, // will be array of [long, lat] once mouse is hovered on something
    SName : null,
    Stemp: null,
    visible: false,
  }
};
// Load external data and boot

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("./Data/world.json"),
  d3.csv("./Data/Population.csv", d3.autoType),
]).then(([geojson, population]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  state.population= population
  console.log("state: ", state);
  init();
});


function init() {


// Map and projection
projection = d3.geoEqualEarth()
    .fitSize([width, height], state.geojson)

    pathFunction = d3.geoPath()
                .projection(projection)

  const colorScale = d3.scaleLinear([0, d3.max(state.population)])


   svg = d3.select("#d3-container")
 .append("svg")
 .attr("width", width)
 .attr("height", height)
    // Draw the map
     svg.append("g")
        .selectAll("path")
        .data(state.geojson.features)
        .enter().append("path")
            //.attr("fill", "#69b3a2")
            .attr("d", pathFunction)
            .style("stroke", "#fff")
            .attr("class", "bubbles")

           

        svg.append("g")
        .selectAll("path")
        .data(state.geojson.features)
        .enter().append("path")
         .style("stroke", "#fff")
             .attr("d", pathFunction)
          .attr("fill", d=> {
        return colorScale(d.Population)})
        .attr("class", "bubbles")
}

  



