import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const baseImgUrl = "https://openweathermap.org/img/wn/";
const apikey = import.meta.env.VITE_OWAPIKEY;
const getWeatherAt = (lat, lon) => {
  const url = `${baseUrl}lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
  const request = axios.get(url);
  return request.then((response) => response.data);
};

const getWeatherIconUrl = (weather) => {
  const icon = weather.weather[0].icon;
  const url = `${baseImgUrl}${icon}.png`;
  return url;
};
export default { getWeatherAt, getWeatherIconUrl };
