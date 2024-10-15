export async function loadAndMergeData(geojsonUrl, jsonFilePath) {
    try {
        const geojsonResponse = await fetch(geojsonUrl);
        const geojsonData = await geojsonResponse.json();

        const jsonResponse = await fetch(jsonFilePath);
        const jsonData = await jsonResponse.json();

        const summitMap = new Map();
        const countriesWithSummits = new Set();
        const summitCounter = new Map();
        const summitsByCountryMap = new Map();

        jsonData.forEach(entry => {
            const { year, summits } = entry;
            if (!summitMap[year]) {
                summitMap[year] = [];
            }
            summits.forEach(summit => {
                summitMap[year].push(summit.country);
                countriesWithSummits.add(summit.country);
            });
        });

        jsonData.forEach(yearData => {
            yearData.summits.forEach(summit => {
                countriesWithSummits.add(summit.country);
                console.log('countries with summits', countriesWithSummits)
            });
        });

        jsonData.forEach(yearData => {
            yearData.summits.forEach(summit => {
                const country = summit.country;
                const summitDetails = {
                    date: summit.date,
                    place: summit.place,
                    summitNo: summit.summitNo,
                    title: summit.title
                };
                // If the country is already in the map, append the summit to its list
                if (!summitsByCountryMap.has(country)) {
                    summitsByCountryMap.set(country, [summitDetails]);
                } else {
                    summitsByCountryMap.get(country).push(summitDetails);
                }
            });
        });

        countriesWithSummits.forEach(country => {
            console.log('Country in countrieswithsummits', countriesWithSummits)
            summitCounter[country] = (summitCounter[country] || 0) + 1;
        });

        geojsonData.features.forEach(feature => {
            const countryName = feature.properties.name;
            if (summitMap.has(countryName)) {
                feature.properties.summit = summitMap.get(countryName);
            }
        });
        return {
            geojsonData,
            jsonData,
            summitMap,
            countriesWithSummits,
            summitsByCountryMap
        };
    } catch (error) {
        console.error("Error loading or merging data:", error);
        return null;
    }
}

