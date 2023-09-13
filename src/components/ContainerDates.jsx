import useStyles from "../Styles/styles";
import FormControl from "@material-ui/core/FormControl";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import InputChart from "./InputChart";

const ContainerDates = () => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="space-around">
          <InputChart />
        </Grid>
      </MuiPickersUtilsProvider>
    </FormControl>
  );
};

export default ContainerDates;
