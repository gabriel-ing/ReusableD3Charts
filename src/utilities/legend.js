import * as d3 from "d3";

export const legend = () => {
  let width;
  let height;
  let backgroundColor;
  let backgroundOpacity = 0;
  let ySeries;
  let x;
  let y;
  let legendTitle;
  let pointType = "circle";
  const my = (selection) => {
    //console.log(selection);

    // const selection = d3.select("chart").append(svg)
    const legend = selection
      .selectAll(".legend")
      .data([null])
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(0, ${y})`)
            .call((enter) =>
              enter
                .transition()
                .duration(1000)
                .attr("transform", `translate(${x}, ${y})`)
            ),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(1000)
              .attr("transform", `translate(${x}, ${y})`)
          )
      );

    legend
      .selectAll(".legendRect")
      .data([0])
      .join("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "legendRect")
      .attr("fill", backgroundColor)
      .attr("opacity", backgroundOpacity)
      .attr("width", width)
      .attr("height", height)
      .attr("stroke", "black")
      .attr("stroke-width", "0.25px");

    //console.log(ySeries);

    if (legendTitle) {
      legend
        .selectAll(".legendTitle")
        .data([null])
        .join("text")
        .attr("class", "legendTitle axislabel")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(legendTitle);
    }
    const legendPoints = legend
      .selectAll("g")
      .data([0])
      .join("g")
      .attr("transform", `translate(0, ${legendTitle ? 8 : 0})`);

    const yPos = (d, i) => {
      return (i + 1) * (height / (ySeries.length + 1));
    };
    if (pointType == "circle") {
      legendPoints
        .selectAll(".legendPoints")
        .data(ySeries)
        .join(pointType)
        .attr("class", "legendPoints")
        .attr("cx", 10)
        .attr("cy", yPos)
        .attr("r", 6)
        .attr("fill", (d) => d.color);
      legendPoints
        .selectAll(".legendText")
        .data(ySeries)
        .join("text")
        .attr("x", 20)
        .attr("y", yPos)
        .attr("class", "legendText")
        .attr("dominant-baseline", "middle")
        .attr("dy", "0.1em")
        .text((d) => d.title);
    } else {
      legendPoints
        .selectAll(".legendPoints")
        .data(ySeries)
        .join("rect")
        .attr("class", "legendPoints")
        .attr("x", 10)
        .attr("y", yPos)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d) => d.color);
      legendPoints
        .selectAll(".legendText")
        .data(ySeries)
        .join("text")
        .attr("x", 25)
        .attr("y", yPos)
        .attr("class", "legendText")
        .attr("dominant-baseline", "middle")
        .attr("dy", "0.5em")
        .text((d) => d.title);
    }
  };

  my.width = function (_) {
    return arguments.length ? ((width = +_), my) : width;
  };
  my.height = function (_) {
    return arguments.length ? ((height = +_), my) : height;
  };
  my.backgroundColor = function (_) {
    return arguments.length ? ((backgroundColor = _), my) : backgroundColor;
  };
  my.backgroundOpacity = function (_) {
    return arguments.length ? ((backgroundOpacity = _), my) : backgroundOpacity;
  };
  my.ySeries = function (_) {
    return arguments.length ? ((ySeries = _), my) : ySeries;
  };
  my.x = function (_) {
    return arguments.length ? ((x = _), my) : x;
  };
  my.y = function (_) {
    return arguments.length ? ((y = _), my) : y;
  };
  my.legendTitle = function (_) {
    return arguments.length ? ((legendTitle = _), my) : legendTitle;
  };
  my.pointType = function (_) {
    return arguments.length ? ((pointType = _), my) : pointType;
  };

  return my;
};
