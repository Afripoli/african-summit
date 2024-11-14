// Databases
const jsonPath = './db/summits-by-year.json';
const geojsonUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// Map
const width = 500;
const height = 350;
const scale = width / 2 / Math.PI;
const center = [0, 0];
const translation = [width / 2, height / 2];
let hostCountry = [];
const maxYearsToShow = 4;

// mobile
let mapMobileHeight = document.getElementById('map-mobile').clientHeight;
let mapMobileWidth = document.getElementById('map-mobile').clientWidth;

const mapStyle = {
    "defaultFill": "#e6e6e6",
    "defaultBorder": "#cccccc",
    "defaultBorderWidth": 0.15,
    "borderHost": "#000000",
    "fillHost": "#ffbf3b",
    "borderWidthHost": 1,
    "clickedYearCountry": "#d87b00",
    "fontSize": "14px",
    "fontWeight": "450",
    "textAnchor": "middle",
    "alignmentBaseline": "middle"
};

const countryOffsets = {
    Italy: { x: -5, y: 15 }, 
    "South Korea": { x: -10, y: 20 }, 
    USA: { x: 20, y: 20 }, 
    China: { x: -10, y: 0 }, 
    France: { x: -20, y: 0 },
    "Saudi Arabia": { x: -20, y: 0 }, 
    India: { x: 0, y: 0 }, 
    Japan: { x: 0, y: 0 }, 
};
// Timeline 
const timelineStyle = {
    "defaultItem": "#000000",
    "highlightItem": "#ffbf3b",
    "borderItem": "#000000",
    "borderWidthItem": 2,
    "clickedYearCountry": "#d87b00",
    "fontItem": "18px",
    "fontWeight": "normal",
    "fontWeightHighlight": "bold"
}

// Country flags
const flagSrc = [
    {
        country: "France",
        img: {
            "img-src": "fr.png"
        }
    },
    {
        country: "Japan",
        img: {
            "img-src": "jp.png"
        }
    },
    {
        country: "Indonesia",
        img: {
            "img-src": "id.png"
        }
    },
    {
        country: "Russia",
        img: {
            "img-src": "ru.png"
        }
    },
    {
        country: "South Korea",
        img: {
            "img-src": "kp.png"
        }
    },
    {
        country: "Italy",
        img: {
            "img-src": "it.png"
        }
    },
    {
        country: "Saudi Arabia",
        img: {
            "img-src": "sa.png"
        }
    },
    {
        country: "USA",
        img: {
            "img-src": "us.png"
        }
    },
    {
        country: "Turkey",
        img: {
            "img-src": "tr.png"
        }
    },
    {
        country: "India",
        img: {
            "img-src": "in.png"
        }
    },
    {
        country: "United Kingdom",
        img: {
            "img-src": "gb-nir.png"
        }
    },
    {
        country: "China",
        img: {
            "img-src": "cn.png"
        }
    }

]


let svg = d3.select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

export { jsonPath, geojsonUrl, width, height, svg, scale, center, translation, maxYearsToShow, hostCountry, flagSrc, mapStyle, timelineStyle, countryOffsets, mapMobileHeight, mapMobileWidth }