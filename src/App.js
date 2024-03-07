import './App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [data, setData] = useState(null);

  const [readData, setReadData] = useState(null);

  const [cityName, setName] = useState('');

  const [cityData, setCityData] = useState(null);

  const [cities, setCities] = useState([{name: 'Austin', latitude: 30.26715, longitude: -97.74306, color: '#00000066'}, 
                                        {name: 'Dallas', latitude: 32.78306, longitude: -96.80667, color: '#0000001a'}, 
                                        {name: 'Houston', latitude: 29.76328, longitude: -95.36327, color: '#0000001a'}])

  useEffect(() => {
    getData(30.26715, -97.74306)
  }, [])

  useEffect(() => {
    if (data != null) {
      let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 10; i++) {
        let time = convertTime(data.hourly.time[i])
        temp[i] = time + " " + data.hourly.temperature_2m[i]
      }
      setReadData(temp)
    }
  }, [data]);

  function convertTime(time) {
    let halves = time.split('T')
    let hours = halves[1].split(':')
    if (parseInt(hours[0]) >= 12) {
        let hour = parseInt(hours[0]) - 12;
        return hour + ":00PM"
    } else {
      if (parseInt(hours[0]) == 0) {
        return "12:00AM"
      } else {
        return halves[1] + "AM"
      }
    }
  }

  function getData(latitude, longitude) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=1&forecast_hours=12')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }

  function addCity(cityName) {
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + cityName + '&count=1&language=en&format=json')
      .then(response => response.json())
      .then(json => setCityData(json))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    if (cityData != null) {
      if (cityData.results == null) {
        alert("Could not find weather for " + cityName)
      } else {
        let temp = [...cities]
        temp.push({name: cityData.results[0].name, latitude: cityData.results[0].latitude, longitude: cityData.results[0].longitude, color: '#0000001a'})
        setCities(temp)
      }
      setName('')
    }
  }, [cityData])

  function clearColors() {
    let temp = [...cities]
    for (let i = 0; i < temp.length; i++) {
      temp[i].color = '#0000001a';
    }
    setCities(temp)
  }

  return (
    <div className="App">
      <div className='row button-container'>
        {cities.map((city) => <div className="button col-3" style={{backgroundColor: city.color}} onClick={() => {
          clearColors()
          city.color = '#00000066'
          getData(city.latitude, city.longitude)
        }}>{city.name}</div>)}
      </div>
      <div className='row input-container'>
          <input className='col-8' value={cityName} onChange={e => setName(e.target.value)}></input>
          <div className='button col-2' onClick={() => addCity(cityName)}>+</div>
      </div>
      <div className='row header-container mx-auto'>
        <div className='col-6 header'>Time</div><div className='col-6 header'>Temperature</div>
      </div>
      {readData ? readData.map((line) => 
        <div className='row header-container mx-auto'>
          <div className='col-6'>
            {line.split(' ')[0]}
          </div>
          <div className='col-6'>
            {line.split(' ')[1]}
          </div>
        </div>
      ) : 'Loading...'}
    </div>
  );
}

export default App;
