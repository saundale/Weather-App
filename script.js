

// const API_KEY = "5dae5ede9679cd8288c05439f7bb0d3a" ;

// async function showWeather() {
//     let city="goa";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    
//     const data = await response.json();

//     console.log("Weather data->",data);

//     let newPara= document.createElement('p');

//     newPara.textContent=`${data?.main?.temp.toFixed(2)} C`

//     document.body.appendChild(newPara);
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container")

const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen  = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

//initial variables 

const API_KEY = "5dae5ede9679cd8288c05439f7bb0d3a"
let currentTab = userTab;
currentTab.classList.add("current-tab")
getfromSessionStorage();

//ek kam aur krna hai

//function to change tab

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form container invisible hai if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active"); 
        }
        else{
            //main pehle hi search wale tab pr tha, ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            
            //ab main your weather tab me aagya hu,toh weather bhi display karna padega
            //so lets check local storage first for coordinates if we have saved them there

            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    //passing clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //passing clicked tab as input parameter
    switchTab(searchTab);
});

//check if user coordinates are already stored in session storage

function  getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mile toh
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data =await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //
    }
}

function renderWeatherInfo(weatherInfo){
    //fetch the elements
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[dataWeatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    //fetch info from API to display on UI 
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText=weatherInfo?.weather?.[0]?.description;

    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText=  `${weatherInfo?.clouds?.all}%`;
}   

function grantLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show alert for no geolocation available
        alert("no geolocation support available")
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    } 
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",grantLocation); 

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        //
    }
}