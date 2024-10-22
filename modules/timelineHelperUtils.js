import { borderHostCountry } from "./mapUtils.js";

export function resetHighlights(currentClickedIndex, circleGroup, yearTextGroup, countryTextGroup) {
    if (currentClickedIndex !== null) {
        circleGroup
            .filter((_, index) => index === currentClickedIndex)
            .attr("fill", "gray")
            .attr("r", 5);
    }
    yearTextGroup
        .filter((_, index) => index === currentClickedIndex)
        .style("fill", "gray");

    countryTextGroup
        .filter((_, index) => index === currentClickedIndex)
        .style("fill", "gray");
}

export function highlightYear(displayedYears, year, circleGroup, yearTextGroup, summitData, svg, hostCountries) {
    const yearIndex = displayedYears.findIndex(d => d.year === year);
    if (yearIndex >= 0) {
        circleGroup
            .filter((_, index) => index === yearIndex)
            .attr("fill", "black")
            .attr("r", 10);
        yearTextGroup
            .filter((_, index) => index === yearIndex)
            .style("fill", "black");

        const yearData = summitData.find(summit => summit.year === year);
        console.log('Year data'. yearData)
        const hostCountries = yearData.summits.length > 0
            ? yearData.summits.map(summit => summit.country)
            : [];
        // Highlight the countries on the map
        borderHostCountry(svg, hostCountries);
        countryTextGroup
            .filter((d, index) => index === yearIndex)
            .style("fill", "black");

            currentClickedIndex = yearIndex;
    }
}