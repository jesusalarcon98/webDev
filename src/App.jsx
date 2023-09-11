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
  const [isLoading, setIsLoading] = useState(true);

  const classes = useStyles();
  const [state, setState] = useState({
    age: "",
    name: "hai",
  });
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
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

  if (isLoading) {
    return (
      <div className="App">
        <h1>Cargando...</h1>
      </div>
    );
  }

  const labels = dataCovid.map((item) => {
    /*   <ul>
        {dataCovid.map((item, index) => {
          const dateString = item.date.toString();
          const formattedDate = `${dateString.substr(0, 4)}/${dateString.substr(4, 2)}/${dateString.substr(6, 2)}`;
          return <li key={index}>{formattedDate}</li>;
        })}
      </ul> */
    const dateString = item.date.toString();
    // Tu cadena de fecha

    // Formatea la cadena en el formato deseado (AAAA/MM/DD)
    const formattedDate = `${dateString.substr(0, 4)}/${dateString.substr(
      4,
      2
    )}/${dateString.substr(6, 2)}`;

    return formattedDate;
  });
  console.log(labels);
  console.log(dataCovid.map((item) => item));
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

  return (
    <div className="App">
      <h1>Estadística de COVID en Estados Unidos.</h1>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">Age</InputLabel>
        <Select
          native
          value={state.age}
          onChange={handleChange}
          inputProps={{
            name: "age",
            id: "age-native-simple",
          }}
        >
          <option aria-label="None" value="" />
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <option value={30}>Thirty</option>
        </Select>
      </FormControl>
      <Line data={chartData} />
    </div>
  );
}

export default App;
