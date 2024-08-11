const cityName = document.querySelector(".city-name"),
    nowDate = document.querySelector(".now-date"),
    icon = document.querySelector("#icon"),
    temp = document.querySelector("#temp"),
    description = document.querySelector("#description"),
    feels = document.querySelector("#feels"),
    humidity = document.querySelector("#humidity"),
    wind = document.querySelector("#wind"),
    nextTimeWeather = document.querySelector("#bottom-cont"),
    form = document.querySelector("form"),
    input = document.querySelector("#input"),
    loadingIndicator = document.querySelector("#loading")

async function getWeather(url) {
  try {
    showLoading()
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    getWeatherData(data)
  } catch (err) {
    console.log(err)
  }finally{
    hideLoading()
  }
}

getWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=nukus&units=metric&APPID=a045a1a5356155dc5712ab1318762afa`
  )

function getImageIcon(iconData) {
    let icon;
    switch (iconData) {
        case "04d":
        icon = "./images/cloud-5.png"
        break;
      case "04n":
        icon = "./images/cloud-5.png"
        break;
      case "03d":
        icon = "./images/cloud-17.png"
        break;
      case "03n":
        icon = "./images/cloud-17.png"
        break;
      case "11d":
        icon = "./images/cloud-f-6.png"
        break;
      case "11n":
        icon = "./images/cloud-f-rain-7.png"
        break;
      case "10n":
        icon = "./images/cloud-rain-9.png"
        break;
      case "9n":
        icon = "./images/cloud-rain-9.png"
        break;
      case "01d":
        icon = "./images/sun-2.png"
        break;
      case "10d":
        icon = "./images/sun-rain-16.png"
        break;
      case "9d":
        icon = "./images/sun-rain-16.png"
        break;
      case "01n":
        icon = "./images/moon-11.png"
        break;
      case "02n":
        icon = "./images/moon-11.png"
        break;
      case "02d":
        icon = "./images/cloud-sun-10.png"
        break;
      case "13d":
        icon = "./images/cloud-wind-8.png"
        break;
      case "13n":
        icon = "./images/cloud-wind-13.png"
        break;
      case "50d":
        icon = "./images/cloud-wind-13.png"
        break;
      case "50n":
        icon = "./images/cloud-wind-13.png"
        break;
    }
    return icon
  }



function getWeatherData(data) {
  cityName.textContent = data.name
  nowDate.textContent = new Date().toDateString()+ " | " +  new Date().toLocaleTimeString().slice(0,5)
  temp.textContent = data.main.temp.toFixed()
  description.textContent = data.weather[0].description
  feels.textContent = data.main.feels_like.toFixed()
  humidity.textContent = data.main.humidity.toFixed()
  wind.textContent = data.wind.speed
  icon.setAttribute('src' , getImageIcon(data.weather[0].icon))
}


function getTimeWeatherData(data){
    const nowDataWeather = data.list
    nextTimeWeather.innerHTML = ""
    nowDataWeather.forEach((item) => {
        const temp = item.main.temp.toFixed() - 273
        const time = item.dt_txt.slice(0,10)
        const h = item.dt_txt.slice(11,16)
        console.log(time)
        console.log(h)
        console.log(item)

        nextTimeWeather.innerHTML += 
        `
        <div class="card">
            <div class="time">${time}<span>${h}</span></div>
            <img src="${getImageIcon(item.weather[0].icon)}" alt="">
            <div class="description">${item.weather[0].description}</div>
            <div class="temp"><span>${temp}</span>°C</div>
        </div>
        `
    })
}


async function getTimeWeather(url) {
  try {
    showLoading()
    const res = await fetch(url)
    const data = await res.json()
    getTimeWeatherData(data)
  } catch (err) {
    console.log(err)
  }finally{
    hideLoading()
  }
}

async function getCityCoordinates(cityName) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`

  try {
    showLoading()
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.length > 0) {
      const latitude = data[0].lat
      const longitude = data[0].lon
      getTimeWeather(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=a03907379bf6298de151aa072092c802`
      )
    } else {
      console.log("City not found")
    }
  } catch (error) {
    console.error("Error fetching the coordinates:", error)
  }finally{
    hideLoading()
  }
}

getCityCoordinates('nukus')

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const value = input.value.trim()
  if (value) {
    getWeather(`https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&APPID=a045a1a5356155dc5712ab1318762afa`)
    getCityCoordinates(value)
    console.log(value)
    form.reset()
  } else {
    input.focus()
  }
})



function showLoading() {
    loadingIndicator.classList.remove("hidden")
}

function hideLoading() {
    loadingIndicator.classList.add("hidden")
}