export async function loadAndMergeData(geojsonUrl, jsonFilePath) {
    try {
        // Load GeoJSON from the provided URL
        const geojsonResponse = await fetch(geojsonUrl);
        const geojsonData = await geojsonResponse.json();

        // Load the local JSON file
        const jsonResponse = await fetch(jsonFilePath);
        const jsonData = await jsonResponse.json();

        // Create a Map to hold the partnership data by country
        const summitMap = new Map();

        console.log('JSON', jsonData)
        // Map each bilateral partnership in a object
        jsonData.forEach(entry => {
            const { year, summits } = entry;
    
            // Initialize an array for the year if it doesn't exist
            if (!summitMap[year]) {
                summitMap[year] = [];
            }
    
            // Add each country from the summits to the year array
            summits.forEach(summit => {
                summitMap[year].push(summit.country);
            });
        });
        console.log('summit map', summitMap)
        geojsonData.features.forEach(feature => {
            const countryName = feature.properties.name;
            if (summitMap.has(countryName)) {
                feature.properties.summit = summitMap.get(countryName);
            }
        });
        return { geojsonData, jsonData, summitMap };
    } catch (error) {
        console.error("Error loading or merging data:", error);
        return null;
    }
}
