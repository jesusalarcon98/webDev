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
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

Chart.register(CategoryScale);

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#ebf5f6",
    minHeight: "100vh", // Mínimo alto de la ventana
    display: "flex",
    flexDirection: "column",
  },
  container: {
    backgroundColor: "white",
    padding: theme.spacing(3),
    borderRadius: "8px",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    flex: 1,
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  fullscreenContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5", // Color de fondo azul claro
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Oculta las barras de desplazamiento horizontal y vertical
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "20px", // Espacio entre el título y el gráfico
    overflow: "hidden",
    align: "center",
  },
  chartContainer: {
    width: "85%", // El gráfico ocupa el 80% del ancho disponible
    flexGrow: 1, // El gráfico crecerá para llenar el espacio restante
    overflow: "hidden",
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

  // Llama a la función dentro de un efecto cuando selectedOption cambia
  useEffect(() => {
    if (selectedOption) {
      llamarDatosEstado(selectedOption);
      filtrarDatos();
    }
  }, [selectedOption]); // Dependencia: selectedOption

  // Maneja el cambio de la opción seleccionada
  const handleChange = (event) => {
    const selectedOption = event.target.value.toLowerCase();
    setSelectedOption(selectedOption);
  };

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
    <div className={classes.fullscreenContainer}>
      <div className={classes.title}>
        Estadística de COVID en Estados Unidos
      </div>

      <div className={classes.chartContainer}>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justifyContent="space-around">
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
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Fecha inicial"
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
                label="Fecha final"
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
        <Line data={chartData} className={classes.Line} />
      </div>
    </div>
    /*   <div className={classes.root}>
      <CssBaseline />
      <Container className={classes.container} maxWidth="md">
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justifyContent="space-around">
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
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Fecha inicial"
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
                label="Fecha final"
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
      </Container>
    </div> */
  );
}

export default App;
