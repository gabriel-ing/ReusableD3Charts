import { lineChartData, lineChartData2020 } from "../data/lineChartData";
import { stackedSubGroups, stackedSubGroupsAlt } from "../data/stackedBarData";
export const replotFunction = (chartId, svg, plotObj, legend = null) => {
  switch (chartId) {
    case "scatter-svg":
      console.log(chartId);
      if (plotObj.xLabel() === "Petal Length") {
        plotObj
          .xValue((d) => d.petalWidth)
          .xLabel("Petal Width")
          .yValue((d) => d.petalLength)
          .yLabel("Petal Length");

        svg.call(plotObj);
      } else {
        plotObj
          .xValue((d) => d.petalLength)
          .xLabel("Petal Length")
          .yValue((d) => d.sepalLength)
          .yLabel("Sepal Length");

        svg.call(plotObj);
      }
      break;
    case "bar-svg":
      if (plotObj.yLabel() === "Quantity") {
        plotObj
          .yValue((d) => d.quality)
          .yLabel("Quality")
          .title("Quality of fruit in the Store inventory")
          .color("#fdcb6e");
        svg.call(plotObj);
      } else {
        plotObj
          .yValue((d) => d.quantity)
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
        legend.ySeries(stackedSubGroupsAlt).x(70);
        svg.call(plotObj);
        svg.call(legend);
      } else {
        plotObj.subGroups(stackedSubGroups);
        legend.ySeries(stackedSubGroups).x(430);
        svg.call(plotObj);
        svg.call(legend);
      }
      break;
  }
};
