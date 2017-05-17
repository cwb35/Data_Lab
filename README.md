# Data Lab - Interactive Web Application

__Author:__ Colin Cambo

This repository is dedicated to my Spring 2017 Thesis project for the class DATA 897.

[Click here](https://cwb35.pythonanywhere.com) to see a live demo of the web app running in its current state.

# About

This project is a web application that is based around my last [Fall 2016 semester project](https://github.com/cwb35/UNH_WiFi_Analysis) where I tracked people's movements around campus through using there wifi connections.

This project takes that project a step further by creating a web application that allows for this data to be analyzed by anyone online in real time.

# Goal

The goal of the project was to get experience using D3.js and creating a web application and API with Python's Flask that was capable of interfacing with D3.js.

#Project Files

	.
	├── Data
	│   ├── Building_Locations.csv
	│   └── WiFi_Data
	│       ├── data_day_0.csv
	│       ├── data_day_1.csv
	│       ├── data_day_2.csv
	│       ├── data_day_3.csv
	│       ├── data_day_4.csv
	│       ├── data_day_5.csv
	│       └── data_day_6.csv
	├── README.md
	├── WiFi_database.sqlite
	├── application.py
	├── requirements.txt
	├── setup.py
	├── static
	│   ├── css
	│   │   ├── nouislider.min.css
	│   │   └── style.css
	│   ├── images
	│   │   └── campus_map.png
	│   └── js
	│       ├── heatMap.js
	│       ├── hourLineChart.js
	│       ├── noUiSlider.9.2.0
	│       │   ├── nouislider.css
	│       │   ├── nouislider.js
	│       │   ├── nouislider.min.css
	│       │   └── nouislider.min.js
	│       └── pathChart.js
	└── templates
	    └── index.html

Other than the [nouislider](https://refreshless.com/nouislider/) code all of the files above were created by me.

#Requirements

To run the web application one needs Python installed. From there you can install all the required packages by running the following command:

```pip install -r requirements.txt``` 

From the project directory.

#Setup

Before the web application can be run, the sqlite database first has to be initialized. This is done through running the setup.py file.

```python setup.py```

This should take 5-10 minutes to complete.

#Run

To run the web application you now have to run the application.py script like so:

```python application.py```

This will create a server with the application running on port 8001.

To access this web application you need to open a browser and navigate to localhost:8001

From there the web application should be running, as long as the python script is still running.


