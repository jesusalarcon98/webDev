import { KeyboardDatePicker } from "@material-ui/pickers";

const PickerDate = ({ minDate, value, maxDate, setDates }) => {
  const handleDate = (date) => {
    setDates(date);
  };

  return (
    <KeyboardDatePicker
      margin="normal"
      id="date-picker-dialog"
      label="Fecha inicial"
      format="MM/dd/yyyy"
      minDate={minDate}
      value={value}
      maxDate={maxDate}
      onChange={(date) => {
        handleDate(date);
      }}
      KeyboardButtonProps={{
        "aria-label": "change date",
      }}
    />
  );
};

export default PickerDate;
