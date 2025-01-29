import * as d3 from "d3";
import { scatterPlot } from "./Scatterplot-trc";
import { barChart } from "./barChart-trc";
import saveChart from "./saveChart";
import { lineChart } from "./LineChart-trc";
import { legend } from "./legend";

window.saveChart = saveChart;
const getWidthHeight = (chartId) => {
  const container = document.getElementById(chartId);
  //console.log(container);
  return [container.offsetWidth, container.offsetHeight];
};

const csvURL = [
  "https://gist.githubusercontent.com/",
  "netj/",
  "8836201/",
  "raw/",
  "6f9306ad21398ea43cba4f7d537619d0e07d5ae3/",
  "iris.csv",
].join("");

const lineDataURL = [
  "https://raw.githubusercontent.com/",
  "laxmimerit/",
  "All-CSV-ML-Data-Files-Download/",
  "refs/",
  "heads/",
  "master/",
  "revenue.csv",
].join("");
//define row preprocessing step (convert to numbers)
const parseRow = (d) => {
  d["sepal.length"] = +d["sepal.length"];
  d["sepal.width"] = +d["sepal.width"];
  d["petal.length"] = +d["petal.length"];
  d["petal.width"] = +d["petal.width"];
  return d;
};
const parseRowLineData = (d) => {
  d.Date = new Date(d.Date);
  d["New York"] = +d["New York"];
  d["Los Angeles"] = +d["Los Angeles"];
  d.Miami = +d.Miami;

  return d;
};

// Define simple function t return the x and y values
const xValue = (d) => d["petal.length"];
const yValue = (d) => d["sepal.length"];
const colorValue = (d) => d.variety;
const tooltipValue = (d) => `<p>Sepal Length: ${d["sepal.length"]}<br>
  Sepal Width: ${d["sepal.width"]}<br>
  Variety: ${d.variety}</p>`;
const margin = { top: 50, right: 50, bottom: 80, left: 50 };

async function main() {
  const data = await d3.csv(csvURL, parseRow);
  data.map((d, i) => (d.id = `A${i}`));
  //console.log(data);

  const chart1Id = "chart1";
  const widthHeight = getWidthHeight(chart1Id);
  const plot = scatterPlot()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(data)
    .xValue(xValue)
    .yValue(yValue)
    .colorValue(colorValue)
    .margin(margin)
    .radius(5)
    .xLabel("petal.length")
    .yLabel("sepal.length")
    .tooltipValue(tooltipValue)
    .title("Scatter Plot of Sepal Length vs Petal Length");

  const ySeriesChart1 = [
    {
      title: "Setosa",
      color: "#00b894",
    },
    {
      title: "Verisicolor",
      color: "#6c5ce7",
    },
    {
      title: "Virginica",
      color: "#fdcb6e",
    },
  ];
  

  const chart1 = d3
    .select("#" + chart1Id)
    .append("svg")
    .attr("id", chart1Id + "-svg");
  chart1.call(plot);

  const chart1Legend = legend()
    .ySeries(ySeriesChart1)
    .width(70)
    .height(50)
    .backgroundColor("#e3e3e3")
    .backgroundOpacity(0.8)
    .x(460)
    .y(200);
  chart1.call(chart1Legend);


  const chart2Id = "chart2";

  const plot2 = barChart()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(data.slice(0, 20))
    .xValue((d) => d.id)
    .yValue((d) => d["petal.length"])
    .margin(margin)
    .xLabel("ID")
    .yLabel("petal length");

  const chart2 = d3
    .select("#" + chart2Id)
    .append("svg")
    .attr("id", chart2Id + "-svg");
  chart2.call(plot2);

  const lineData = await d3.csv(lineDataURL, parseRowLineData);
  console.log(lineData);

  const ySeries = [
    {
      title: "New York",
      yValue: (d) => d["New York"],
      color: "#00b894",
    },
    {
      title: "Los Angeles",
      yValue: (d) => d["Los Angeles"],
      color: "#6c5ce7",
    },
    {
      title: "Miami",
      yValue: (d) => d["Miami"],
      color: "#fdcb6e",
    },
  ];
  const plot3 = lineChart()
    .width(widthHeight[0])
    .height(widthHeight[1])
    .data(lineData)
    .xValue((d) => d.Date)
    .ySeries(ySeries)
    .xLabel("ID")
    .xType("time")
    .yLabel("petal length");
  // .curveType(d3.curveBumpX);

  const chart3Id = "chart3";

  const chart3 = d3
    .select("#" + chart3Id)
    .append("svg")
    .attr("id", chart3Id + "-svg");
  chart3.call(plot3);
  const lineLegend = legend()
    .width(80)
    .height(50)
    .x(widthHeight[0] - 80)
    .y(50)
    .ySeries(ySeries)
    .backgroundColor("#e3e3e3")
    .backgroundOpacity(0.8);
  chart3.call(lineLegend);
}
main();
