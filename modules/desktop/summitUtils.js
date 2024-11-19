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
    const noSummits = summitsCountry.length;
    const summitListContainer = document.getElementById('summitList');
    console.log('Summit list container', summitListContainer);
    const hostCountry = document.getElementById('summitCountry');
    hostCountry.classList.add('h4', 'fw-bold');
    country = country;
    hostCountry.innerHTML = `<img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag border border-dark border-1 rounded me-2 d-inline" alt="Flag"> ${country}`;
    
    // Create and insert the separator element for mobile devices
    const separatorContainer = document.querySelector('.apri-separator-vis');
    if (separatorContainer) {
        separatorContainer.remove();
    }
    const separator = document.createElement('div');
    separator.className = 'apri-separator-vis d-md-none mb-2';
    hostCountry.insertAdjacentElement('afterend', separator);
    
    const totalSummits = document.getElementById('total-summit');
    totalSummits.innerHTML = `${noSummits} summit(s) hosted:`;
    totalSummits.classList.add('fw-bolder', 'h5');
    const listOrder = document.getElementById('list-order');
    listOrder.innerHTML = `<i>(from most to least recent)</i>`;
    listOrder.classList.add('mobile-font-size');
    summitListContainer.innerHTML = '';

    // Create a copy of summitsCountry and reverse the copy
    const reversedSummitsCountry = summitsCountry.slice().reverse();
    reversedSummitsCountry.forEach(summit => {
        const listItem = document.createElement('li');
    
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

export function displaySummitsYear(yearData) {
    console.log('flag', flagSrc);
    console.log('Year data in displaySummitYear', yearData);

    // Empty content that will not be used in this container 
    const totalSummits = document.getElementById('total-summit');
    totalSummits.innerHTML = '';
    const listOrder = document.getElementById('list-order');
    listOrder.innerHTML = '';
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
            <img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag border-dark rounded me-2 pe-lg-2 pe-xl-2" alt="Flag">
            <p class="mb-0 fw-bold">${country}</p>
        </div>` : '';
    let titleContent = summit.title ? `${summit.title}` : `${summit.summitNo} Summit`;
    let dateContent = summit.date ? `
        <div class="d-flex justify-content-start align-items-center mb-0">
            <img src="/src/img/calendar.svg" class="img-fluid calendar me-3 pe-sm-3 pe-lg-2 pe-xl-2">
            <p class="mobile-font-size mb-0">${summit.date}</p>
        </div>` : '';
    let placeContent = summit.place ? `
        <div class="d-flex justify-content-start align-items-center mb-0">
            <img src="/src/img/map-pin.svg" class="img-fluid location me-3 pe-sm-5 pe-lg-2 pe-xl-2">
            <p class="mobile-font-size mb-0">${summit.place}</p>
        </div>` : '';
    listItem.innerHTML = `
        ${countryListed} 
        <div class="d-flex justify-content-start align-items-start mb-0">
            <span class="badge badge-mobile bg-dark me-2 pe-sm-5 pe-lg-2 pe-xl-2 mobile-font-size badge-normal">${summit.summitNo}</span>
            <p class="mb-0 mobile-font-size summit-title">${titleContent}</p>
        </div>
        ${dateContent}
        ${placeContent}
    `;
        summitListContainer.appendChild(listItem);
    })
}