let currentClickedIndex = null;

export function resetHighlights() {
    if (currentClickedIndex !== null) {
        circleGroup
            .filter((_, index) => index === currentClickedIndex)
            .attr("fill", "gray")
            .attr("r", 5);
    }
    yearTextGroup
        .filter((_, index) => index === currentlyHighlightedIndex)
        .style("fill", "gray");

    countryTextGroup
        .filter((_, index) => index === currentlyHighlightedIndex)
        .style("fill", "gray");
}

export function highlightYear(year) {
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
        const hostCountries = yearData.summits.length > 0
            ? yearData.summits.map(summit => summit.country)
            : [];
        // Highlight the countries on the map
        borderHostCountry(svg, hostCountries);

        // Highlight corresponding country text
        countryTextGroup
            .filter((d, index) => index === yearIndex)
            .style("fill", "black");

        // Update currently highlighted index
        currentlyHighlightedIndex = yearIndex;
    }
}