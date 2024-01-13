import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import FactorBox from "../../components/FactorBox";
import FundBox from "../../components/FundBox";
import LastUpdateBox from "../../components/LastUpdateBox";
import LivePerformanceChart from "../../components/LivePerformanceChart";
import { tokens } from "../../theme";
import Header from "../global/Header";
import { Skeleton, Typography } from "@mui/material";

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_API_PORT;
const username = process.env.REACT_APP_API_AUTH_USERNAME;
const password = process.env.REACT_APP_API_AUTH_PASSWORD;

async function getFromAPI(endpoint) {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(url + ":" + port + endpoint, {
    headers: auth,
  }).then((res) => res.json());
  return data;
}

function genFundBoxes(data, colors, theme) {
  var bgRed =
    theme.palette.mode === "dark"
      ? colors.redAccent[500]
      : colors.redAccent[400];
  var bgGreen =
    theme.palette.mode === "dark"
      ? colors.greenAccent[600]
      : colors.greenAccent[500];
  const icons = {
    DEFENDER: (
      <ShieldOutlinedIcon
        sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
      />
    ),
    "DEFENDER PREV": (
      <BeachAccessOutlinedIcon
        sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
      />
    ),
    MULTIFACTOR: (
      <HubOutlinedIcon
        sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
      />
    ),
  };
  var boxes = [];
  Object.keys(data).forEach(function (key, idx) {
    boxes.push(
      <Box
        gridColumn={{
          xs: "span 12",
          sm: "span 6",
          md: "span 3",
        }}
        gridRow={{
          xs: "span 2",
          sm: "span 3",
        }}
        backgroundColor={
          theme.palette.mode === "dark"
            ? colors.primary[400]
            : colors.primary[400]
        }
        display="flex"
        alignItems="center"
        justifyContent="center"
        key={`fund-box-${idx}`}
      >
        <FundBox
          icon={icons[key]}
          title={
            <Typography
              variant="h5"
              sx={{ color: colors.blueAccent[500], marginLeft: "10px" }}
            >
              {key}
            </Typography>
          }
          short={
            <Typography
              variant="h5"
              sx={{
                backgroundColor:
                  data[key]["short"] >= 0.00005
                    ? bgGreen
                    : data[key]["short"] <= -0.00005
                    ? bgRed
                    : colors.primary[600],
                borderRadius: "5px",
                padding: "5px 10px",
                width: "65px",
                textAlign: "center",
              }}
            >
              {(data[key]["short"] * 100).toFixed(2)}%
            </Typography>
          }
          long={
            <Typography
              variant="h5"
              sx={{
                backgroundColor:
                  data[key]["long"] >= 0.00005
                    ? bgGreen
                    : data[key]["long"] <= -0.00005
                    ? bgRed
                    : colors.primary[600],
                borderRadius: "5px",
                padding: "5px 10px",
                width: "65px",
                textAlign: "center",
              }}
            >
              {(data[key]["long"] * 100).toFixed(2)}%
            </Typography>
          }
          expected={
            <Typography
              variant="h5"
              sx={{
                backgroundColor:
                  data[key]["expected"] >= 0.00005
                    ? bgGreen
                    : data[key]["expected"] <= -0.00005
                    ? bgRed
                    : colors.primary[600],
                borderRadius: "5px",
                padding: "5px 10px",
                width: "65px",
                textAlign: "center",
              }}
            >
              {(data[key]["expected"] * 100).toFixed(2)}%
            </Typography>
          }
          total={
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                backgroundColor:
                  data[key]["total"] >= 0.00005
                    ? bgGreen
                    : data[key]["total"] <= -0.00005
                    ? bgRed
                    : colors.primary[600],
                borderRadius: "5px",
                padding: "5px 10px",
                width: "65px",
                textAlign: "center",
              }}
            >
              {(data[key]["total"] * 100).toFixed(2)}%
            </Typography>
          }
        />
      </Box>
    );
  });
  return boxes;
}

const LivePerformance = () => {
  const mobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fundsData, setFundsData] = useState(undefined);
  const [timestamp, setTimestamp] = useState(undefined);
  const [tsData, setTsData] = useState(undefined);
  const [factorData, setFactorData] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      // Get fund data
      var ts;
      const fundData = await getFromAPI("/funds");
      var fundMetrics = {};
      for (var i = 0; i < fundData.length; i++) {
        if (!(fundData[i]["family_name"] in fundMetrics)) {
          fundMetrics[fundData[i]["family_name"]] = {};
        }
        fundMetrics[fundData[i]["family_name"]][fundData[i]["return_scope"]] =
          fundData[i]["return"];
        ts = fundData[i]["timestamp"];
      }
      ts = new Date(ts);
      const tz_offset = ts.getTimezoneOffset() * 60 * 1000;
      ts.setTime(ts.getTime() - tz_offset);
      setTimestamp(ts.toLocaleString("pt-BR"));
      setFundsData(fundMetrics);

      // Get factor data
      const factorData = await getFromAPI("/factors");
      var factorMetrics = {};
      for (i = 0; i < factorData.length; i++) {
        if (!(factorData[i]["factor_name"] in factorMetrics)) {
          factorMetrics[factorData[i]["factor_name"]] = {};
        }
        factorMetrics[factorData[i]["factor_name"]] = factorData[i]["return"];
      }
      setFactorData(factorMetrics);

      // Get timeseries data
      if (!mobile) {
        const timeseriesData = await getFromAPI("/timeseries");
        setTsData(timeseriesData);
      }
    };
    fetchData();
    const interval = setInterval(() => fetchData(), 150000); // Fetch every 2.5 min
    return () => {
      clearInterval(interval);
    };
  }, [mobile]);
  return (
    <Box m="20px" ml="100px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="LIVE PERFORMANCE" subtitle="View of Intraday Results" />
      </Box>

      {/* GRID & CHARTS */}
      {typeof fundsData === "undefined" ? (
        // Skeleton
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows={{ xs: "125px", sm: "75px" }}
          gap="20px"
          mt="20px"
        >
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 2", sm: "span 3" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FundBox
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  width="100px"
                  height="30px"
                  sx={{ marginLeft: "10px" }}
                />
              }
              short={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              long={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              expected={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              total={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 2", sm: "span 3" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FundBox
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  width="100px"
                  height="30px"
                  sx={{ marginLeft: "10px" }}
                />
              }
              short={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              long={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              expected={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              total={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 2", sm: "span 3" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FundBox
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  width="100px"
                  height="30px"
                  sx={{ marginLeft: "10px" }}
                />
              }
              short={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              long={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              expected={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
              total={
                <Skeleton
                  animation="wave"
                  width="65px"
                  height="35px"
                  sx={{ marginLeft: "10px", padding: "5px 10px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 3", sm: "span 4" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FactorBox title="FACTORS" />
          </Box>
          {!mobile ? (
            <Box
              gridColumn="span 9"
              gridRow="span 4"
              backgroundColor={
                theme.palette.mode === "dark"
                  ? colors.primary[400]
                  : colors.primary[400]
              }
              display="grid"
              gridTemplateRows="100%"
              gridTemplateColumns="100%"
              padding="20px"
            >
              <Box>
                <LivePerformanceChart data={tsData} />
              </Box>
            </Box>
          ) : undefined}
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 2", sm: "span 2" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={{
              xs: "15px",
              sm: "0",
            }}
          >
            <LastUpdateBox title="INFORMATION" data={timestamp} />
          </Box>
        </Box>
      ) : (
        // Real
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows={{ xs: "125px", sm: "75px" }}
          gap="20px"
          mt="20px"
        >
          {genFundBoxes(fundsData, colors, theme)}
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 3", sm: "span 4" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FactorBox title="FACTORS" data={factorData} />
          </Box>
          {!mobile ? (
            <Box
              gridColumn="span 9"
              gridRow="span 4"
              backgroundColor={
                theme.palette.mode === "dark"
                  ? colors.primary[400]
                  : colors.primary[400]
              }
              display="grid"
              gridTemplateRows="100%"
              gridTemplateColumns="100%"
              padding="20px"
            >
              <Box>
                <LivePerformanceChart data={tsData} />
              </Box>
            </Box>
          ) : undefined}
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            gridRow={{ xs: "span 2", sm: "span 2" }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={{
              xs: "15px",
              sm: "0",
            }}
          >
            <LastUpdateBox title="INFORMATION" data={timestamp} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LivePerformance;
