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
    hostCountry.innerHTML = `<img src="/src/img/country-flags-main/png100px/${flagCountry}" class="img-fluid country-flag" alt="Flag"> ${country}`;
    const totalSummits = document.getElementById('total-summit');
    totalSummits.innerHTML = `Total summits hosted: ${noSummits}`
    totalSummits.classList.add('fw-bolder')
    const listSummit = document.getElementById('intro-list-summit');
    listSummit.innerHTML = 'List of summits';
    listSummit.classList.add('fw-bolder', 'mb-0')
    const listOrder = document.getElementById('list-order');
    listOrder.innerHTML = '(from most to least recent)'
    summitListContainer.innerHTML = '';
    summitListContainer.append
    summitsCountry.reverse().forEach(summit => {
        const listItem = document.createElement('li');
        let titleContent = summit.title ? `${summit.title}` : `${summit.summitNo} Summit <sup>*</sup> <spr>`;
        let dateContent = summit.date ? `<strong class="mb-0"><img src="src/img/calendar.svg" class="img-fluid calendar"> </strong> ${summit.date}<br>` : '';
        let placeContent = summit.place ? `<strong class="mb-0"><img src="src/img/map-pin.svg" class="img-fluid location"> </strong> ${summit.place}<br>` : '';
        listItem.innerHTML = `
            <h5 class="mb-0 mt-4 fw-normal"><span class="badge bg-dark">${summit.summitNo}</span>  ${titleContent}</h5>
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