import { Line } from "react-chartjs-2";
import { REVERSEDATA } from "../logic/labels";

function LineChart({ CambiarFechas, filterDates, nextList, dataCovid }) {
  const casesValue = dataCovid.map((item) => item.positive);
  const deathValue = dataCovid.map((item) => item.death);
  const result = REVERSEDATA(filterDates);
  const chartData = {
    type: "Line",
    labels: CambiarFechas ? result : nextList,
    datasets: [
      {
        label: "Enfermos",
        data: casesValue,
        backgroundColor: "#2196F3",
      },
      {
        label: "Muertes",
        data: deathValue,
        backgroundColor: "#FF5722",
      },
    ],
    options: {
      responsive: true,
    },
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
}
export default LineChart;
