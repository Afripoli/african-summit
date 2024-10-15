export function getSummitsforCountry(summitsByCountryMap, country) {
    console.log('JSON data in getsummit function', summitsByCountryMap)
    let summitsCountry;
    if (summitsByCountryMap.has(country)) {
        let summitDetails = summitsByCountryMap.get(country);
        summitsCountry = summitDetails;
    }
    return summitsCountry
}

export function displaySummitsCountry(country, summitsCountry) {
    console.log('summits country', summitsCountry);
    const summitListContainer = document.getElementById('summitList');
    console.log('Summit list container', summitListContainer);
    const hostCountry = document.getElementById('summitCountry');
    hostCountry.innerHTML = `Summits hosted by ${country}`
    summitListContainer.innerHTML = '';
    summitsCountry.forEach(summit => {
        console.log('Item summit', summit);
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Date:</strong> ${summit.date}<br>
            <strong>Place:</strong> ${summit.place}<br>
            <strong>Title:</strong> ${summit.title}<br>
            <strong>Summit No:</strong> ${summit.summitNo}<br><br>
        `;
        summitListContainer.appendChild(listItem);
    })
}