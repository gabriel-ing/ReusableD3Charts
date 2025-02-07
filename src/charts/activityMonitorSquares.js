import * as d3 from "d3";
import moment from "moment";
import { checkForTooltip } from "../utilities/checkForTooltip";
import { roundedRect } from "../utilities/roundedRect";

export const activityMonitorSquares = () => {
  // let width;
  // let height;
  let data;
  let radius = 8;
  let gridX;
  let xValue;
  let gridY;
  let title;
  let months;
  const scale = 1.1;
  let margin = { top: 150, right: 50, bottom: 50, left: 50 };
  let tooltipValue = (d) => null;
  let timePeriod = "week";
  let year;
  let colorBar = true;
  let colors = [d3.interpolateGreens(0), d3.interpolateGreens(1)];
  let colorValue;
  let colorRange = () => [0, d3.max(data, (d) => d[colorValue])];
  let cbarLabel = "Activities Per Week";
  const my = (selection) => {
    // selection.attr("width", width).attr("height", height);
    const width = selection.node().getBoundingClientRect().width;
    const height = selection.node().getBoundingClientRect().height;
    selection.attr("viewBox", `0 0 ${width} ${height}`);

    let tooltip = checkForTooltip();
    year = 2024;

    if (!gridX & !gridY) {
      switch (timePeriod) {
        case "week":
          if (year) {
            // const months =
            //   data.map(d=> {
            //     let date =
            //       d.weekNumber + 1 < 10
            //         ? moment(`${year}W0${d.weekNumber + 1}`).format("M")
            //         : moment(`${year}W${d.weekNumber + 1}`).format("M");
            //     return +date;
            //   })

            data.map((d) => {
              d.month =
                d.weekNumber < 10
                  ? +moment(`${year}W0${d.weekNumber}`).format("M")
                  : +moment(`${year}W${d.weekNumber}`).format("M");
            });

            months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            gridX = 12;
            gridY = 5;
          } else {
            gridX = 13;
            gridY = 4;
          }

          break;
        case "day":
          gridX = 52;
          gridY = 7;
          break;
        case "month":
          gridX = 4;
          gridY = 3;
      }
    }
    const xScale = d3
      .scaleBand()
      .domain(d3.range(gridX))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    const yScale = d3
      .scaleBand()
      .domain(d3.range(gridY))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const colorScale = d3.scaleLinear().domain(colorRange()).range(colors);

    const minDimension = d3.min([xScale.bandwidth(), yScale.bandwidth()]);
    let marks;
    if (months) {
      let ypos = 0;
      let currentMonth = 0;

      marks = data.map((d) => {
        ypos = currentMonth === d.month ? ypos + 1 : 0;
        currentMonth = d.month;

        const markobj = {
          xpos: d.month - 1,
          ypos: ypos,
          y: yScale(ypos),
          x: xScale(d.month - 1),
          monthLabel: months[d.month - 1],
          colorValue: d[colorValue],
          color: colorScale(d[colorValue]),
          weekNumber: d.weekNumber,
          tooltip: tooltipValue(d),
          data: d,
        };

        return markobj;
      });
    } else {
      marks = data.map((d) => ({
        xpos: Math.floor(xValue(d) / gridY),
        ypos: xValue(d) % gridY,
        y: xScale(xValue(d) % gridY),
        x: xScale(Math.floor(xValue(d) / gridY)),
        colorValue: d[colorValue],
        color: colorScale(d[colorValue]),
        weekNumber: d.weekNumber,
        tooltip: tooltipValue(d),
        data: d,
      }));
    }

    selection
      .selectAll(".activitySquare")
      .data(marks)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("class", "activitySquare")
            .attr("d", (d) => roundedRect(d.x, d.y, 0, 0, radius))
            .attr("fill", (d) => d.color)
            .attr("stroke", "#666666")
            .attr("stroke-width", minDimension / 200)
            .on("mouseover", function (event, d) {
              tooltip = d3.select("#tooltip");
              tooltip
                .html(d.tooltip)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
              tooltip.transition().duration(200).style("opacity", 0.9);

              d3.select(this).attr(
                "transform",
                `scale(${scale}) translate(${d.x - d.x * scale}, ${
                  d.y - d.y * scale
                })`
              );
            })
            .on("mouseout", function (event, d) {
              d3.select(this).attr(
                "transform",
                `scale(${1}) translate(${0}, ${0})`
              );
              tooltip.style("opacity", 0);
            })
            .call((enter) =>
              enter
                .transition()
                .duration(1000)
                .attr("d", (d) =>
                  roundedRect(d.x, d.y, minDimension, minDimension, radius)
                )
            ),
        (update) => {
          update
            .transition()
            .duration(500)
            .delay((d,i)=>i*10)
            .attr("d", (d) => roundedRect(d.x, d.y, 0, 0, radius))
            .call((update) => {
              update
                .transition()
                .duration(500)
                .delay((d,i)=>i*10)
                .attr("fill", (d) => d.color)
                .attr("d", (d) =>
                  roundedRect(d.x, d.y, minDimension, minDimension, radius)
                );
            });
        }
      );

    if (months) {
      const monthLabelGroup = selection
        .selectAll(".monthLabels")
        .data([null])
        .join("g")
        .classed("monthLabels", true);
      monthLabelGroup
        .selectAll(".monthLabel")
        .data(marks.filter((d) => d.ypos === 0))
        .join("text")
        .attr("x", (d) => d.x - 0.2 * minDimension)
        .attr("y", (d) => d.y - minDimension * 0.8)
        .attr("text-anchor", "left")
        .attr("class", "monthLabel axisLabel")
        .attr(
          "transform-origin",
          (d) => `${d.x}px ${d.y - minDimension * 0.7}px`
        )
        .attr("transform", `rotate(-45)`)
        .text((d) => d.monthLabel);
    }
    if (title) {
      selection
        .selectAll(".titleLabel")
        .data([null])
        .join("text")
        .attr("class", "axisLabel titleLabel")
        .attr("x", width / 2)
        .attr("y", margin.top / 3)
        .attr("text-anchor", "middle")
        .text(title);
    }
    if (colorBar) {
      const grads = selection
        .selectAll("defs")
        .data([null])
        .join("defs")
        .data([null])
        .selectAll("linearGradient")
        .data([null])
        .join("linearGradient")
        .attr("id", "colorGrad")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      grads
        .selectAll("stop")
        .data(colors)
        .join("stop")
        .style("stop-color", (d) => d)
        .attr("offset", (d, i) => `${100 * (i / (colors.length - 1))}%`);

      const cbar = selection
        .selectAll(".color-bar")
        .data([null])
        .join("g")
        .attr("class", "color-bar");

      cbar
        .selectAll(".color-bar-rect")
        .data([null])
        .join(
          (enter) => {
            enter
              .append("rect")
              .attr("class", "color-bar-rect")
              .attr(
                "width",
                width - margin.left - margin.right - 2.5 * minDimension
              )
              .attr("height", minDimension / 2)
              .attr("y", height - margin.bottom + 2)
              .attr("x", margin.left + minDimension / 2)
              .attr("stroke", "#111111")
              .attr("stroke-width", minDimension / 200)
              .attr("fill", "url(#colorGrad)");
          },
          (update) => {
            update
              .transition()
              .duration(1000)
              .call((update) => {
                update
                  .attr(
                    "width",
                    width - margin.left - margin.right - 2.5 * minDimension
                  )
                  .attr("height", minDimension / 2)
                  .attr("y", height - margin.bottom + 2)
                  .attr("x", margin.left + minDimension / 2)
                  .attr("stroke", "#111111")
                  .attr("stroke-width", minDimension / 200)
                  .attr("fill", "url(#colorGrad)");
              });
          }
        );

      // const cbarTextMarks = colorRange().map((d)=> ({
      //   value: d,
      //   x:
      // }))
      cbar
        .selectAll(".color-bar-number-label")
        .data(colorRange())
        .join("text")
        .attr("class", "color-bar-number-label axisLabel")
        .attr("text-anchor", (d) => {
          if (d === 0) {
            return "right";
          } else {
            return "left";
          }
        })
        .attr("dominant-baseline", "middle")
        .attr("text-align", "middle")
        .attr("dy", "0.1em")
        .attr("x", (d, i) => {
          return (
            margin.left +
            (width - margin.right - margin.left - 1.5 * minDimension) *
              (i / (colorRange().length - 1))
          );
        })
        .attr("y", height - margin.bottom + 2 + minDimension / 4)
        .text((d) => d);
      cbar
        .selectAll(".cbar-label")
        .data([null])
        .join("text")
        .attr("class", "cbar-label axisLabel")
        .attr("text-anchor", "middle")
        .attr("x", (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom + 2 + minDimension)
        .text(cbarLabel);
    } else {
      selection
        .selectAll(".color-bar")
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();
    }
  };

  // my.width = function (_) {
  //   return arguments.length ? ((width = +_), my) : width;
  // };
  // my.height = function (_) {
  //   return arguments.length ? ((height = +_), my) : width;
  // };
  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };
  my.timePeriod = function (_) {
    return arguments.length ? ((timePeriod = _), my) : timePeriod;
  };
  my.radius = function (_) {
    return arguments.length ? ((radius = _), my) : radius;
  };
  my.xValue = function (_) {
    return arguments.length ? ((xValue = _), my) : xValue;
  };
  my.tooltipValue = function (_) {
    return arguments.length ? ((tooltipValue = _), my) : tooltipValue;
  };
  my.title = function (_) {
    return arguments.length ? ((title = _), my) : title;
  };
  my.colorValue = function (_) {
    return arguments.length ? ((colorValue = _), my) : colorValue;
  };
  my.cbarLabel = function (_) {
    return arguments.length ? ((cbarLabel = _), my) : cbarLabel;
  };
  my.colorBar = function (_) {
    return arguments.length ? ((colorBar = _), my) : colorBar;
  };
  my.colorRange = function (_) {
    return arguments.length ? ((colorRange = _), my) : colorRange;
  };
  my.colors = function (_) {
    return arguments.length ? ((colors = _), my) : colors;
  };

  return my;
};
