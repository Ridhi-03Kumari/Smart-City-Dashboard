# Smart-City-Dashboard

A real-time visualization dashboard that displays key smart-city metrics such as temperature, humidity, rainfall, wind speed, and air quality using open public APIs.
The dashboard is interactive, responsive, and uses Chart.js for data visualization which makes it clear to view for any individual.

Objective

To build a Smart City Data Dashboard that:

Fetches real-time or publicly available open data from any smart city in the world.

Uses open APIs to display metrics such as:

Temperature

Humidity

Rainfall

Wind speed

Air quality (PM2.5, AQI)

Parses and processes this data.

Visualizes the data using interactive charts and graphs with plottings.

Presents meaningful insights through an intuitive dashboard interface.

Features
Real-Time Data Fetching

Uses Open-Meteo open APIs to fetch weather and air quality data in real time.

Supported Cities

The dashboard includes eight cities by default:

Bengaluru

Delhi

Kolkata

Singapore

London

New York

Madrid

Barcelona

(More cities can be added easily….if you want to merge or raise pull request….!!!)

Dynamic Charts

The dashboard displays five charts:

Temperature (Line chart)

Rainfall (Bar chart)

Humidity (Line chart)

PM2.5 Air Quality (Line chart, includes AQI category)

Wind Speed (Line chart)

AQI Color Indicator

The PM2.5 card automatically changes color based on AQI safety levels.

Modern User Interface

Clean and minimal design

Glassmorphism styling

Responsive grid layout

Smooth interactions and chart animations

Simple Setup

The project works on all browsers without any backend.
Only HTML, CSS, JavaScript, Chart.js, and Open-Meteo APIs are used which has been integrated.

Tech Stack
Component	Technology
Frontend	HTML, CSS, JavaScript
Charts	Chart.js
APIs	Open-Meteo Weather API, Open-Meteo Air Quality API
Styling	CSS Flexbox, CSS Grid, Glassmorphism
APIs Used
1. Open-Meteo Weather API

Provides real-time:

Temperature

Humidity

Rainfall

Wind Speed

Example request:

https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=temperature_2m,precipitation,relativehumidity_2m,windspeed_10m

2. Open-Meteo Air Quality API

Provides PM2.5 concentrations and AQI-related health categories.

Example request:

https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&hourly=pm2_5


Both APIs are free and require no API key.

Installation and Usage
1. Clone the Repository
git clone https://github.com/your-username/smart-city-dashboard.git
cd smart-city-dashboard

2. Run the Project

Simply open index.html in any browser.
No additional setup is required.

Project Structure
smart-city-dashboard/
│
├── index.html      # Full dashboard with UI, charts, and API logic
└── README.md       # Project documentation

Screenshots

(Add your dashboard screenshots after uploading the project)

![Dashboard Screenshot](images/dashboard.png)

Future Enhancements

Add traffic congestion data

Add energy consumption and smart grid insights

Include waste management tracking

Add a live map view using Leaflet

City comparison tools

Auto-refresh every defined interval

Dark mode support

License

This project is licensed under the MIT License.
