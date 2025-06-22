function fetchWeather(){

    const location = document.getElementById("locationInput").value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const weatherSection = document.getElementById("weatherSection");
    const container = document.querySelector(".container");

    if( !location ){

        errorMessage.textContent = "Please enter a location!";
        return;

    }

    errorMessage.textContent = "";
    weatherSection.classList.add("hidden");

    document.getElementById("weatherImage").classList.add("hidden-opacity");
    document.getElementById("temperature").classList.add("hidden-opacity");

    resetAnimationClasses();

    fetch( `/weather?location=${encodeURIComponent( location )}` )

        .then( response => response.json() )
        .then( data => {

            if( data.error ){

                errorMessage.textContent = data.error;
                return;

            }

            document.getElementById("temperature").textContent = `${data.temperature}°C`;
            document.getElementById("weatherReport").textContent = `Weather: ${capitalizeFirstLetter( data.weather_report )}`;
            document.getElementById("humidity").textContent = `Humidity: ${data.humidity}%`;
            document.getElementById("windSpeed").textContent = `Wind Speed: ${data.wind_speed} m/s`;
            document.getElementById("cloudCover").textContent = `Cloud Cover: ${data.cloud_cover}%`;
            document.getElementById("weatherImage").src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
            document.getElementById("weatherImage").alt = data.weather_report;

            const sunriseTime = convertUnixToLocalTime( data.sunrise );
            const sunsetTime = convertUnixToLocalTime( data.sunset );

            document.getElementById("sunrise").textContent = `Sunrise: ${sunriseTime}`;
            document.getElementById("sunset").textContent = `Sunset: ${sunsetTime}`;

            weatherSection.classList.remove("hidden");

            if( !container.classList.contains("expanded") ){

                container.classList.add("expanded");

            }

            setTimeout( () => {

                document.getElementById("weatherImage").classList.add("fade-in");
                document.getElementById("temperature").classList.add("fade-in");

                document.getElementById("weatherImage").classList.remove("hidden-opacity");
                document.getElementById("temperature").classList.remove("hidden-opacity");

                document.getElementById("weatherReport").classList.add("fade-in-delay");
                document.getElementById("humidity").classList.add("fade-in-delay");
                document.getElementById("windSpeed").classList.add("fade-in-delay");
                document.getElementById("cloudCover").classList.add("fade-in-delay");
                document.getElementById("sunrise").classList.add("fade-in-delay");
                document.getElementById("sunset").classList.add("fade-in-delay");

                weatherSection.classList.add("show");

            }, 1000);

        })

        .catch( error => {

            errorMessage.textContent = "Error fetching weather data!";
            console.error( error );

        });

}

function resetAnimationClasses(){

    const weatherImage = document.getElementById("weatherImage");
    const temperature = document.getElementById("temperature");
    const weatherDetails = document.querySelectorAll(".fade-in-delay");

    weatherImage.classList.remove("fade-in");
    temperature.classList.remove("fade-in");

    weatherDetails.forEach( detail => {

        detail.classList.remove("fade-in-delay");

    });

    void weatherImage.offsetWidth;
    void temperature.offsetWidth;

}

function capitalizeFirstLetter( string ){

    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );

}

function convertUnixToLocalTime( unixTimestamp ){

    const date = new Date( unixTimestamp * 1000 );
    return date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );

}