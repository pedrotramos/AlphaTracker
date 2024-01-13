import { ResponsiveLine } from "@nivo/line";
import { Box, Skeleton, useTheme } from "@mui/material";
import { tokens } from "../theme";
import CircleIcon from "@mui/icons-material/Circle";
import { useState, useEffect } from "react";

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_API_PORT;
const username = process.env.REACT_APP_API_AUTH_USERNAME;
const password = process.env.REACT_APP_API_AUTH_PASSWORD;

async function getPerfHistory(endpoint, ticker_code, equity_id) {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(
    url +
      ":" +
      port +
      endpoint +
      "?ticker_code=" +
      ticker_code +
      "&equity_id=" +
      equity_id,
    {
      headers: auth,
    }
  ).then((res) => res.json());
  return data;
}

const AssetPerformanceChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [queried, setQueried] = useState(props["queried"]);
  const [perfHistory, setPerfHistory] = useState(undefined);

  useEffect(() => {
    const fetchData = async (ticker, equity_id) => {
      var perf = await getPerfHistory("/asset-return", ticker, equity_id);
      setPerfHistory(perf);
      setQueried(true);
    };
    if (!queried) {
      if (typeof props !== "undefined") {
        fetchData(props["ticker_code"], props["equity_id"]);
      }
    }
  }, [props, queried]);
  if (typeof perfHistory === "undefined") {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
      />
    );
  } else {
    return (
      <ResponsiveLine
        data={perfHistory}
        theme={{
          crosshair: {
            line: {
              stroke: colors.primary[900],
            },
          },
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          grid: {
            line: {
              stroke: colors.primary[600],
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: "#000000",
            },
          },
        }}
        colors={{ scheme: "category10" }}
        margin={{ top: 50, right: 50, bottom: 70, left: 70 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%dT%H:%M:%S",
          precision: "day",
        }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2%"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          format: "%d/%m/%Y",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 45,
          legend: "Date", // added
          legendOffset: 56,
          legendPosition: "middle",
        }}
        axisLeft={{
          format: (value) => `${(value * 100).toExponential()}%`,
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Return",
          legendOffset: -65,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={true}
        pointSize={0}
        pointColor={{ from: "color", modifiers: [] }}
        pointBorderWidth={0}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        tooltip={({ point }) => {
          return (
            <div
              style={{
                color: "#000000",
                background: "white",
                padding: "9px 12px",
                border: "1px solid #ccc",
              }}
            >
              <Box display="flex" height="25px" alignItems="center">
                <CircleIcon sx={{ color: point.color }} />
                <p style={{ marginLeft: "8px" }}>{point.serieId}</p>
              </Box>
              <div>Timestamp: {point.data.x.toLocaleString("pt-BR")}</div>
              <div>Return: {(point.data.y * 100).toFixed(2)}%</div>
            </div>
          );
        }}
        legends={[
          {
            anchor: "top",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -40,
            itemsSpacing: 20,
            itemDirection: "top-to-bottom",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 8,
            symbolShape: "square",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    );
  }
};

export default AssetPerformanceChart;
