import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import axios from "axios";
import LineChart from "./components/LineChart";
import { Line } from "react-chartjs-2";
Chart.register(CategoryScale);

function App() {
  const [dataCovid, setDataCovid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.covidtracking.com/v2/us/daily.json")
      .then((response) => {
        setDataCovid(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Data missed", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <h1>Cargando...</h1>
      </div>
    );
  }

  console.log(dataCovid.map((item) => item.outcomes.death.total.value));
  const labels = dataCovid.map((item) => item.date);
  const casesValue = dataCovid.map((item) => item.cases.total.value);
  const deathValue = dataCovid.map((item) => item.outcomes.death.total.value);

  /* const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart'
      }
    }
  },
}; */
  const chartData = {
    type: "Line",
    labels: labels,
    datasets: [
      {
        label: "Enfermos",
        data: casesValue,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Muertes",
        data: deathValue,
        backgroundColor: "rgba(255,0,0,1)",
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
        },
      },
    },
  };

  return (
    <div className="App">
      <h1>Gráfico de Estados por Fecha</h1>
      <Line data={chartData}  />
    </div>
  );
}

export default App;
