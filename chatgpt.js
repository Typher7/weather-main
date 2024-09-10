const token = "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"
const rec = async (city, temp, humidity, wind_speed) => {
  var prompt = `I live in ${city}. The current temperature is ${temp}, humidity is ${humidity}, and wind speed is ${wind_speed}`
  prompt += `Give me personalized clothing recomendations based on this. The recommendation must strictly be less than 4 sentences long`
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
      function typeWriter() {
        if (i < txt.length) {
            document.querySelector('.message span').innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
            }
      }
      var message = jsonResponse.choices[0].message.content
      document.querySelector('.message').addEventListener("load", typeWriter());
      document.querySelector('.message').style.fontSize = '40px'

    }
    else{
      throw new Error("Request failed!");
    }
  }
  catch(error){
    console.log(error)
  }
}


export{rec}
