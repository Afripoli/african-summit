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
    country = country;
    hostCountry.innerHTML = `<img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag border border-dark border-1 rounded me-2" alt="Flag"> ${country}`;
    const totalSummits = document.getElementById('total-summit');
    totalSummits.innerHTML = `Total summits hosted: ${noSummits}`
    totalSummits.classList.add('fw-bolder')
    const listSummit = document.getElementById('intro-list-summit');
    listSummit.innerHTML = 'List of summits:';
    listSummit.classList.add('fw-bolder', 'mb-0')
    const listOrder = document.getElementById('list-order');
    listOrder.innerHTML = `<i>(from most to least recent)</i>`
    summitListContainer.innerHTML = '';
    summitListContainer.append
    summitsCountry.reverse().forEach(summit => {
        const listItem = document.createElement('li');
        let titleContent = summit.title ? `${summit.title}` : `${summit.summitNo} Summit <sup>*</sup> <spr>`;
        let dateContent = summit.date ? `<p class="same-font-color mb-0"><img src="src/img/calendar.svg" class="img-fluid calendar"> ${summit.date}</p>` : '';
        let placeContent = summit.place ? `<p class="same-font-color"><img src="src/img/map-pin.svg" class="img-fluid location"> ${summit.place}</p>` : '';
        listItem.innerHTML = `
            <p class="mb-0 mt-4 same-font-size same-font-color"><span class="badge bg-dark summitNospan">${summit.summitNo}</span>  ${titleContent}</p>
            ${dateContent}
            ${placeContent}
        `;
        summitListContainer.appendChild(listItem);
        // Add a footnote if title is empty and it's not already added
        if (!summit.title) {
            const footnote = document.createElement('p');
            footnote.innerHTML = `<sup>*</sup> Summit number only, no title found.`;
            footnote.classList.add('fs-6', 'mt-3');  // Optionally, add a class for styling
            summitListContainer.appendChild(footnote);
        }
    })
}

export function displaySummitsYear(yearData) {
    console.log('Year data in displaySummitYear', yearData);
    const hostYear = document.getElementById('summitCountry');
    hostYear.innerHTML = `Summits hosted in ${yearData.year}`;

    const summitListContainer = document.getElementById('summitList');
    summitListContainer.innerHTML = '';

    yearData.summits.forEach(summit => {
        console.log('Summit in displaySummitYear', summit);
        let country = summit.country;
        let filterFlag = flagSrc.filter(item => item.country === country);
        let flagCountry = filterFlag[0].img["img-src"];

        const listItem = document.createElement('li');
        let countryListed = country ? `<p class="same-font-color mt-4 mb-0"><img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag border border-dark border-1 rounded me-2" alt="Flag"> ${country}</p>`: '';
        let titleContent = summit.title ? `${summit.title}` : `${summit.summitNo} Summit`;
        let dateContent = summit.date ? `<p class="same-font-color mb-0"><img src="src/img/calendar.svg" class="img-fluid calendar"> ${summit.date}</p>` : '';
        let placeContent = summit.place ? `<p class="same-font-color mb-0"><img src="src/img/map-pin.svg" class="img-fluid location"> ${summit.place}</p>` : '';
        listItem.innerHTML = `
            ${countryListed} 
            <p class="mb-0 same-font-size same-font-color"><span class="badge bg-dark summitNospan">${summit.summitNo}</span>  ${titleContent}</p>
            ${dateContent}
            ${placeContent}
        `;
        summitListContainer.appendChild(listItem);
    })
}