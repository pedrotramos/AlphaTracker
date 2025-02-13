import { Skeleton, useTheme } from "@mui/material";
import { ResponsiveRadar } from "@nivo/radar";
import { tokens } from "../theme";

const FactorRadioChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!props.data) {
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
      <ResponsiveRadar
        data={Object.keys(props.data)
          .filter((key) => key !== "ticker")
          .map((dimension) => ({
            dimension:
              dimension.charAt(0).toUpperCase() +
              dimension.slice(1).toLowerCase(),
            [props.data.ticker]: props.data[dimension],
          }))}
        keys={[props.data.ticker]}
        indexBy="dimension"
        theme={{
          axis: {
            ticks: {
              text: {
                fill: colors.grey[100],
              },
            },
          },
          tooltip: {
            container: {
              color: "#000000",
            },
          },
        }}
        valueFormat=">-.2f"
        maxValue={10}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: "color" }}
        gridLabelOffset={36}
        dotSize={7}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        colors={{ scheme: "category10" }}
        blendMode="normal"
        motionConfig="wobbly"
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: "#999",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    );
  }
};

export default FactorRadioChart;
