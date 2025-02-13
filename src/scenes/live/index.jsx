import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StarIcon from "@mui/icons-material/Star";
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
import { faker } from "@faker-js/faker";

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
    SHIELD: (
      <ShieldOutlinedIcon
        sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
      />
    ),
    ROCKET: (
      <RocketLaunchIcon
        sx={{ color: colors.blueAccent[600], fontSize: "26px" }}
      />
    ),
    STAR: <StarIcon sx={{ color: colors.blueAccent[600], fontSize: "26px" }} />,
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
      const currentTimestamp = new Date();
      const formattedTimestamp = `${String(currentTimestamp.getDate()).padStart(
        2,
        "0"
      )}/${String(currentTimestamp.getMonth() + 1).padStart(
        2,
        "0"
      )}/${currentTimestamp.getFullYear()} ${String(
        currentTimestamp.getHours()
      ).padStart(2, "0")}:${String(currentTimestamp.getMinutes()).padStart(
        2,
        "0"
      )}:${String(currentTimestamp.getSeconds()).padStart(2, "0")}`;
      setTimestamp(formattedTimestamp);
      const fundMetrics = {};
      const fundNames = ["ROCKET", "SHIELD", "STAR"];
      const fundLongWeight = { ROCKET: 1, SHIELD: 0.5, STAR: 0.7 };
      fundNames.forEach((name) => {
        const short = faker.number.float({ min: -0.05, max: 0.05 });
        const long = faker.number.float({ min: -0.05, max: 0.05 });
        const total =
          fundLongWeight[name] * long + (1 - fundLongWeight[name]) * short;
        const expected =
          total * (1 + faker.number.float({ min: -0.05, max: 0.05 }));
        fundMetrics[name] = {
          long: fundLongWeight[name] * long,
          short: (1 - fundLongWeight[name]) * short,
          expected: expected,
          total: total,
        };
      });
      setFundsData(fundMetrics);

      // Get factor data
      const factorNames = [
        "MARKET",
        "MOMENTUM",
        "QUALITY",
        "SIZE",
        "VALUE",
        "VOLATILTY",
      ];
      var factorMetrics = {};
      factorNames.forEach((name) => {
        const value = faker.number.float({ min: -0.1, max: 0.1 });
        factorMetrics[name] = value;
      });
      setFactorData(factorMetrics);

      // Get timeseries data
      if (!mobile) {
        const timeseriesData = [...fundNames, "MARKET"].map((name) => ({
          id: name,
          data: [],
        }));

        const currentHour = currentTimestamp.getHours();
        const currentMinute = currentTimestamp.getMinutes();

        // Calculate the number of 5-minute intervals passed since midnight
        const fiveMinuteIntervalsSinceMidnight = Math.floor(
          (currentHour * 60 + currentMinute) / 5
        );

        // Adjust the number of data points to match the expected count
        timeseriesData.forEach((series) => {
          // Start from the current total return for each fund
          let currentValue;
          if (series.id === "MARKET") {
            currentValue = factorMetrics["MARKET"];
          } else {
            currentValue = fundMetrics[series.id].total;
          }

          // Calculate past data points starting at 12 AM
          for (let i = fiveMinuteIntervalsSinceMidnight - 1; i >= 0; i--) {
            series.data.unshift({
              x: new Date(
                currentTimestamp.setHours(0, i * 5, 0, 0)
              ).toISOString(),
              y: currentValue,
            });

            // Calculate the previous value by dividing by a float between 0.9 and 1.1
            currentValue /= 1 + faker.number.float({ min: -0.1, max: 0.1 });
          }
        });
        setTsData(timeseriesData);
      }
    };
    fetchData();
    const interval = setInterval(() => fetchData(), 300000); // Fetch every 5 min
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
