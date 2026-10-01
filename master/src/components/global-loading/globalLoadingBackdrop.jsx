import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { useGlobalLoading } from "./loadingContext";

export function GlobalLoadingBackdrop() {
  const { loading, message } = useGlobalLoading();

  return (
    <Backdrop
      open={loading}
      sx={{
        zIndex: 20000,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(3px)",
        bgcolor: "rgba(0,0,0,0.6)",
      }}
    >
      <CircularProgress color="inherit" sx={{ mb: 2 }} />
      <Typography variant="h6">{message || "Processing request…"}</Typography>
       <Typography variant="h6">Please wait...</Typography>
    </Backdrop>
  );
}