import * as d3 from "d3";
import { bubbleData } from "../data/bubbleData";
import { lineChartData, lineChartData2020 } from "../data/lineChartData";
import { stackedSubGroups, stackedSubGroupsAlt } from "../data/stackedBarData";
export const replotFunction = (chartId, svg, plotObj, legend = null) => {
  switch (chartId) {
    case "scatter-svg":
      if (plotObj.xLabel() === "Petal Length") {
        plotObj
          .xValue("petalWidth")
          .xLabel("Petal Width")
          .yValue("petalLength")
          .yLabel("Petal Length");

        svg.call(plotObj);
      } else {
        plotObj
          .xValue("petalLength")
          .xLabel("Petal Length")
          .yValue("sepalLength")
          .yLabel("Sepal Length");

        svg.call(plotObj);
      }
      break;
    case "bar-svg":
      if (plotObj.yLabel() === "Quantity") {
        plotObj
          .yValue("quality")
          .yLabel("Quality")
          .title("Quality of fruit in the Store inventory")
          .color("#fdcb6e");
        svg.call(plotObj);
      } else {
        plotObj
          .yValue("quantity")
          .yLabel("Quantity")
          .title("Quantity of fruit in the Store inventory")
          .color("#e17055");
        svg.call(plotObj);
      }
      break;
    case "line-svg":
      if (
        plotObj.title() ===
        "Line chart showing example data about 3 different cities in 2016"
      ) {
        plotObj
          .title(
            "Line chart showing example data about 3 different cities in 2020"
          )
          .data(lineChartData2020);
        svg.call(plotObj);
      } else {
        plotObj
          .title(
            "Line chart showing example data about 3 different cities in 2016"
          )
          .data(lineChartData);
        svg.call(plotObj);
      }
      break;
    case "stacked-bar-svg":
      if (plotObj.subGroups() == stackedSubGroups) {
        plotObj.subGroups(stackedSubGroupsAlt);
        legend.ySeries(stackedSubGroupsAlt).x(0.1);
        svg.call(plotObj);
        svg.call(legend);
      } else {
        plotObj.subGroups(stackedSubGroups);
        legend.ySeries(stackedSubGroups).x(0.8);
        svg.call(plotObj);
        svg.call(legend);
      }
      break;
    case "bubble-svg":
      // console.log(plotObj);
      // console.log(plotObj.clustered());
      if (plotObj.clustered()) {
        plotObj
          .clustered(false)
          .data(bubbleData.slice(0, 5))
          .title("Top 5 Countries by GDP");
        svg.call(plotObj);
      } else {
        console.log("here");
        plotObj.clustered(true).data(bubbleData).title("GDP of Countries");
        svg.call(plotObj);
      }
      break;
    case "activity-svg":
      console.log(plotObj.colors());
      if (plotObj.title() === "Number of Activities per week in 2024") {
        console.log(true);
        plotObj
          .colorRange(() => [0, 5, 10])
          .year(2023)
          .colors([
            d3.interpolateRdYlGn(0),
            d3.interpolateRdYlGn(0.5),
            d3.interpolateRdYlGn(1),
          ])
          .title(
            "Number of activities per week in 2023, colored by proximity to target (5 p/w)"
          );
        svg.call(plotObj);
      } else {
        console.log(false);
        plotObj
          .year(2024)
          .colorRange(() => [
            0,
            d3.max(plotObj.data(), (d) => d[plotObj.colorValue()]),
          ])
          .colors([d3.interpolateGreens(0), d3.interpolateGreens(1)])
          .title("Number of Activities per week in 2024");

        svg.call(plotObj);
      }
  }
};
