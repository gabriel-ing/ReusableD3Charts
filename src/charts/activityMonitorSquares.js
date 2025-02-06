import * as d3 from "d3";
import moment from "moment";
import { checkForTooltip } from "../utilities/checkForTooltip";
// Returns path data for a rectangle with rounded right corners.
// The top-left corner is ⟨x,y⟩.
function rightRoundedRect(x, y, width, height, radius) {
  return (
    "M" +
    (x + width / 2) +
    "," +
    (y + height / 2) +
    "h" +
    (width - radius) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    radius +
    "," +
    radius +
    "v" +
    (height - 2 * radius) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    -radius +
    "," +
    radius +
    "h" +
    (radius - width) +
    "z"
  );
}
//function to return the path element for a rectangle with rounded corners centered at position
function roundedRect(x, y, width, height, radius, centered = false) {
  const initialX = centered ? x - width / 2 : x;
  const initialY = centered ? y - height / 2 : y;
  return (
    "M" +
    (initialX + radius) +
    "," +
    initialY +
    "h" +
    (width - 2 * radius) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    radius +
    "," +
    radius +
    "v" +
    (height - 2 * radius) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    -radius +
    "," +
    radius +
    "h" +
    (2 * radius - width) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    -radius +
    "," +
    -radius +
    "v" +
    (2 * radius - height) +
    "a" +
    radius +
    "," +
    radius +
    " 0 0 1 " +
    radius +
    "," +
    -radius +
    "z"
  );
}

export const activityMonitorSquares = () => {
  let width;
  let height;
  let data;
  let xValue;
  let radius = 8;
  let gridX;
  let gridY;
  const scale = 1.1;
  let margin = { top: 100, right: 50, bottom: 50, left: 50 };
  let tooltipValue = (d) => null;
  let timePeriod = "week";
  let year;
  const my = (selection) => {
    selection.attr("width", width).attr("height", height);

    let tooltip = checkForTooltip();
    year = 2024;

    // console.log(data);
    if (!gridX & !gridY) {
      switch (timePeriod) {
        case "week":
          if (year) {
            console.log(
              d3.range(53).map((d) => {
                let date =
                  d + 1 < 10
                    ? moment(`${year}W0${d + 1}`).format("ll")
                    : moment(`${year}W${d + 1}`).format("ll");
                return date;
              })
            );
          }
          gridX = 13;
          gridY = 4;

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
      .padding(0.2);
    // const yScale = d3
    //   .scaleBand()
    //   .domain(d3.range(gridY))
    //   .range([margin.top, height - margin.bottom])
    //   .padding(0.2);
    const colorValue = (d) => d.activity;

    const colorScale = d3
      .scaleLinear()
      .domain(d3.extent(data, colorValue))
      .range([d3.interpolateGreens(0), d3.interpolateGreens(1)]);

    // console.log(d3.extent(data, colorValue));
    const minDimension = xScale.bandwidth();

    const marks = data.map((d) => ({
      xpos: Math.floor(xValue(d) / gridY),
      ypos: xValue(d) % gridY,
      y: xScale(xValue(d) % gridY),
      x: xScale(Math.floor(xValue(d) / gridY)),
      colorValue: colorValue(d),
      color: colorScale(colorValue(d)),
      weekNumber: d.weekNumber,
      tooltip: tooltipValue(d),
      data: d,
    }));

    // console.log(xScale(6));
    // console.log(marks);
    selection
      .selectAll(".activitySquare")
      .data(marks)
      .join("path")
      .attr("d", (d) =>
        roundedRect(d.x, d.y, minDimension, minDimension, radius)
      )
      .attr("fill", (d) => d.color)
      .attr("stroke", "#666666")
      .attr("stroke-width", minDimension / 200)
      .on("click", (event, d) => {
        console.log(d);
      })
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
        d3.select(this).attr("transform", `scale(${1}) translate(${0}, ${0})`);
      });
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

  return my;
};
