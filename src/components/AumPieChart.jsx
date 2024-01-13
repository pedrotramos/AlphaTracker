import { Skeleton, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";

const AumPieChart = (props) => {
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
      <ResponsivePie
        data={props["data"]}
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
        }}
        margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
        colors={{ scheme: "category10" }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={7}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        valueFormat={(value) => `${(value * 100).toFixed(2)}%`}
      />
    );
  }
};

export default AumPieChart;
