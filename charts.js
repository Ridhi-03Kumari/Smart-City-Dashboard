// GLOBAL ARRAYS FOR CHART DATA
let labels = [];
let tempData = [];
let rainData = [];
let humidityData = [];
let pmData = [];
let windData = [];

let tempChart, rainChart, humidityChart, pmChart, forecastChart, barChart;

// GRADIENT HELPER
function gradient(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

// INITIALIZE CHARTS
function initCharts() {
  const tCtx = tempChartElement = document.getElementById("tempChart").getContext("2d");
  const rCtx = document.getElementById("rainChart").getContext("2d");
  const hCtx = document.getElementById("humidityChart").getContext("2d");
  const pCtx = document.getElementById("pmChart").getContext("2d");

  tempChart = new Chart(tCtx, {
    type: "line",
    data: { labels, datasets: [{
      label: "°C", data: tempData,
      borderColor: "#1e88e5",
      backgroundColor: gradient(tCtx, "rgba(30,136,229,0.5)", "rgba(30,136,229,0.1)"),
      borderWidth: 3, fill: true, tension: 0.3
    }] },
    options: { plugins:{legend:{display:false}} }
  });

  rainChart = new Chart(rCtx, {
    type: "bar",
    data: { labels, datasets: [{
      label: "mm",
      data: rainData,
      backgroundColor: gradient(rCtx, "rgba(103,58,183,0.8)", "rgba(103,58,183,0.3)")
    }] },
    options:{ plugins:{legend:{display:false}} }
  });

  humidityChart = new Chart(hCtx, {
    type:"line",
    data:{labels, datasets:[{
      label:"%", data:humidityData,
      borderColor:"#26a69a",
      backgroundColor:gradient(hCtx,"rgba(38,166,154,0.5)","rgba(38,166,154,0.1)"),
      borderWidth:3, tension:0.3, fill:true
    }]},
    options:{ plugins:{legend:{display:false}} }
  });

  pmChart = new Chart(pCtx, {
    type:"line",
    data:{labels, datasets:[{
      label:"µg/m³", data:pmData,
      borderColor:"#ef6c00",
      backgroundColor:gradient(pCtx,"rgba(239,108,0,0.5)","rgba(239,108,0,0.1)"),
      borderWidth:3, tension:0.3, fill:true
    }]},
    options:{ plugins:{legend:{display:false}} }
  });
}

function updateCharts() {
  tempChart.update();
  rainChart.update();
  humidityChart.update();
  pmChart.update();
}

function trimData() {
  if (labels.length > 10) {
    labels.shift();
    tempData.shift();
    rainData.shift();
    humidityData.shift();
    windData.shift();
    pmData.shift();
  }
}

// FORECAST CHART
function renderForecastChart(hourly) {
  const labelsF = hourly.map(h => h.label);
  const dataF = hourly.map(h => h.t);

  if (forecastChart) forecastChart.destroy();
  forecastChart = new Chart(document.getElementById("forecastChart"), {
    type:"line",
    data:{labels:labelsF, datasets:[{
      data:dataF, borderColor:"#2563eb",
      backgroundColor:"rgba(37,99,235,0.08)",
      tension:0.35
    }]},
    options:{ plugins:{legend:{display:false}} }
  });
}

// BAR CHART (TEMP VS PM2.5)
function renderBarChart(tempVal, pm) {
  if (barChart) barChart.destroy();
  barChart = new Chart(document.getElementById("barChart"), {
    type:"bar",
    data:{
      labels:["Temp","PM2.5"],
      datasets:[{ data:[tempVal, pm||0], backgroundColor:["#2563eb","#60a5fa"] }]
    },
    options:{ plugins:{legend:{display:false}} }
  });
}
