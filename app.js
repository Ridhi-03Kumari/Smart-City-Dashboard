/* ===================
   API KEYS
=================== */
const WEATHER_KEY = "585a33a12f169018b1cd5f2e8e6e6aea";
const TOMTOM_KEY  = "RcbWRRwjfiSofAi8ScuEi0mhKgshA9zw";

let useCelsius = true;

/* HELPERS */
const $ = s => document.querySelector(s);

function safeFetch(url, timeout=9000){
  return new Promise((resolve, reject)=>{
    const timer = setTimeout(()=>reject(new Error("timeout")), timeout);
    fetch(url)
      .then(r=>{
        clearTimeout(timer);
        if(!r.ok) return r.text().then(t=>reject(new Error(r.status+" "+t)));
        return r.json().then(resolve);
      })
      .catch(err=>{ clearTimeout(timer); reject(err); });
  });
}

function showLoading(){
  $("#weatherCity").textContent = "Loading...";
  $("#tempValue").textContent = "--°";
}

/* FORMATTERS */
function formatTemp(t){
  return useCelsius ? Math.round(t)+"°C" : Math.round(t*9/5+32)+"°F";
}

function aqiLabel(pm){
  if(pm<=30) return {label:"Good", color:"#16a34a"};
  if(pm<=80) return {label:"Moderate", color:"#f59e0b"};
  if(pm<=150) return {label:"Unhealthy", color:"#f97316"};
  return {label:"Very Unhealthy", color:"#ef4444"};
}

/* API WRAPPERS */
const getWeather      = city => safeFetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`);
const getForecast     = city => safeFetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_KEY}&units=metric`);
const getCoordinates  = city => safeFetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_KEY}`);
const reverseGeo      = (lat,lon) => safeFetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_KEY}`);
const getAQI          = (lat,lon) => safeFetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}`);
const getTraffic      = (lat,lon) => safeFetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_KEY}&point=${lat},${lon}`);

/* UI UPDATES */
function updateWeatherUI(data){
  $("#weatherCity").textContent = `${data.name}, ${data.sys.country}`;
  $("#weatherSummary").textContent = data.weather[0].description;

  $("#tempValue").textContent = formatTemp(data.main.temp);
  $("#tempRange").textContent = `H: ${formatTemp(data.main.temp_max)} L: ${formatTemp(data.main.temp_min)}`;

  $("#humidityVal").textContent = data.main.humidity + "%";
  $("#windVal").textContent = data.wind.speed + " m/s";
  $("#pressVal").textContent = data.main.pressure + " hPa";

  const icon = data.weather[0].icon;
  $("#weatherIcon").innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" style="width:48px">`;
}

function updateAQIUI(pm){
  $("#pm25Val").textContent = pm;
  const s = aqiLabel(pm);
  $("#aqiStatus").textContent = s.label;
  $("#aqiStatus").style.color = s.color;
}

/* MAIN DATA FETCHER */
async function fetchCityData(city){
  if(!city) return alert("Enter a city");

  showLoading();

  if(!tempChart) initCharts();

  try{
    const coords = await getCoordinates(city).then(r=>({lat:r[0].lat, lon:r[0].lon}));
    
    const [weather, forecast, aqi] = await Promise.all([
      getWeather(city),
      getForecast(city),
      getAQI(coords.lat, coords.lon)
    ]);

    // Update UI
    updateWeatherUI(weather);
    updateAQIUI(aqi.list[0].components.pm2_5);

    // Fill forecast charts
    const list = forecast.list.slice(0, 6);
    list.forEach((d, i)=>{
      const label = i===0 ? "Now" : `+${i*3}h`;

      labels.push(label);
      tempData.push(d.main.temp);
      humidityData.push(d.main.humidity);
      rainData.push((d.rain && (d.rain["3h"]||d.rain["1h"])) || 0);
      windData.push(d.wind.speed);
      pmData.push(aqi.list[0].components.pm2_5);

      trimData();
    });

    updateCharts();

    renderForecastChart(
      list.map((d,i)=>({t:d.main.temp, label:i===0?"Now":`+${i*3}h`}))
    );

    renderBarChart(weather.main.temp, aqi.list[0].components.pm2_5);

    $("#refreshBtn").textContent =
      "Last refresh: " + new Date().toLocaleTimeString();

  } catch(err){
    alert("Error: " + err.message);
  }
}

/* EVENTS */
$("#searchBtn").onclick = () => {
  const city = $("#cityInput").value || $("#citySelect").value;
  fetchCityData(city);
};

$("#citySelect").onchange = function(){
  $("#cityInput").value = this.value;
};

$("#unitsToggle").onclick = () => {
  useCelsius = !useCelsius;
  const city = $("#cityInput").value || $("#citySelect").value;
  if(city) fetchCityData(city);
};

$("#refreshBtn").onclick = () => {
  const city = $("#cityInput").value || "Bengaluru";
  fetchCityData(city);
};

$("#geoBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(async pos=>{
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const cityRes = await reverseGeo(lat,lon);
    const name = cityRes[0].name;

    $("#cityInput").value = name;
    fetchCityData(name);

  }, err=>alert(err.message));
};

// Auto-load Bengaluru
fetchCityData("Bengaluru");
