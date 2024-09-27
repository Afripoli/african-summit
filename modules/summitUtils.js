function getSummitsforCountry(summitMap, country) {
    let summitsCountry = [];
    for (let year in summitMap) {
        summitMap[year].forEach(summit => {
            if (summitMap.country == country) {
                summitsCountry.push({ year, ...summit })
            }
        })
    }
    return summitsCountry
}

export function displaySummitsCountry(summitsCountry) {
    const summitListContainer = document.getElementById('summitList');
    summitListContainer.innerHTML = '';
    summitsCountry.forEach(summit => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Year:</strong> ${summit.year}<br>
            <strong>Place:</strong> ${summit.place}<br>
            <strong>Title:</strong> ${summit.title}<br>
            <strong>Summit No:</strong> ${summit.summitNo}<br><br>
        `;
        summitListContainer.appendChild(listItem);
    })
}