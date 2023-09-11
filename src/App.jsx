import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import axios from "axios";
import LineChart from "./components/LineChart";
import { Line } from "react-chartjs-2";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";

Chart.register(CategoryScale);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const [dataCovid, setDataCovid] = useState([]);
  const [dataCovidStates, setDataCovidStates] = useState([]);
  const [dataCovidStatesDaily, setDataCovidStatesDaily] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");

  const classes = useStyles();

  const llamarDatosEstado = (selectedOption) => {
    axios
      .get(
        `https://api.covidtracking.com/v1/states/${selectedOption}/daily.json`
      )
      .then((response) => {
        setDataCovid(response.data);

        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Data missed", error);
        setIsLoading(false);
      });
  };

  // Llama a la función dentro de un efecto cuando selectedOption cambia
  useEffect(() => {
    if (selectedOption) {
      llamarDatosEstado(selectedOption);
    }
  }, [selectedOption]); // Dependencia: selectedOption

  // Maneja el cambio de la opción seleccionada
  const handleChange = (event) => {
    const selectedOption = event.target.value.toLowerCase();
    selectedOption.toLowerCase();
    setSelectedOption(selectedOption); // Actualiza el estado con la nueva opción
  };

  useEffect(() => {
    axios
      .get("https://api.covidtracking.com/v1/us/daily.json")
      .then((response) => {
        setDataCovid(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Data missed", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://api.covidtracking.com/v1/states/current.json")
      .then((response) => {
        setDataCovidStates(response.data);
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

  const labels = dataCovid.map((item) => {
    const dateString = item.date.toString();

    const formattedDate = `${dateString.substr(0, 4)}/${dateString.substr(
      4,
      2
    )}/${dateString.substr(6, 2)}`;

    return formattedDate;
  });
  labels.reverse();
  const casesValue = dataCovid.map((item) => item.positive);
  const deathValue = dataCovid.map((item) => item.death);

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

  const estilo = {
    display: "flex",
  };

  return (
    <div className="App">
      <h1>Estadística de COVID en Estados Unidos.</h1>
      <FormControl className={classes.formControl} style={estilo}>
        <InputLabel htmlFor="age-native-simple">
          Seleccionar un estado.
        </InputLabel>
        <Select
          native
          /*   value={state.age} */
          onChange={handleChange}
        >
          <option aria-label="None" value=""></option>
          {dataCovidStates.map((data) => (
            <option key={data.state} value={data.state} name={data.state}>
              {data.state}
            </option>
          ))}
        </Select>
      </FormControl>
      <Line data={chartData} />
    </div>
  );
}

export default App;
