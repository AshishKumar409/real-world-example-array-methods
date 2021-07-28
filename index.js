let container,df
let uri = "./sample-weather.json"
let req = new Request(uri,{method:"GET",mode:"cors"})
document.addEventListener("DOMContentLoaded",init)


function init(){
  container = document.querySelector("#container")
  df = new DocumentFragment();

  fetch(req)
  .then((response)=>{
    if(response.ok){
      console.log(response)
      return response.json()
    }else{
      throw new Error("Bad Http")
    }
  }).then((jsonData)=>{
    // console.log(jsonData);
    jsonData.hourly.data.forEach((hourly)=>{
      let div = document.createElement('div')
      div.classList.add('hour')
      let timeStamps = hourly.time
      div.id="ts_"+timeStamps.toString()
      let temp = parseInt(hourly.temperature)
      div.textContent = temp.toString().concat('\u00B0')
      div.title = hourly.summary
      let timmy = new Date(timeStamps*1000)
      let span = document.createElement('span')
      span.textContent = `${timmy.getHours()}:00`
      div.appendChild(span)

      df.appendChild(div)
    })
    container.appendChild(df)


    jsonData.hourly.data.filter((max)=>{
      return max.precipProbability>0.5
    }).map((timeStampData)=>{
      let timeStamp = 'ts_'.concat(timeStampData.time)
      document.getElementById(timeStamp).classList.add('precip')
    })

    let hotObj = jsonData.hourly.data.reduce((accumulator,hour)=>{
      if(accumulator.temperature<hour.temperature){
        return {temperature:hour.temperature,time:hour.time}
      }else{
        return accumulator
      }
    },{temperature:-100,time:1000})

    let hotId = 'ts_'+hotObj.time.toString()
    document.getElementById(hotId).classList.add("hot")
    
  }).catch((err)=>{
    console.log(err.message);
  })
}