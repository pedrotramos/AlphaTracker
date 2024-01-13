import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BloombergLogoLight from "../assets/bloomberg-logo-light.png";
import BloombergLogoDark from "../assets/bloomberg-logo-dark.png";

const FundBox = ({ title, data }) => {
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
          <InfoOutlinedIcon
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
      <Box
        width="100%"
        flexGrow={1}
        display="grid"
        gridTemplateColumns="1fr"
        gridTemplateRows="1fr 1fr"
      >
        <Box
          gridRow="span 1"
          gridColumn="span 1"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 20px"
        >
          <Typography variant="h5">Last update:</Typography>
          {typeof data === "undefined" ? (
            <Skeleton animation="wave" width="65px" />
          ) : (
            <Typography
              variant="h5"
              sx={{
                textAlign: "right",
              }}
            >
              {data}
            </Typography>
          )}
        </Box>
        <Box
          gridRow="span 1"
          gridColumn="span 1"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 20px"
        >
          <Typography variant="h5">Powered by:</Typography>
          {theme.palette.mode === "dark" ? (
            <img
              src={BloombergLogoDark}
              alt="Bloomberg Logo"
              height="25px"
            ></img>
          ) : (
            <img
              src={BloombergLogoLight}
              alt="Bloomberg Logo"
              height="25px"
            ></img>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FundBox;
