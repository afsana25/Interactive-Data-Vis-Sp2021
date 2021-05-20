
/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.9,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
* init() but need access to in draw().
* All these variables are empty before we assign something to them.*/
let svg;

/**
* APPLICATION STATE
* */
let state = {
 // + SET UP STATE
 geojson: null,
 WomenData: null,
 hover: {
   position: null, // will be array of [x,y] once mouse is hovered on something
  // will be array of [long, lat] once mouse is hovered on something
   visible: false,
 }
};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
 Promise.all([d3.json("./Data/world.json"),
d3.csv("./Data/Final_Data_Women.csv", d3.autoType),
]).then(([geojson, WomenData]) => {
 // + SET STATE WITH DATA
 state.geojson = geojson
 state.WomenData = WomenData
 console.log("state: ", state);
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
 const projection = d3.geoEqualEarth() //it will goes to long/lat => x/y
 .fitSize([width, height], state.geojson)


 //const colorScale = d3.scaleSequential(d3.interpolateReds)
 //.domain(d3.extent(state.WomenData, d=>d.Women_Violence))

  const z = d3.scaleSqrt()
   .domain(d3.extent(state.WomenData, d=>d.Women_Violence))
 //.range([margin.left, margin.right]);
 .range([0.01, 40])

 // const colorScale = d3.scaleOrdinal()
 // .domain(["Asia", "Europe", "North America", "South America", "Africa", "Australia and Ocenia"])
 // //.domain(Array.from(new Set(d3.map(state.WomenData, d=>d.Region))))
 // .range(d3.schemeSet2);

 const pathFunction = d3.geoPath(projection)

// create an svg element in our main 'd3-containe' element 
 svg = d3
   .select("#d3-container")
   .append("svg")
   .attr("width", width)
   .attr("height", height);


// base layer of states
//const states = 

svg.selectAll("path")
.data(state.geojson.features)
.join("path")
.attr("stroke", "black")
.attr("fill", "#FEFDEE")
.attr("d", pathFunction)


// cuny circle

const dot = svg.selectAll("circle")
.data(state.WomenData)
.join("circle")
 .attr("fill", "#C70039")
.attr("r", d=> z((d.Women_Violence)))
// d=>{
//   if (d.Women_Violence>70) return 40;
//   else if (d.Women_Violence>30 || d.Women_Violence<70) return 10;
//   else if (d.Women_Violence>0 || d.Women_Violence<30) return 3;
//   else return 1}
.attr("fill-opacity", "0.5")
.attr("transform", d=>{
 console.log(d)
 const point = projection([d.longitude, d.latitude])
 return `translate(${point[0]}, ${point[1]})`
} )
.attr("class", "bubbles")

dot.on("mouseover", function(event, d){
 const {clientX, clientY} = event

 const [long, lat] = projection.invert([clientX, clientY])
console.log('d',d)
 state.hover= {

 
   position: [event.x, event.y],
   Name: d.Entity,
   WomenViolence: d.Women_Violence,
   LiteracyRate: d.LiteracyRate_Adult_Femlale15_Over,
   WomenEmployment: d.Female_Participant_Rate19,
   Income: d.IncomeGroup,
   screenPosition: [clientX, clientY],
   mapPosition: [long, lat],
   visible: true,
 }
 draw();

}).on("mouseout", () => {
 state.hover.visible = false
 draw(); // calls the draw function
})


draw();
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {

d3.select("#d3-container") // want to add
   .selectAll('div.hover-content')
   .data([state.hover])
   .join("div")
   .attr("class", 'hover-content')
   .classed("visible", d=> d.visible)
   .style("position", 'absolute')
   .attr("fill", "#FEFDEE")
   .style("transform", d=> {
     // only move if we have a value for screenPosition
     if (d.screenPosition)
     return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1]}px)`
   })
   .html(d=> {
     return `<div> Location: [${(d3.format(".2f")(d.mapPosition[0]))}, ${(d3.format(".2f")(d.mapPosition[1]))}]</div>
     <div> Country name: ${d.Name}</div>
     <div> Income group: ${d.Income}</div>
     <div> The precentage of women face violence: ${(d3.format(".0%")(d.WomenViolence/100))}<div>
     <div> Average women literacy rate: ${(d3.format(".0%")(d.LiteracyRate/100))}</div>
<div> Average employment rate of Women: ${(d3.format(".0%"))(d.WomenEmployment/100)}<div>
     
     `
   }
     )
}

