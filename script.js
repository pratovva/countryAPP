const RouteList = [
    {
        title: 'All Countries',
        route: 'all'
    },
    {
        title: 'Africa',
        route: 'africa'
    },
    {
        title: 'America',
        route: 'america'
    },
    {
        title: 'Asia',
        route: 'asia'
    },
    {
        title: 'Europe',
        route: 'europe'
    },
    {
        title: 'Oceania',
        route: 'oceania'
    }
]

const endPointList = {
    all: 'all',
    region: 'region',
    name: 'name'
}

const $navbarList = document.querySelector('.navbarList')
const $container = document.querySelector('.container')
const $loader = document.querySelector('.loader')
const $select = document.querySelector('.select')
const $search = document.querySelector('.search')
const BASE_URL = 'https://restcountries.com/v3.1'


function getBase(endPoint, cb) {
    fetch(`${BASE_URL}/${endPoint}`)
        .then(res => res.json())
        .then(r => cb(r))

}


window.addEventListener('load', () => {
    $loader.innerHTML = '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'

    const links = RouteList.map(({ title, route }) => {
        return RouteTemplate(title, route)
    }).join('')

    $navbarList.innerHTML = links
})


getBase(endPointList.all, res => {
    template(res)
})

function RouteTemplate(title, route) {
    return `
        <li class="nav-item">
            <a onclick="getRoute('${route}')" class="nav-link btn">${title}</a>
        </li>
    `
}

function getRoute(route) {


    if (route === 'all') {
        getBase(`${endPointList.all}`, res => {
            template(res)
        })
    } else {
        getBase(`${endPointList.region}/${route}`, res => {
            template(res)
        })
    }

}


function template(base) {

    const template = base.map(item => {
        return card(item)
    }).join('')

    $container.innerHTML = template
}


function card(country) {

    return `
        <div class="country-card">
            <div class="card">
                <div class="card-header">
                    <i>${country.name.common}</i>
                </div>
                <div class="card-image">
                    <div>
                    <img src="${country.flags.svg}">
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btnMore" onclick="singleTemplate('name/${country.name.common}')">More</button>
                </div>
            </div>
        </div> 
    `
}



$select.addEventListener('change', e => {
    var value = e.target.value

    if (value === 'capital') {
        $search.setAttribute('placeholder', 'Search by capital')
    } else if (value === 'name') {
        $search.setAttribute('placeholder', 'Search by name')
    }
})

$search.addEventListener('click', e => {
    var value = e.target.value
    var selected = $select.value

    if (selected === 'capital') {
        getBase(`${endPointList.capital}/${value}`, res => {
            template(res)
        })
    } else if (selected === 'name') {
        getBase(`${endPointList.name}/${value}`, res => {
            template(res)
        })
    }
})




function singleTemplate(url) {
    getBase(url, country => {
        const info = country[0]
        console.log(info)
        $container.innerHTML = `
            <div class="single">
                <div class="singleMore">
                    <div class="more">
                        <h3>Country name:${info.name.common}</h3>
                        <h3>Official name:${info.name.official}</h3>

                        <div class="flags">
                            <img src="${info.flags.svg}">
                            <img src="${info.coatOfArms.svg}">
                        </div>

                        <h3>Start of Week:${info.startOfWeek}</h3>
                        <h3>Postalcode:${info.postalCode.format}</h3>
                        <h3>Population:${info.population}</h3>
                        <h3>Timezone:${info.timezones}</h3>
                    </div>
                </div>

                <div class="divBack">
                    <button class="back" onclick="goBack()">Go Back</button>
                </div>

            </div>
        `
    })

}


function goBack(){
    window.location.reload()
}