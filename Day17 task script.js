
document.addEventListener("DOMContentLoaded", function () {
  const apiKey = '293786e9fd7fcdce62b8c4ac05fc0692';

  const fetchRestCountriesData = async () => {
      try {
          const response = await fetch("https://restcountries.com/v2/all");
          const data = await response.json();
          return data;
      } catch (error) {
          console.error("Error fetching Rest Countries data:", error);
          return [];
      }
  };

  const fetchWeatherData = async (latitude, longitude) => {
      try {
          const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
          const data = await response.json();
          return data;
      } catch (error) {
          console.error("Error fetching OpenWeatherMap data:", error);
          return {};
      }
  };

  const createAndAppendCard = (country, weatherDescription) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card col-lg-4 col-sm-12 mb-4";

      cardDiv.innerHTML = `
          
          <div class="card-body">
              <h5 class="card-heading">${country.name}</h5>
              <img src="${country.flag}" class="card-img-top" alt="Flag">
              <p class="card-text">Capital: ${country.capital || 'Data not available'}</p>
              <p class="card-text">Region: ${country.region || 'Data not available'}</p>
              <p class="card-text">Latlng: ${country.latlng ? country.latlng.join(", ") : 'Data not available'}</p>
              <p class="card-text">Country Code: ${country.alpha2Code || 'Data not available'}</p>
              <button class="card-button">Show Weather</button>
              <p class="weather-info" style="display:none;">Weather: ${weatherDescription || 'Data not available'}</p>
          </div>
      `;

      const button = cardDiv.querySelector(".card-button");
      const weatherInfo = cardDiv.querySelector(".weather-info");

      button.addEventListener("click", async () => {
          try {
              if (country.latlng && country.latlng.length === 2) {
                  const weatherData = await fetchWeatherData(country.latlng[0], country.latlng[1]);

                  if (weatherData.weather && weatherData.weather.length > 0) {
                      const weatherDescription = weatherData.weather[0].description;
                      weatherInfo.textContent = `Weather: ${weatherDescription}`;
                      weatherInfo.style.display = "block";
                  } else {
                      console.error(`Weather data not available for ${country.name}`);
                      weatherInfo.textContent = 'Weather data not available';
                      weatherInfo.style.display = "block";
                  }
              } else {
                  console.error(`Invalid latlng data for ${country.name}`);
              }
          } catch (error) {
              console.error(`Error fetching weather data for ${country.name}`, error);
              weatherInfo.textContent = 'Error fetching weather data';
              weatherInfo.style.display = "block";
          }
      });

      document.getElementById("countryCards").appendChild(cardDiv);
  };

  const renderCards = async () => {
      const countryData = await fetchRestCountriesData();

      countryData.forEach((country) => {
          createAndAppendCard(country);
      });
  };

  renderCards();
});