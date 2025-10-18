import { useEffect, useState } from "react";
import axios from "axios";
import weatherServices from "./services/weather";

const Weather = ({ weather }) => {
  console.log("showing weather", weather);

  if (weather === null) {
    return <div>loading weather</div>;
  } else {
    const imgSrc = weatherServices.getWeatherIconUrl(weather);
    return (
      <div>
        <div>temperature: {weather.main.temp}°C</div>
        <img src={imgSrc} />
        <div>wind: {weather.wind.speed}m/s</div>
      </div>
    );
  }
};
const CountryInfo = ({ country, weather }) => {
  console.log("country", country);
  console.log("weather", weather);
  return (
    <>
      <h1> {country.name.common} </h1>
      <div>capital : {country.capital[0]}</div>
      <div>area : {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map((entry) => (
          <li key={entry[0]}>{entry[1]}</li>
        ))}
      </ul>
      <div>{country.flag.png}</div>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital}</h2>
      <Weather weather={weather} />
    </>
  );
};

const SearchResult = ({ searchResult, onShowCountryClick }) => {
  if (searchResult.length > 10) {
    return <div>too many matches, specify another filter</div>;
  } else if (searchResult.length >= 2) {
    return searchResult.map((country) => (
      <div key={country.cca2}>
        {country.name.common}{" "}
        <button onClick={() => onShowCountryClick(country)}>Show</button>
      </div>
    ));
  } else if (searchResult.length == 1) {
    console.log("Should not be here");
  } else {
    return <div>no matches found</div>;
  }
};
function App() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [detailedCountry, setDetailedCountry] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const onSearchChanged = (event) => {
    console.log(event.target.value);
    setSearchValue(event.target.value);
    searchFor(event.target.value);
  };
  const showCountry = (country) => {
    console.log("showing country", country);
    setDetailedCountry(country);
  };
  const searchFor = (search) => {
    const result = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredCountries(result);
    if (result.length == 1) {
      setDetailedCountry(result[0]);
    } else {
      setDetailedCountry(null);
    }
  };
  const findWeatherCapital = () => {
    if (detailedCountry === null) return;

    const capitalInfo = detailedCountry.capitalInfo;
    weatherServices
      .getWeatherAt(capitalInfo.latlng[0], capitalInfo.latlng[1])
      .then((responseData) => setWeatherInfo(responseData));
  };
  useEffect(findWeatherCapital, [detailedCountry]);
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);

  const results =
    detailedCountry !== null ? (
      <CountryInfo country={detailedCountry} weather={weatherInfo} />
    ) : (
      <SearchResult
        searchResult={filteredCountries}
        onShowCountryClick={showCountry}
      />
    );

  return (
    <>
      <div>
        find countries <input value={searchValue} onChange={onSearchChanged} />
      </div>

      {results}
      <div></div>
    </>
  );
}

export default App;
