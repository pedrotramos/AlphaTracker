import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const FundBox = ({ title, total, short, long, expected, icon }) => {
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
          {icon}
          {title}
        </Box>
      </Box>
      <Box
        width="100%"
        flexGrow={1}
        display="grid"
        gridTemplateColumns="1fr"
        gridTemplateRows="1fr 1fr 1fr 1fr"
      >
        <Box
          gridRow="span 1"
          gridColumn="span 1"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 20px"
        >
          <Typography variant="h5">Long:</Typography>
          {long}
        </Box>
        <Box
          gridRow="span 1"
          gridColumn="span 1"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 20px"
        >
          <Typography variant="h5">Short:</Typography>
          {short}
        </Box>
        <Box
          gridRow="span 1"
          gridColumn="span 1"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 20px"
        >
          <Typography variant="h5" sx={{ color: colors.grey[300] }}>
            Expected:
          </Typography>
          {expected}
        </Box>
        <Box
          gridRow="span 1"
          gridColumn="span 1"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="0 20px"
        >
          <Typography variant="h5" fontWeight="bold">
            Total:
          </Typography>
          {total}
        </Box>
      </Box>
    </Box>
  );
};

export default FundBox;
