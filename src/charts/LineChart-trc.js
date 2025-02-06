import * as d3 from "d3";
import { checkForTooltip } from "../utilities/checkForTooltip";

export const lineChart = () => {
  let width;
  let height;
  let data;
  let ySeries = [];
  let xValue;
  let margin = { top: 50, right: 50, bottom: 80, left: 80 };
  let radius = 3;
  let colorValue;
  let colorList = [
    "#00b894",
    "#6c5ce7",
    "#fdcb6e",
    "#e17055",
    "#00cec9",
    "#d63031",
    "#e84393",
    "#0984e3",
  ];
  let xLabel;
  let yLabel;
  let tooltipValue = (d) => `${d.title} <br>${d.xOriginal}: ${d.yOriginal}`;
  let tooltip;
  let xType;
  let yType;
  let x;
  let y;
  let filterOne = null;
  let filterTwo = null;
  let additionalClickFunction = (event, d) => null;
  let backgroundOnClick = () => null;
  let title;
  let curveType;

  const my = (selection) => {
    selection.attr("width", width).attr("height", height);

    //console.log(selection);
    const backgroundRect = selection
      .selectAll(".backgroundRect")
      .data([null])
      .join("rect")
      .attr("class", "backgroundRect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white")
      .attr("opacity", 0)
      .on("click", backgroundOnClick);

    //console.log(data);
    let filteredData = data;

    if (filterOne) {
      filteredData = filteredData.filter(filterOne);
    }
    if (filterTwo) {
      filteredData = filteredData.filter(filterTwo);
    }
    if (tooltipValue(filteredData[0])) {
      tooltip = checkForTooltip();
    }

    if (xType === "category") {
      x = d3
        .scalePoint()
        .domain(filteredData.map(xValue))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    }
    if (xType === "time") {
      x = d3
        .scaleTime()
        .domain(d3.extent(filteredData, xValue))
        .range([margin.left, width - margin.right]);
    } else {
      x = d3
        .scaleLinear()
        .domain([d3.min(filteredData, xValue), d3.max(filteredData, xValue)])
        .range([margin.left, width - margin.right]);
    }

    const maxY = d3.max(ySeries.map((d) => d3.max(filteredData, d.yValue)));

    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([height - margin.bottom, margin.top]);

    let xScale;
    //console.log(filteredData);
    if (xType === "time") {
      xScale = d3
        .scaleTime()
        .domain(d3.extent(filteredData, xValue))
        .range([margin.left, width - margin.right]);
    } else {
      xScale = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, xValue)])
        .range([margin.left, width - margin.right]);
    }
    const t = d3.transition().duration(1000);

    const seriesData = ySeries.map((d) => {
      return {
        title: d.title,
        color: d.color,
        values: data.map((datum) => ({
          x: xScale(xValue(datum)),
          y: yScale(d.yValue(datum)),
          xOriginal: xValue(datum),
          yOriginal: d.yValue(datum),
        })),
      };
    });

    let lineGenerator;
    if (curveType) {
      lineGenerator = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(curveType);
    } else {
      lineGenerator = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y);
    }
    const paths = selection
      .selectAll(".line-chart-line")
      .data(seriesData)
      .join(
        (enter) => {
          enter
            .append("path")
            .attr("fill", "none")
            .attr("class", (d) => `line-chart-line series{${d.title}}`)
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", 3)
            .attr("d", (d) => lineGenerator(d.values))
            .call((enter) =>
              enter
                .transition()
                .duration(1000)
                .attr("d", (d) => lineGenerator(d.values))
            );
        },
        (update) => {
          update.call((update) =>
            update
              .transition()
              .delay((d, i) => i * 200)
              .duration(1000)
              .attr("d", (d) => lineGenerator(d.values))
          );
        }
      );

    const circlesData = seriesData.map((item) => {
      return item.values.map((d) => ({
        color: item.color,
        title: item.title,
        x: d.x,
        y: d.y,
        xOriginal: d.xOriginal,
        yOriginal: d.yOriginal,
      }));
    });

    const circles = selection
      .selectAll(".points")
      .data(circlesData.flat())
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 0)
            .attr("class", "points")
            .attr("fill", (d) => d.color)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
              d3.select(this).attr("opacity", 0.5);

              tooltip = d3.select("#tooltip");
              tooltip
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY + 5}px`)
                .style("opacity", 1)
                .html(tooltipValue(d));
            })
            .on("mouseout", function (event, d) {
              d3.select(this).attr("opacity", 1);
              tooltip.transition().duration(500).style("opacity", 0);
            })
            .call((enter) =>
              enter
                .transition()
                .delay(300)
                .duration(1000)
                .attr("r", (d) => 4)
            );
        },
        (update) =>
          update
            .attr("r", 0)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .call((update) => {
              update.transition().delay(1000).duration(1000).attr("r", 4);
            })
      );
    // ySeries.forEach((series, i) => {
    //   const lineData = filteredData.map((d) => ({
    //     x: xScale(xValue(d)),
    //     y: yScale(series.yValue(d)),
    //   }));
    //   //console.log(lineData);
    //   }
    //   const t = d3.transition().duration(4000);
    //   const paths = selection
    //     .selectAll(`path`)
    //     .data([null])
    //     .join(
    //       (enter) => {
    //         const path = enter
    //           .append("path")
    //           .attr("id", `#lineChartPath${i}`)
    //           .attr("d", null)
    //           .attr("id", `lineChartPath${i}`)
    //           .attr("fill", "none")
    //           .attr("stroke", colorList[i])
    //           .attr("stroke-width", "3px")
    //           .attr("stroke-linecap", "round");

    //         path.call((enter) =>
    //           enter.transition(t).attr("d", lineGenerator(lineData))
    //         );
    //       },
    //       (update) => {
    //         update
    //           .transition(t)
    //           .delay((d, i) => i * 8)
    //           .attr("d", lineGenerator(lineData));
    //       }
    //     );

    // const circles = selection
    //   .selectAll(`.circles`)
    //   .data(seriesData)
    //   .join("circle")
    //   .attr("class", `circles`)
    //   .attr("cx", (d) => xScale(xValue(d)))
    //   .attr("cy", (d) => yScale(yValue(d)))
    //   .attr("r", radius)
    //   .attr("fill", "yellow")
    //   .attr("stroke", "black")
    //   .attr("stroke-width", "0.25px");

    selection
      .selectAll("g.yAxis")
      .data([null])
      .join("g")
      .attr("class", "yAxis ticks")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    selection
      .selectAll("g.xAxis")
      .data([null])
      .join("g")
      .attr("class", "xAxis ticks")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .transition(t)
      .call(d3.axisBottom(xScale));

    selection
      .selectAll(".xAxisLabel")
      .data([0])
      .join("text")
      .attr("class", "xAxisLabel axisLabel")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - margin.bottom / 3)
      .text(xLabel);

    selection
      .selectAll(".yAxisLabel")
      .data([0])
      .join("text")
      .attr("class", "yAxisLabel axisLabel")
      .attr("x", margin.left / 3)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90, ${margin.left / 3}, ${height / 2})`)
      .text(yLabel);

    if (title) {
      //console.log(title);
      selection
        .selectAll(".titleLabel")
        .data([null])
        .join("text")
        .attr("class", "axisLabel titleLabel")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text(title);
    }
  };

  my.width = function (_) {
    return arguments.length ? ((width = +_), my) : width;
  };

  my.height = function (_) {
    return arguments.length ? ((height = +_), my) : width;
  };
  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };

  my.xValue = function (_) {
    return arguments.length ? ((xValue = _), my) : xValue;
  };

  my.ySeries = function (_) {
    return arguments.length ? ((ySeries = _), my) : yValue;
  };
  my.margin = function (_) {
    return arguments.length ? ((margin = _), my) : margin;
  };
  my.radius = function (_) {
    return arguments.length ? ((radius = +_), my) : radius;
  };
  my.colorValue = function (_) {
    return arguments.length ? ((colorValue = _), my) : colorValue;
  };
  my.colorList = function (_) {
    return arguments.length ? ((colorList = _), my) : colorList;
  };
  my.tooltipValue = function (_) {
    return arguments.length ? ((tooltipValue = _), my) : tooltipValue;
  };
  my.xLabel = function (_) {
    return arguments.length ? ((xLabel = _), my) : xLabel;
  };
  my.yLabel = function (_) {
    return arguments.length ? ((yLabel = _), my) : yLabel;
  };
  my.xType = function (_) {
    return arguments.length ? ((xType = _), my) : xType;
  };
  my.yType = function (_) {
    return arguments.length ? ((yType = _), my) : yType;
  };
  my.filterOne = function (_) {
    return arguments.length ? ((filterOne = _), my) : filterOne;
  };
  my.filterTwo = function (_) {
    return arguments.length ? ((filterTwo = _), my) : filterTwo;
  };
  my.additionalClickFunction = function (_) {
    return arguments.length
      ? ((additionalClickFunction = _), my)
      : additionalClickFunction;
  };
  my.backgroundOnClick = function (_) {
    return arguments.length ? ((backgroundOnClick = _), my) : backgroundOnClick;
  };
  my.title = function (_) {
    return arguments.length ? ((title = _), my) : title;
  };
  my.curveType = function (_) {
    return arguments.length ? ((curveType = _), my) : curveType;
  };
  return my;
};
