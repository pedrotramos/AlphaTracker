import { ResponsiveLine } from "@nivo/line";
import { Box, Skeleton, useTheme } from "@mui/material";
import { tokens } from "../theme";
import CircleIcon from "@mui/icons-material/Circle";

const LivePerformanceChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (typeof props === "undefined") {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
      />
    );
  } else if (typeof props["data"] === "undefined") {
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
        data={props["data"]}
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
        margin={{ top: 50, right: 50, bottom: 50, left: 75 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%dT%H:%M:%S.%LZ",
          precision: "millisecond",
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
          format: "%H:%M:%S",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Time", // added
          legendOffset: 36,
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
          legendOffset: -60,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={true}
        pointSize={5}
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
            symbolShape: "circle",
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

export default LivePerformanceChart;
