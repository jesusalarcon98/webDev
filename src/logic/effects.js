import axios from "axios";

export const llamarDatosGenerales = (
  setDataCovid,
  setOriginalData,
  setCambiarFechas,
  setIsLoading
) => {
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

export const llamarDatosEstado = (
  selectedOption,
  setDataCovid,
  setOriginalData,
  setCambiarFechas,
  setIsLoading
) => {
  axios
    .get(`https://api.covidtracking.com/v1/states/${selectedOption}/daily.json`)
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
