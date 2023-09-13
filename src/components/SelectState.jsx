import { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import axios from "axios";


const SelectState = ({ setCambiarFechas, filtrarDatos, llamarDatosEstado }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [dataCovidStates, setDataCovidStates] = useState([]);

  const handleChange = (event) => {
    const selectedOption = event.target.value.toLowerCase();
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    if (selectedOption) {
      llamarDatosEstado(selectedOption);
      filtrarDatos();
    }
  }, [selectedOption]); 

  useEffect(() => {
    axios
      .get("https://api.covidtracking.com/v1/states/current.json")
      .then((response) => {
        setDataCovidStates(response.data);
        setCambiarFechas(false);
      })
      .catch((error) => {
        console.log("Data missed", error);
      });
  }, [setCambiarFechas]);
  return (
    <>
      <Select
        native
        onChange={handleChange}
        style={{ marginBottom: "8px", flexGrow: ".5" }}
      >
        <option aria-label="None" value=""></option>

        {dataCovidStates.map((data) => (
          <option key={data.state} value={data.state} name={data.state}>
            {data.state}
          </option>
        ))}
      </Select>
    </>
  );
};

export default SelectState;
