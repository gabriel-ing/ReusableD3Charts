import * as d3 from "d3";
import { scatterPlot } from "./charts/Scatterplot-trc.js";
import { barChart } from "./charts/barChart-trc.js";
import saveChart from "./utilities/saveChart.js";
import { lineChart } from "./charts/LineChart-trc.js";
import { legend } from "./utilities/legend.js";
import { stackedBarChart } from "./charts/StackedBar-trc.js";
import { stackedBarData, stackedSubGroups } from "./data/stackedBarData.js";
import { irisData, irisColorLegend } from "./data/irisData.js";
import { barChartData } from "./data/barChartData.js";
import { lineChartData, lineChartSeriesInfo } from "./data/lineChartData.js";
import { bubbleData, bubbleYSeries, bubbleColorPalette } from "./data/bubbleData.js";
import { activityMonitorSquares } from "./charts/activityMonitorSquares.js";
import moment from "moment";
import { replotFunction } from "./utilities/replot.js";
import { bubbleChart } from "./charts/bubbleChart-trc.js";
window.saveChart = saveChart;
const getWidthHeight = (chartId) => {
  const container = document.getElementById(chartId);
  return [container.offsetWidth, container.offsetHeight];
};
const appendSvg = (divID) => {
  const svg = d3
    .select("#" + divID)
    .append("svg")
    .attr("id", divID + "-svg");
  return svg;
};

const margin = { top: 50, right: 50, bottom: 80, left: 50 };

function main() {
  const arr = d3.range(1, 53);
  const newArr = arr.map((d) =>
    d < 10
      ? moment(`2024W0${d}`).format("DD-MM-YYYY")
      : moment(`2024W${d}`).format("DD-MM-YYYY")
  );
  console.log(newArr);
  // ------------------  Section --------------------
  // Scatter plot data,  calling and adding legend

  const tooltipValue = (d) => `<p>Sepal Length: ${d.sepalLength}<br>
  Sepal Width: ${d.sepalWidth}<br>
  Petal Length : ${d.petalLength} <br>
  Variety: ${d.species}</p>`;

  const widthHeight = getWidthHeight("scatter");
  const scatter = scatterPlot()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(irisData)
    .xValue("petalLength")
    .yValue("sepalLength")
    .colorValue((d) => d.species)
    .margin(margin)
    .radius(5)
    .xLabel("Petal Length")
    .yLabel("Sepal Length")
    .tooltipValue(tooltipValue)
    .title("Scatter Plot of Sepal Length vs Petal Length");

  const chart1 = appendSvg("scatter");
  chart1.call(scatter);

  const chart1Legend = legend()
    .ySeries(irisColorLegend)
    .width(80)
    .height(50)
    .backgroundColor("#e3e3e3")
    .backgroundOpacity(0.8)
    .x(440)
    .y(200);
  chart1.call(chart1Legend);

  // ------------------  Section --------------------
  // Bar  chart data and calling

  const bar = barChart()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(barChartData)
    .xValue("fruit")
    .yValue("quantity")
    .margin(margin)
    .xLabel("Fruit")
    .yLabel("Quantity")
    .title("Quantity of fruit in the Store inventory");

  const chart2 = appendSvg("bar");
  chart2.call(bar);

  // ------------------  Section --------------------
  // Line chart data and calling

  const line = lineChart()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(lineChartData)
    .xValue((d) => new Date(d.Date))
    .ySeries(lineChartSeriesInfo)
    .xLabel("ID")
    .xType("time")
    .yLabel("Not really sure what the value is...? ")
    .title("Line chart showing example data about 3 different cities in 2016");

  const chart3 = appendSvg("line");
  chart3.call(line);

  const lineLegend = legend()
    .width(90)
    .height(80)
    .x(widthHeight[0] - 100)
    .y(50)
    .ySeries(lineChartSeriesInfo)
    .backgroundColor("#e3e3e3")
    .backgroundOpacity(0.8);
  // .legendTitle("City");
  chart3.call(lineLegend);

  // ------------------  Section --------------------
  // Stacked Bar chart data and calling

  const chart4 = appendSvg("stacked-bar");
  const stacked = stackedBarChart()
    .data(stackedBarData)
    .width(widthHeight[0])
    .height(widthHeight[1])
    .subGroups(stackedSubGroups)
    .margin(margin)
    .yLabel("Grades")
    .xLabel("Student")
    .groups(stackedBarData.map((d) => d.group));

  const stackedBarLegend = legend()
    .ySeries(stackedSubGroups)
    .x(430)
    .y(40)
    .width(100)
    .height(80)
    .pointType("rect")
    .legendTitle("Subject");

  chart4.call(stacked);
  chart4.call(stackedBarLegend);

  // ------------------  Section --------------------
  // bubble plot data,  calling and adding legend

  const chart5 = appendSvg("bubble");
  const bubble = bubbleChart()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(bubbleData)
    .bubbleValue("GDP")
    .labelValue("Country")
    .colorValue("Region")
    // .colorPalette(bubbleYSeries)
    .clustered(true)
    .title("GDP of Countries");
  // .margin();

  const bubbleLegend = legend()
    .x(10)
    .y(widthHeight[1] - 100)
    .width(100)
    .height(100)
    .ySeries(bubbleYSeries)
    .legendTitle("Region");


  chart5.call(bubble);
  chart5.call(bubbleLegend);
  // ------------------  Section --------------------
  // Activity plot data,  calling and adding legend

  const chart6 = appendSvg("activity");
  const weeklyData = [];
  for (let i = 1; i < 53; i++) {
    weeklyData.push({
      weekNumber: i,
      activity: Math.floor(Math.random() * 10),
      year: 2024,
    });
  }
  const activity = activityMonitorSquares()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(weeklyData)
    .xValue((d) => d.weekNumber)
    .tooltipValue((d) => {
      // console.log(d)
      let date =
        d.weekNumber < 10
          ? moment(`2024W0${d.weekNumber}`).format("ll")
          : moment(`2024W${d.weekNumber}`).format("ll");

      return `Week Beginning: ${date}`;
    });
  chart6.call(activity);

  // ------------------  Section --------------------
  // replotting functions

  window.replot = (chartId) => {
    switch (chartId) {
      case "scatter-svg":
        replotFunction(chartId, chart1, scatter);
        break;
      case "bar-svg":
        replotFunction(chartId, chart2, bar);
        break;
      case "line-svg":
        replotFunction(chartId, chart3, line);
        break;
      case "stacked-bar-svg":
        replotFunction(chartId, chart4, stacked, stackedBarLegend);
        break;
      case "bubble-svg":
        replotFunction(chartId, chart5, bubble);
    }
  };
}
main();
