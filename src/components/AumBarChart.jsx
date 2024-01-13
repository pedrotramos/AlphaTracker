import { Skeleton, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { BasicTooltip } from "@nivo/tooltip";

const AumBarChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (typeof props["data"] === "undefined") {
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
      <ResponsiveBar
        data={props["data"]["history"]}
        theme={{
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
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            basic: {
              color: "#000000",
            },
          },
          grid: {
            line: {
              stroke: colors.primary[600],
            },
          },
        }}
        keys={props["data"]["keys"]}
        indexBy="date"
        margin={{ top: 10, right: 30, bottom: 70, left: 55 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "category10" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 90,
          legend: "Months",
          legendPosition: "middle",
          legendOffset: 65,
        }}
        axisLeft={{
          format: (value) => `${(value / 1000000).toFixed(0)}`,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "AUM (MM)",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        tooltip={(props) => {
          return (
            <BasicTooltip
              id={props.id}
              value={`${(props.value / 1000000).toFixed(2)} MM at ${
                props.indexValue
              }`}
              color={props.color}
              enableChip
            />
          );
        }}
        enableLabel={false}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function (e) {
          return (
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          );
        }}
      />
    );
  }
};

export default AumBarChart;
