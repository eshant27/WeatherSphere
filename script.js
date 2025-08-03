let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");

// Function to fetch weather details and city image
let getWeather = () => {
  let cityValue = cityRef.value;

  // If input field is empty
  if (cityValue.length === 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
    // Revert to default background if no city is entered
    document.body.style.backgroundImage = 'linear-gradient(135deg, var(--blue-1), var(--blue-2))';
    return;
  }

  // URLs for both API requests
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
  let unsplashUrl = `https://api.unsplash.com/search/photos?query=${cityValue}&client_id=${unsplashKey}&orientation=landscape&per_page=1`;

  // Clear the input field
  cityRef.value = "";

  // Make both API calls concurrently using Promise.all
  Promise.all([
    fetch(weatherUrl).then(resp => {
      if (!resp.ok) {
        throw new Error('City not found in weather API');
      }
      return resp.json();
    }),
    fetch(unsplashUrl).then(resp => resp.json())
  ])
  .then(([weatherData, imageData]) => {
    // Process weather data
    result.innerHTML = `
      <h2>${weatherData.name}</h2>
      <h4 class="weather">${weatherData.weather[0].main}</h4>
      <h4 class="desc">${weatherData.weather[0].description}</h4>
      <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png">
      <h1>${weatherData.main.temp} &#176;</h1>
      <div class="temp-container">
          <div>
              <h4 class="title">min</h4>
              <h4 class="temp">${weatherData.main.temp_min}&#176;</h4>
          </div>
          <div>
              <h4 class="title">max</h4>
              <h4 class="temp">${weatherData.main.temp_max}&#176;</h4>
          </div>
      </div>
    `;

    // Process image data
    if (imageData.results && imageData.results.length > 0) {
      const imageUrl = imageData.results[0].urls.regular;
      document.body.style.backgroundImage = `url('${imageUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.transition = 'background-image 0.5s ease-in-out';
    } else {
      // Fallback to the default gradient if no image is found
      document.body.style.backgroundImage = 'linear-gradient(135deg, var(--blue-1), var(--blue-2))';
    }
  })
  .catch((error) => {
    // Handle errors from either API call
    console.error(error);
    result.innerHTML = `<h3 class="msg">City not found</h3>`;
  });
};

searchBtn.addEventListener("click", getWeather);
window.addEventListener("load", getWeather);