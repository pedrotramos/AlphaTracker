import { ResponsiveLine } from "@nivo/line";
import { Box, Skeleton, useTheme } from "@mui/material";
import { tokens } from "../theme";
import CircleIcon from "@mui/icons-material/Circle";
import { useState } from "react";
import { faker } from "@faker-js/faker";

const AssetPerformanceChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [queried, setQueried] = useState(props["queried"]);

  if (!queried) {
    if (typeof props !== "undefined") {
      setQueried(true);
    }
  }

  const generatePerfHistory = () => {
    let cumulativeReturn = 0;
    return [
      {
        id: "Performance",
        data: Array.from({ length: 5 * 365 }, (_, i) => {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          if (date instanceof Date && !isNaN(date)) {
            // Ensure date is valid
            date.setMilliseconds(0);
            const dailyReturn = faker.number.float({
              min: -0.1,
              max: 0.1,
              precision: 0.0001,
            });
            cumulativeReturn += dailyReturn;
            return {
              x: date.toISOString().split("T")[0],
              y: cumulativeReturn.toFixed(4),
            };
          }
          return null; // Return null if date is invalid
        })
          .filter((entry) => entry !== null) // Filter out null entries
          .reverse(),
      },
    ];
  };

  const perfHistory = generatePerfHistory();

  if (!perfHistory || perfHistory.length === 0) {
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
          format: "%Y-%m-%d",
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
          legend: "Date",
          legendOffset: 56,
          legendPosition: "middle",
        }}
        axisLeft={{
          format: (value) => `${(value * 100).toFixed(2)}%`,
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
      />
    );
  }
};

export default AssetPerformanceChart;
