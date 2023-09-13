import { Line } from "react-chartjs-2";

function LineChart({
  CambiarFechas,
  filterDates,
  nextList,
  casesValue,
  deathValue,
}) {
  const chartData = {
    type: "Line",
    labels: CambiarFechas ? filterDates : nextList,
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
