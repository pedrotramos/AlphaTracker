import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StarIcon from "@mui/icons-material/Star";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import AumBarChart from "../../components/AumBarChart";
import AumPieChart from "../../components/AumPieChart";
import AumStatBox from "../../components/AumStatBox";
import { tokens } from "../../theme";
import Header from "../global/Header";
import { faker } from "@faker-js/faker";

function genAumAumStatBoxes(data, colors, theme) {
  const icons = {
    SHIELD: (
      <ShieldOutlinedIcon
        sx={{ color: colors.blueAccent[600], fontSize: "32px" }}
      />
    ),
    ROCKET: (
      <RocketLaunchIcon
        sx={{ color: colors.blueAccent[600], fontSize: "32px" }}
      />
    ),
    STAR: <StarIcon sx={{ color: colors.blueAccent[600], fontSize: "32px" }} />,
    TOTAL: (
      <SavingsOutlinedIcon
        sx={{ color: colors.blueAccent[600], fontSize: "32px" }}
      />
    ),
  };
  var boxes = [];
  data.forEach((obj, idx) => {
    boxes.push(
      <Box
        gridColumn={{
          xs: "span 12",
          sm: "span 6",
          md: "span 3",
        }}
        backgroundColor={
          theme.palette.mode === "dark"
            ? colors.primary[400]
            : colors.primary[400]
        }
        display="flex"
        alignItems="center"
        justifyContent="center"
        key={`aum-stat-box-${idx}`}
      >
        <AumStatBox
          icon={icons[obj["family_name"]]}
          title={
            <Typography variant="h5" sx={{ color: colors.blueAccent[500] }}>
              {obj["family_name"]}
            </Typography>
          }
          aum={
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: colors.grey[100] }}
            >
              AUM: {(obj["aum"] / 1000000).toFixed(1)} MM
            </Typography>
          }
          trendIcon={
            <Box>
              {obj["pct_change"] >= 0.00005 ? (
                <TrendingUpIcon
                  sx={{ color: colors.greenAccent[500], fontSize: "50px" }}
                />
              ) : obj["pct_change"] <= -0.00005 ? (
                <TrendingDownIcon
                  sx={{ color: colors.redAccent[500], fontSize: "50px" }}
                />
              ) : (
                <ArrowRightAltIcon
                  sx={{ color: colors.grey[400], fontSize: "50px" }}
                />
              )}
            </Box>
          }
          mom_change={
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color:
                    obj["pct_change"] >= 0.00005
                      ? colors.greenAccent[500]
                      : obj["pct_change"] <= -0.00005
                      ? colors.redAccent[500]
                      : colors.grey[400],
                  textAlign: "center",
                }}
                mt={-1}
              >
                {obj["pct_change"] >= 0.00005
                  ? `+${(obj["pct_change"] * 100).toFixed(2)}%`
                  : `${(obj["pct_change"] * 100).toFixed(2)}%`}
              </Typography>
              <Typography sx={{ color: colors.grey[100], textAlign: "center" }}>
                MoM
              </Typography>
            </Box>
          }
        />
      </Box>
    );
  });
  return boxes;
}

const Aum = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      var apiData = {
        current: [
          {
            family_name: "ROCKET",
            aum: faker.number.int({ min: 170000000, max: 200000000 }),
            pct_change: faker.number.float({ min: -0.1, max: 0.1 }),
          },
          {
            family_name: "SHIELD",
            aum: faker.number.int({ min: 30000000, max: 40000000 }),
            pct_change: faker.number.float({ min: -0.1, max: 0.1 }),
          },
          {
            family_name: "STAR",
            aum: faker.number.int({ min: 10000000, max: 20000000 }),
            pct_change: faker.number.float({ min: -0.1, max: 0.1 }),
          },
        ],
      };
      apiData.current.push({
        family_name: "TOTAL",
        aum: apiData.current.reduce((total, fund) => total + fund.aum, 0),
        pct_change:
          apiData.current.reduce(
            (total, fund) => total + fund.pct_change * fund.aum,
            0
          ) / apiData.current.reduce((total, fund) => total + fund.aum, 0),
      });

      const totalAum = apiData.current
        .filter((f) => f.family_name !== "TOTAL")
        .reduce((total, fund) => total + fund.aum, 0);
      apiData.shares = apiData.current
        .filter((f) => f.family_name !== "TOTAL")
        .map((fund) => ({
          family_name: fund.family_name,
          share: (fund.aum / totalAum) * 100,
        }));

      const generateMonthlyHistory = () => {
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          date.setDate(1);
          if (i === 0) {
            date.setDate(new Date().getDate());
          }
          return {
            date: `${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`,
            ROCKET:
              i === 0
                ? apiData.current.find((f) => f.family_name === "ROCKET").aum
                : faker.number.int({ min: 170000000, max: 200000000 }),
            SHIELD:
              i === 0
                ? apiData.current.find((f) => f.family_name === "SHIELD").aum
                : faker.number.int({ min: 30000000, max: 40000000 }),
            STAR:
              i === 0
                ? apiData.current.find((f) => f.family_name === "STAR").aum
                : faker.number.int({ min: 10000000, max: 20000000 }),
          };
        }).reverse();
      };

      apiData.history = generateMonthlyHistory();
      setData(apiData);
    };
    fetchData();
  }, []);

  return (
    <Box m="20px" ml="100px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="ASSETS UNDER MANAGEMENT"
          subtitle="Overview of the AUM"
        />
      </Box>

      {/* GRID & CHARTS */}
      {typeof data === "undefined" ? (
        // Skeleton
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
          mt="20px"
        >
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              md: "span 3",
            }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AumStatBox
              title={<Skeleton animation="wave" width="100px" height="30px" />}
              aum={<Skeleton animation="wave" width="100px" height="30px" />}
              mom_change={
                <Skeleton animation="wave" width="60px" height="50px" />
              }
              trendIcon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="50px"
                  height="50px"
                />
              }
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
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
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AumStatBox
              title={<Skeleton animation="wave" width="100px" height="30px" />}
              aum={<Skeleton animation="wave" width="100px" height="30px" />}
              mom_change={
                <Skeleton animation="wave" width="60px" height="50px" />
              }
              trendIcon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="50px"
                  height="50px"
                />
              }
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
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
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AumStatBox
              title={<Skeleton animation="wave" width="100px" height="30px" />}
              aum={<Skeleton animation="wave" width="100px" height="30px" />}
              mom_change={
                <Skeleton animation="wave" width="60px" height="50px" />
              }
              trendIcon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="50px"
                  height="50px"
                />
              }
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
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
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AumStatBox
              title={<Skeleton animation="wave" width="100px" height="30px" />}
              aum={<Skeleton animation="wave" width="100px" height="30px" />}
              mom_change={
                <Skeleton animation="wave" width="60px" height="50px" />
              }
              trendIcon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="50px"
                  height="50px"
                />
              }
              icon={
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width="30px"
                  height="30px"
                />
              }
            />
          </Box>
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              lg: "span 8",
            }}
            gridRow={{
              xs: "span 2",
              lg: "span 3",
            }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="grid"
            gridTemplateRows="25px calc(100% - 25px)"
            gridTemplateColumns="100%"
            padding="20px"
          >
            <Skeleton
              animation="wave"
              width="200px"
              height="30px"
              sx={{ marginLeft: "5px" }}
            />
            <Box marginTop="15px">
              <AumBarChart data={data} />
            </Box>
          </Box>
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              lg: "span 4",
            }}
            gridRow={{
              xs: "span 2",
              lg: "span 3",
            }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="grid"
            gridTemplateRows="25px calc(100% - 25px)"
            gridTemplateColumns="100%"
            padding="20px"
            mb={{
              xs: "15px",
              sm: "0",
            }}
          >
            <Skeleton
              animation="wave"
              width="200px"
              height="30px"
              sx={{ marginLeft: "5px" }}
            />
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop="15px"
            >
              <AumPieChart data={data} />
            </Box>
          </Box>
        </Box>
      ) : (
        // Real
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
          mt="20px"
        >
          {genAumAumStatBoxes(data["current"], colors, theme)}
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              lg: "span 8",
            }}
            gridRow={{
              xs: "span 2",
              lg: "span 3",
            }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="grid"
            gridTemplateRows="25px calc(100% - 25px)"
            gridTemplateColumns="100%"
            padding="20px"
          >
            <Typography
              variant="h5"
              fontWeight="600"
              gridRow="0"
              marginLeft="5px"
            >
              AUM in the last 12 months
            </Typography>
            <Box>
              <AumBarChart data={data} />
            </Box>
          </Box>
          <Box
            gridColumn={{
              xs: "span 12",
              sm: "span 6",
              lg: "span 4",
            }}
            gridRow={{
              xs: "span 2",
              lg: "span 3",
            }}
            backgroundColor={
              theme.palette.mode === "dark"
                ? colors.primary[400]
                : colors.primary[400]
            }
            display="grid"
            gridTemplateRows="25px calc(100% - 25px)"
            gridTemplateColumns="100%"
            padding="20px"
            mb={{
              xs: "15px",
              sm: "0",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              gridRow="0"
              marginLeft="5px"
            >
              AUM distribution
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
              <AumPieChart data={data["shares"]} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Aum;
