from flask import Flask, jsonify, request, render_template
import requests
import os

app = Flask( __name__, static_folder = 'static', template_folder = 'templates' )

@app.route('/')

def index():

    return render_template( 'index.html' )

@app.route( '/weather', methods = [ 'GET' ] )

def get_weather():

    location = request.args.get( 'location' )

    if not location:

        return jsonify( {'error': 'Location not provided'} ), 400

    api_key = "341a60510bd4159fba0f55855d455232"
    base_url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
    
    try:

        response = requests.get( base_url )
        data = response.json()

        if data.get( 'cod' ) != 200:

            return jsonify( {'error': f"City {location} not found"} ), 404
        
        weather_data = {

            'temperature': data['main']['temp'],
            'feels_like': data['main']['feels_like'],
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'weather_report': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed'],
            'wind_deg': data['wind'].get('deg', 'N/A'),
            'cloud_cover': data['clouds']['all'],
            'sunrise': data['sys']['sunrise'],
            'sunset': data['sys']['sunset'],
            'icon': data['weather'][0]['icon']
        }

        return jsonify( weather_data )
    
    except Exception as e:

        return jsonify( {'error': str( e )} ), 500

if __name__ == "__main__":

    app.run( debug = True )