// Databases
const jsonPath = './db/summits-by-year.json';
const geojsonUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// Map
const width = 600;
const height = 400;
const scale = 50;
const center = [0, 0];
const translation = [width / 2, height / 2];
let hostCountry = [];
const maxYearsToShow = 5;


let svg = d3.select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

export { jsonPath, geojsonUrl, width, height, svg, scale, center, translation, maxYearsToShow, hostCountry }