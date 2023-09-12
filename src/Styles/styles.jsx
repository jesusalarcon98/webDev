import { makeStyles } from "@material-ui/core/styles";

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
    width: "70%", // El gráfico ocupa el 80% del ancho disponible
    flexGrow: 1, // El gráfico crecerá para llenar el espacio restante
    overflowX: "hidden",
  },
}));

export default useStyles;
