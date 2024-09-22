
export function drawTimeline(summitData) {
    return d3.select("#timeline")
        .append("ul")
        .selectAll("li")
        .data(summitData)
        .enter()
        .append("li")
        .text(d => d.year)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
            const countries = d.summits.map(summit => summit.country);
            updateMap(geojsonData, countries); // geojsonData is the GeoJSON data loaded earlier
        })
}