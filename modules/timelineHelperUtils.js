import { maxYearsToShow } from "./globals.js";

export function appendArrows(summitData, currentYearIndex) {
    const upArrowDiv = document.createElement("div");
        upArrowDiv.classList.add("arrow-container", "up-arrow");
        upArrowDiv.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.getElementById("desktop-timeline").appendChild(upArrowDiv);

        // Append the Down Arrow (Bottom)
        const downArrowDiv = document.createElement("div");
        downArrowDiv.classList.add("arrow-container", "down-arrow");
        downArrowDiv.innerHTML = '<i class="fas fa-chevron-down"></i>';
        document.getElementById("desktop-timeline").appendChild(downArrowDiv);

        // Add click event listeners to the arrows
        upArrowDiv.addEventListener("click", () => updateTimeline(-1, summitData, currentYearIndex));  // Move up
        downArrowDiv.addEventListener("click", () => updateTimeline(1, summitData, currentYearIndex)); 
}

function updateTimeline(direction, summitData, currentYearIndex) {
    console.log('Direction', direction, 'Summit Data', summitData)
    // Update the current index based on direction
    currentYearIndex = Math.max(0, Math.min(summitData.length - maxYearsToShow, currentYearIndex + direction * maxYearsToShow));
    // Redraw the timeline with the updated index
    drawTimeline();
}


