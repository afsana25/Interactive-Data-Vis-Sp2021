const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
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
  population: null,
  hover: {
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
     mapPosition: null, // will be array of [long, lat] once mouse is hovered on something
    SName : null,
    Stemp: null,
    visible: false,
  }
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("./Data/countries-50m.json"),
  d3.csv("./Data/population.csv", d3.autoType),
]).then(([geojson, Population]) => {
  // + SET STATE WITH DATA
  state.geojson = geojson
  state.Population = Population
  console.log("state: ", state);
  init();
});

function init(){

}
