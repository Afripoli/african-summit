import { flagSrc } from '../common/globals.js';

export function getSummitsforCountry(summitsByCountryMap, country) {
    console.log('Country in getsummit function', country)
    console.log('JSON data in getsummit function', summitsByCountryMap)
    let summitsCountry;
    if (summitsByCountryMap.has(country)) {
        let summitDetails = summitsByCountryMap.get(country);
        summitsCountry = summitDetails;
    }
    return summitsCountry;
}

export function displaySummitsCountry(country, summitsCountry) {
    if (country === "England") {
        country = "United Kingdom";
    }
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

    // Create a copy of summitsCountry and reverse the copy
    const reversedSummitsCountry = summitsCountry.slice().reverse();
    reversedSummitsCountry.forEach(summit => {
        const listItem = document.createElement('li');
        let titleContent = summit.title ? `${summit.title}` : `${summit.summitNo} Summit`;
        let dateContent = summit.date ? `<p class="same-font-color mb-0"><img src="src/img/calendar.svg" class="img-fluid calendar"> ${summit.date}</p>` : '';
        let placeContent = summit.place ? `<p class="same-font-color"><img src="src/img/map-pin.svg" class="img-fluid location"> ${summit.place}</p>` : '';
        listItem.innerHTML = `
            <p class="mb-0 mt-4 same-font-size same-font-color"><span class="badge bg-dark summitNospan">${summit.summitNo}</span>  ${titleContent}</p>
            ${dateContent}
            ${placeContent}
        `;
        summitListContainer.appendChild(listItem);
    })
}

export function displaySummitsYear(yearData) {
    console.log('flag', flagSrc);
    console.log('Year data in displaySummitYear', yearData);
    const hostYear = document.getElementById('summitCountry');
    hostYear.innerHTML = `Summits hosted in ${yearData.year}`;
    hostYear.classList.add('h4', 'fw-bold');

    const separatorContainer = document.querySelector('.apri-separator-vis');
    if (separatorContainer) {
        // Clear existing line
        console.log('Separator container', separatorContainer);
        separatorContainer.remove()
    }

    // Create and insert the separator element for mobile devices
    const separator = document.createElement('div');
    separator.className = 'apri-separator-vis d-md-none mb-2';
    hostYear.insertAdjacentElement('afterend', separator);

    const summitListContainer = document.getElementById('summitList');
    summitListContainer.innerHTML = '';

    yearData.summits.forEach(summit => {
        console.log('Summit in displaySummitYear', summit);
        let country = summit.country;
        let filterFlag = flagSrc.filter(item => item.country === country);
        let flagCountry = filterFlag[0].img["img-src"];

        const listItem = document.createElement('li');
        let countryListed = country ? `
        <div class="d-flex justify-content-start align-items-center mt-4 mb-2">
            <img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag border-dark rounded me-2 pe-sm-5" alt="Flag">
            <p class="h5 mb-0">${country}</p>
        </div>` : '';
    let titleContent = summit.title ? `${summit.title}` : `${summit.summitNo} Summit`;
    let dateContent = summit.date ? `
        <div class="d-flex justify-content-start align-items-center mb-0">
            <img src="/src/img/calendar.svg" class="img-fluid calendar me-3 pe-sm-3">
            <p class="mobile-font-size mb-0">${summit.date}</p>
        </div>` : '';
    let placeContent = summit.place ? `
        <div class="d-flex justify-content-start align-items-center mb-0">
            <img src="/src/img/map-pin.svg" class="img-fluid location me-3 pe-sm-5">
            <p class="mobile-font-size mb-0">${summit.place}</p>
        </div>` : '';
    listItem.innerHTML = `
        ${countryListed} 
        <div class="d-flex justify-content-start align-items-start mb-0">
            <span class="badge badge-mobile bg-dark me-2 pe-sm-5 mobile-font-size badge-normal">${summit.summitNo}</span>
            <p class="mb-0 mobile-font-size summit-title">${titleContent}</p>
        </div>
        ${dateContent}
        ${placeContent}
    `;
        summitListContainer.appendChild(listItem);
    })
}