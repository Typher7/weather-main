// import rec from "./chatgpt.js";
const apiKey = "cbc079521073340dc72ab4388cd0aee4";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const background = document.querySelector('body');
const checkbox = document.querySelector("#accept");

const token = "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"

const rec = async (city, temp, humidity, wind_speed) => {
    var prompt = `I live in ${city}. The current temperature is ${temp}, humidity is ${humidity}, and wind speed is ${wind_speed}`
    prompt += `Give me personalized clothing recomendations based on this. The recommendation must strictly be less than 4 sentences long`
    prompt += `Don't mention the temperature, humidity and wind speed in your response`
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": "Hello!"
            }
            ]
        })
        })
        if (response.ok){
        const jsonResponse = await response.json();
        var i = 0;
        var speed = 10;
        document.querySelector('.message span').innerHTML = "";
        function typeWriter() {
            if (i < txt.length) {
                document.querySelector('.message span').innerHTML += txt.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
                }
        }
        var message = jsonResponse.choices[0].message.content
        const txt = message
        document.querySelector('.message').addEventListener("load", typeWriter());
        document.querySelector('.message').style.fontSize = '40px'
        console.log(message)

        }
        else{
        throw new Error("Request failed!");
        }
    }
    catch(error){
        console.log(error)
    }
}
async function checkWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    var data = await response.json();
    checkbox.checked = false;


    if (response.status === 404){
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather').style.display = 'none';
        document.querySelector('.switch').style.display = 'none';
        document.getElementsByClassName('unit')[0].style.display = 'none';
        document.getElementsByClassName('unit')[1].style.display = 'none';

    }
    else {
        document.querySelector('.error').style.display = 'none';
        document.querySelector('.switch').style.display = 'inline-block';
        document.getElementsByClassName('unit')[0].style.display = 'inline-block';
        document.getElementsByClassName('unit')[1].style.display = 'inline-block';
    }


    console.log(data);
    let temperature = Math.round(data.main.temp)


    checkbox.addEventListener('change', (event) => {
        if (checkbox.checked){
            let fTemp = ((9/5)*(temperature)) + 32;
            fTemp = Math.round(fTemp);
            document.querySelector('.temp').innerHTML = fTemp + '°F';

        }else{
            document.querySelector('.temp').innerHTML = temperature + '°C';
        }
    })


    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
    document.querySelector('.temp').innerHTML = temperature + '°C';
    document.querySelector('.wind').innerHTML = data.wind.speed + ' km/h';
    document.querySelector('.weather').style.display = 'block';

    if (data.weather[0].main === "Clouds"){
        weatherIcon.src = "images/clouds.png";
        background.style.backgroundImage = 'url("images/cloudy_background.jpeg")';
        document.querySelector('.message').style.color = "#ebfffc"
    }
    else if (data.weather[0].main === "Clear"){
        weatherIcon.src = "images/clear.png";
        background.style.backgroundImage = 'url("images/clear_background.jpeg")';
        document.querySelector('.message').style.color = "black"
    }
    else if (data.weather[0].main === "Rain"){
        weatherIcon.src = "images/rain.png";
        background.style.backgroundImage = 'url("images/rainy_background.jpeg")';
    }
    else if (data.weather[0].main === "Drizzle"){
        weatherIcon.src = "images/drizzle.png";
        background.style.backgroundImage = 'url("images/rainy_background.jpeg")';
    }
    else if (data.weather[0].main === "Mist"){
        weatherIcon.src = "images/mist.png";
        background.style.backgroundImage = 'url("images/misty_background.jpeg")';
    }

};


searchButton.addEventListener('click', () => {
    checkWeather(searchBox.value)
    const city = searchBox.value;
    const temperature = document.querySelector(".temp").innerHTML;
    const humidity = document.querySelector(".humidity").innerHTML;
    const wind = document.querySelector(".wind").innerHTML;
    rec(city, temperature, humidity, wind)
});


searchBox.addEventListener("keypress", (event)=> {
    if (event.keyCode === 13) { 
        event.preventDefault();
	    checkWeather(searchBox.value);
        const city = searchBox.value;
        const temperature = document.querySelector(".temp").innerHTML;
        const humidity = document.querySelector(".humidity").innerHTML;
        const wind = document.querySelector(".wind").innerHTML;
        rec(city, temperature, humidity, wind)
    }
});
