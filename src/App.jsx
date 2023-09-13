import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import useStyles from "./Styles/styles";
import LineChart from "./components/LineChart";
import SelectState from "./components/SelectState";
import PickerDate from "./components/PickerDate";
import ContainerDates from "./components/ContainerDates";
import { minDate, maxDate } from "./constants";
import { DATOS_FILTRADOS, FORMATTEDLABELS, REVERSEDATA } from "./logic/labels";

Chart.register(CategoryScale);

function App() {
  const [dataCovid, setDataCovid] = useState([]);
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

  const handleInitialData = (date) => {
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

  useEffect(() => {
    llamarDatosGenerales();
    DATOS_FILTRADOS(originalData, initialDate, finalDate, setFilteredDates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate, finalDate]);
  if (isLoading) {
    return (
      <div className="App">
        <h1>Cargando...</h1>
      </div>
    );
  }

  const labels = FORMATTEDLABELS(dataCovid);
  const nextList = REVERSEDATA(labels);

  const casesValue = dataCovid.map((item) => item.positive);
  const deathValue = dataCovid.map((item) => item.death);

  return (
    <div className={classes.fullscreenContainer}>
      <div className={classes.title}>
        Estadística de COVID en Estados Unidos
      </div>

      <div className={classes.chartContainer}>
        <ContainerDates />
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justifyContent="space-around">
              {/*     <InputChart /> */}
              <SelectState
                setCambiarFechas={setCambiarFechas}
                llamarDatosEstado={llamarDatosEstado}
                filtrarDatos={() =>
                  DATOS_FILTRADOS(
                    originalData,
                    initialDate,
                    finalDate,
                    setFilteredDates
                  )
                }
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
