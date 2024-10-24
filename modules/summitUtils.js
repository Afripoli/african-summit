import { flagSrc } from './globals.js';

export function getSummitsforCountry(summitsByCountryMap, country) {
    console.log('JSON data in getsummit function', summitsByCountryMap)
    let summitsCountry;
    if (summitsByCountryMap.has(country)) {
        let summitDetails = summitsByCountryMap.get(country);
        summitsCountry = summitDetails;
    }
    return summitsCountry;
}

export function displaySummitsCountry(country, summitsCountry) {
    const filterFlag = flagSrc.filter(item => item.country === country);
    const flagCountry = filterFlag[0].img["img-src"];
    console.log('summits country reversed', summitsCountry.reverse);
    console.log('Number of summits', summitsCountry.length)
    const noSummits = summitsCountry.length;
    const summitListContainer = document.getElementById('summitList');
    console.log('Summit list container', summitListContainer);
    const hostCountry = document.getElementById('summitCountry');
    country = country.toUpperCase();
    hostCountry.innerHTML = `<img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag" alt="Pause button"> ${country}`;
    const totalSummits = document.getElementById('total-summit');
    totalSummits.innerHTML = `Total summits hosted: <b>${noSummits}</b>`
    const listSummit = document.getElementById('intro-list-summit');
    listSummit.innerHTML = 'List of summits';
    const listOrder = document.getElementById('list-order');
    listOrder.innerHTML = '(from most to least recent)'
    summitListContainer.innerHTML = '';
    summitListContainer.append
    summitsCountry.reverse().forEach(summit => {
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