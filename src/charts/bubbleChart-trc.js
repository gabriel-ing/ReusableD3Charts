import * as d3 from "d3";
import { checkForTooltip } from "../utilities/checkForTooltip";
import { wrap } from "../utilities/wrapText";

export const bubbleChart = () => {
  let width;
  let height;
  let data;
  let title;
  let margin = { top: 40, right: 5, bottom: 5, left: 5 };
  let yLabel;
  let xLabel;
  let clustered = true;
  let colorValue;
  let colorPalette;
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
  let bubbleValue;
  let tooltipValue = (d, key) => ` ${key} : ${d.data[key]}`;
  let labelValue;
  let sorted = true;
  let padding = 5;
  let maxRadius = 90;

  const my = (selection) => {
    selection.attr("width", width).attr("height", height);
    // selection.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
    let colorScale;
    if (colorPalette) {
      colorScale = colorPalette;
      console.log(colorPalette);
    } else {
      colorScale = d3
        .scaleOrdinal()
        .domain(data.map((d) => d[colorValue]))
        .range(colorList);
    }

    if (clustered) {
      const pack = d3
        .pack()
        .size([
          width - margin.left - margin.right,
          height - margin.top - margin.bottom,
        ])
        .padding(10);
      const root = pack(
        d3.hierarchy({ children: data }).sum((d) => d[bubbleValue])
      );
      console.log(root.leaves());
      const bubbles = selection
        .selectAll(".bubbles")
        .data(root.leaves())
        .join(
          (enter) => {
            enter
              .append("circle")
              .attr("class", "bubbles")
              .attr("cx", (d) => margin.left+d.x)
              .attr("cy", (d) => margin.top+ d.y)
              .attr("r", 0)
              .attr("fill", (d) => colorScale(d.data[colorValue]))
              .attr("stroke", "#686868")
              .attr("stroke-width", "1px")
              .call((enter) =>
                enter
                  .transition()
                  .duration(1000)
                  .attr("r", (d) => d.r)
              );
          },
          (update) => {
            update.call((update) =>
              update
                .transition()
                .duration(1000)
                .attr("r", (d) => d.r)
                .attr("cx", (d) => margin.left+d.x)
                
                .attr("cy", (d) => margin.top+ d.y)
            );
          },
          (exit) =>
            exit
              .transition()
              .duration(1000)
              .attr("r", 0)
              .call((exit) => exit.remove())
        );
      const text = selection
        .selectAll(".bubble-label")
        .data(root.leaves())
        .join(
          (enter) => {
            enter
              .append("text")
              .attr("font-size", 0)
              .attr("class", "bubble-label")
              .attr("y", (d) => margin.top+ d.y)
              .attr("x", (d) => margin.left+d.x)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("text-align", "middle")
              .attr("dy", "0.1em")
              .text((d) => d.data[labelValue])
              .call((enter) => {
                enter
                  .transition()
                  .duration(1000)
                  .attr("font-size", (d) => d.r / 3)
                  .call(wrap, 100);
              });
          },
          (update) => {
            update
              .text((d) => d.data[labelValue])
              .transition()
              .duration(1000)
              .attr("y", (d) =>margin.top+ d.y)
              .attr("x", (d) => margin.left+d.x);
          }
        );
    } else {
      if (sorted) {
        data.sort((a, b) => b[bubbleValue] - a[bubbleValue]);
      }
      console.log(data);

      const bubbleScale = d3
        .scaleSqrt()
        .domain([0, d3.max(data, (d) => d[bubbleValue])])
        .range([0, maxRadius]);

      let xPos = margin.left;
      const marks = data.map((d, i) => {
        xPos += padding + bubbleScale(d[bubbleValue]);
        const obj = {
          x: xPos,
          y: height / 2,
          r: bubbleScale(d[bubbleValue]),
          fill: colorScale(d[colorValue]),
          label: d[labelValue],
        };
        xPos += padding + bubbleScale(d[bubbleValue]);
        return obj;
      });

      selection
        .selectAll(".bubbles")
        .data(marks)
        .join(
          (enter) => {
            console.log(enter);
            enter
              .append("circle")
              .attr("class", "bubbles")
              .attr("cx", (d) => d.x)
              .attr("cy", (d) => d.y)
              .attr("r", (d) => 0)
              .attr("fill", (d) => d.fill)
              .attr("stroke", "#686868")
              .attr("stroke-width", "1px")
              .call((enter) =>
                enter
                  .transition()
                  .delay((d, i) => i * 60)
                  .duration(1000)
                  .attr("r", (d) => d.r)
              );
          },
          (update) => {
            update.call((update) => {
              update
                .transition()
                .duration(1000)
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
                .attr("r", (d) => d.r);
            });
          }
        );

      selection
        .selectAll(".bubble-label")
        .data(marks)
        .join(
          (enter) => {
            enter
              .append("text")
              .attr("font-size", 0)
              .attr("class", "bubble-label")
              .attr("y", (d) => d.y)
              .attr("x", (d) => d.x)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("text-align", "middle")
              .attr("dy", "0.1em")
              .text((d) => d.label)
              .call((enter) => {
                enter
                  .transition()
                  .duration(1000)
                  .attr("font-size", (d) => d.r / 3)
                  .call(wrap, 100);
              });
          },
          (update) =>
            update
              .transition()
              .duration(1000)
              .text((d) => d.label)
              .attr("y", (d) => d.y)
              .attr("x", (d) => d.x)
        );
    }
    if (title) {
      // console.log(title);
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
  my.margin = function (_) {
    return arguments.length ? ((margin = _), my) : margin;
  };
  my.bubbleSize = function (_) {
    return arguments.length ? ((bubbleSize = _), my) : bubbleSize;
  };
  my.title = function (_) {
    return arguments?.length ? ((title = _), my) : title;
  };
  my.xLabel = function (_) {
    return arguments.length ? ((xLabel = _), my) : xLabel;
  };
  my.yLabel = function (_) {
    return arguments.length ? ((yLabel = _), my) : yLabel;
  };
  my.colorValue = function (_) {
    return arguments.length ? ((colorValue = _), my) : colorValue;
  };
  my.colorPalette = function (_) {
    return arguments.length ? ((colorPalette = _), my) : colorPalette;
  };
  my.bubbleValue = function (_) {
    return arguments.length ? ((bubbleValue = _), my) : bubbleValue;
  };
  my.labelValue = function (_) {
    return arguments.length ? ((labelValue = _), my) : labelValue;
  };
  my.clustered = function (_) {
    return arguments.length ? ((clustered = _), my) : clustered;
  };
  my.maxRadius = function (_) {
    return arguments.length ? ((maxRadius = _), my) : maxRadius;
  };

  return my;
};
