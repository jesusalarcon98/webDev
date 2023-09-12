import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [initialDate, setInitialDate] = React.useState(
    new Date("2020-01-13T21:11:54")
  );
  const [finalDate, setFinalDate] = React.useState(
    new Date("2021-03-06T21:11:54")
  );
  const [originalData, setOriginalData] = useState([]);
  const [filterDates, setFilteredDates] = useState([]);
  const [CambiarFechas, setCambiarFechas] = useState(false);

  const minDate = new Date("2020-01-13T21:11:54");
  const maxDate = new Date("2021-03-06T21:11:54");

  const handleInitialData = (date) => {
    setInitialDate(date);
  };
  const handleFinalData = (date) => {
    setFinalDate(date);
  };

  const classes = useStyles();

  const llamarDatosEstado = (selectedOption) => {
    axios
      .get(
        `https://api.covidtracking.com/v1/states/${selectedOption}/daily.json`
      )
      .then((response) => {
        setDataCovid(response.data);
        setOriginalData(response.data);
        setCambiarFechas(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Data missed", error);
        setIsLoading(false);
      });
  };

  const filtrarDatos = () => {
    // Usar initialDate y finalDate actuales
    const filteredDates = originalData.reduce((acc, item) => {
      const dateString = item.date.toString();
      const formattedDate = `${dateString.substr(0, 4)}/${dateString.substr(
        4,
        2
      )}/${dateString.substr(6, 2)}`;
      const currentDate = new Date(formattedDate);

      if (currentDate >= initialDate && currentDate <= finalDate) {
        return [...acc, formattedDate];
      }

      return acc;
    }, []);

    setFilteredDates(filteredDates); // Asigna el resultado al estado
  };

  // Llama a la función dentro de un efecto cuando selectedOption cambia
  useEffect(() => {
    if (selectedOption) {
      llamarDatosEstado(selectedOption);
      filtrarDatos(initialDate, finalDate);
    }
  }, [selectedOption, initialDate, finalDate]); // Dependencias: selectedOption, initialDate, finalDate

  // Maneja el cambio de la opción seleccionada
  const handleChange = (event) => {
    const selectedOption = event.target.value.toLowerCase();
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    axios
      .get("https://api.covidtracking.com/v1/us/daily.json")
      .then((response) => {
        setDataCovid(response.data);
        setOriginalData(response.data);
        setCambiarFechas(false);
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
        setCambiarFechas(false);
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

  const nextList = [...labels];
  nextList.reverse();

  const casesValue = dataCovid.map((item) => item.positive);
  const deathValue = dataCovid.map((item) => item.death);

  const chartData = {
    type: "Line",
    labels: CambiarFechas ? filterDates : nextList,
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
        <Select native onChange={handleChange}>
          <option aria-label="None" value=""></option>
          {dataCovidStates.map((data) => (
            <option key={data.state} value={data.state} name={data.state}>
              {data.state}
            </option>
          ))}
        </Select>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justifyContent="space-around">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              minDate={minDate}
              value={initialDate}
              maxDate={maxDate}
              onChange={(date) => {
                handleInitialData(date);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              value={finalDate}
              minDate={initialDate}
              maxDate={maxDate}
              onChange={(date) => {
                handleFinalData(date);
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </FormControl>
      <Line data={chartData} />
    </div>
  );
}

export default App;
