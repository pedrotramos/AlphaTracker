import { Box } from "@mui/material";

const AumStatBox = ({ title, aum, icon, mom_change, trendIcon }) => {
  return (
    <Box
      width="100%"
      m="0 30px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <Box>
          {icon}
          {title}
        </Box>
        {aum}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt="2px"
      >
        <Box display="flex" justifyContent="right">
          {trendIcon}
        </Box>
        {mom_change}
      </Box>
    </Box>
  );
};

export default AumStatBox;
