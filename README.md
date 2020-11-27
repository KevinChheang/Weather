# Weather forecast

You can visit the site [here](https://kevinchh-weather.herokuapp.com).
 
As a user you can use the site to get weather forecast around the world by providing a city name. You can use that functionality without ever sign up or login. For signed up/logged in user, the site also allows you to add/save an upcoming trip then you can get a recommendation of known places to visit during your trip.

###Features
1. Weather forecast around the world
	* Current weather
	* Daily weather (7 Days)
2. Save upcoming trip
3. Edit upcoming trip
4. Delete Upcoming trip
5. Signup
6. Login/logout
7. Get recommendation for places to vist for the trip


###User flow
1. For unregistered users
	* They can search for weather information by city name.
2. For registered users
	* Once signup will redirect them to main screen
	* They can search for weather information by city name
	* Add an upcoming trip
	* Update their upcoming trip
	* Delete their upcoming trip
	* Getting recommendations for their upcoming trip
	* They can logout

###API
[Open weather map](https://openweathermap.org/api)  
[Open trip map](https://opentripmap.io/)

###Requirements
1. Pip install all dependencies from requirements.txt
2. Create a file called secrets.js
	* place it inside static/js folder
	* place all API key in here
	* import it into weather.js
3. Create a file called secrets.py
	* place it in the same folder as app.py
	* place flask session key in here 
	* import it into app.py