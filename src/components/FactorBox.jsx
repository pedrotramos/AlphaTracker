import PentagonOutlinedIcon from "@mui/icons-material/PentagonOutlined";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

function fillBox(data, colors, theme) {
  var bgRed =
    theme.palette.mode === "dark"
      ? colors.redAccent[500]
      : colors.redAccent[400];
  var bgGreen =
    theme.palette.mode === "dark"
      ? colors.greenAccent[600]
      : colors.greenAccent[500];
  var frs;
  var entries = [];
  Object.keys(data).forEach(function (key, idx) {
    entries.push(
      <Box
        gridRow="span 1"
        gridColumn="span 1"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 20px"
        key={`${key}-box-live`}
      >
        <Typography variant="h5">
          {key.charAt(0).toUpperCase() + key.slice(1)}:
        </Typography>
        <Typography
          variant="h5"
          sx={{
            backgroundColor:
              data[key] >= 0.00005
                ? bgGreen
                : data[key] <= -0.00005
                ? bgRed
                : colors.primary[600],
            borderRadius: "5px",
            padding: "5px 10px",
            width: "65px",
            textAlign: "center",
          }}
        >
          {(data[key] * 100).toFixed(2)}%
        </Typography>
      </Box>
    );
  });
  const n = Object.keys(data).length;
  frs = Array(n).fill("1fr");
  frs = frs.join(" ");
  const obj = (
    <Box
      width="100%"
      flexGrow={1}
      display="grid"
      gridTemplateColumns="1fr"
      gridTemplateRows={frs}
    >
      {entries}
    </Box>
  );
  return obj;
}

const FactorBox = ({ title, data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      width="100%"
      height="100%"
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box mb="10px">
        <Box display="flex" alignItems="center">
          <PentagonOutlinedIcon
            sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
          />
          <Typography
            variant="h5"
            sx={{ color: colors.blueAccent[500], marginLeft: "10px" }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      {typeof data === "undefined" ? (
        <Box
          width="100%"
          flexGrow={1}
          display="grid"
          gridTemplateColumns="1fr"
          gridTemplateRows="1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        >
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
          <Box
            gridRow="span 1"
            gridColumn="span 1"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 20px"
          >
            <Skeleton animation="wave" width="40%" height="25px" />
            <Skeleton animation="wave" width="65px" height="35px" />
          </Box>
        </Box>
      ) : (
        fillBox(data, colors, theme)
      )}
    </Box>
  );
};

export default FactorBox;
