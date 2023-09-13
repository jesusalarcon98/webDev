import { useState } from "react";

import { KeyboardDatePicker } from "@material-ui/pickers";

const PickerDate = ({ minDate, value, maxDate, onChange }) => {
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
        onChange(date);
      }}
      KeyboardButtonProps={{
        "aria-label": "change date",
      }}
    />
  );
};

export default PickerDate;
