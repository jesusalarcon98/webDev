import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import useStyles from "./Styles/styles";
import InputChart from "./components/InputChart";
import LineChart from "./components/LineChart";
import SelectState from "./components/SelectState";
import PickerDate from "./components/PickerDate";

Chart.register(CategoryScale);

function App() {
  const [dataCovid, setDataCovid] = useState([]);
  const [dataCovidStates, setDataCovidStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    console.log("entra");
    setInitialDate(date);
  };
  const handleFinalData = (date) => {
    setFinalDate(date);
  };

  const classes = useStyles();

  const llamarDatosGenerales = () => {
    axios
      .get("https://api.covidtracking.com/v1/us/daily.json")
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

  // Efecto para obtener datos generales y filtrar por fechas desde el principio
  useEffect(() => {
    llamarDatosGenerales();
    filtrarDatos();
  }, [initialDate, finalDate]); // Dependencias: initialDate, finalDate

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

  return (
    <div className={classes.fullscreenContainer}>
      <div className={classes.title}>
        Estadística de COVID en Estados Unidos
      </div>

      <div className={classes.chartContainer}>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justifyContent="space-around">
              <InputChart />
              <SelectState
                setCambiarFechas={setCambiarFechas}
                llamarDatosEstado={llamarDatosEstado}
                filtrarDatos={filtrarDatos}
              />

              <PickerDate
                minDate={minDate}
                value={initialDate}
                maxDate={finalDate}
                onChange={handleInitialData}
              />
              <PickerDate
                minDate={initialDate}
                value={finalDate}
                maxDate={maxDate}
                onChange={handleFinalData}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </FormControl>
        <LineChart
          CambiarFechas={CambiarFechas}
          filterDates={filterDates}
          nextList={nextList}
          casesValue={casesValue}
          deathValue={deathValue}
        />
      </div>
    </div>
  );
}

export default App;
