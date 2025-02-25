import * as d3 from "d3";
const generateTeardropPath = (cx, cy, r, h) => {
  let pathD;

  const tipY = cy - h + r;
  const tipX = cx;
  pathD = `M${tipX} ${tipY}
           C ${tipX} ${tipY},${cx + r} ${cy}, ${cx + r} ${cy}
           A ${r} ${r} 0 1 1 ${cx - r} ${cy}
           C ${tipX} ${tipY},${tipX} ${tipY},${tipX} ${tipY}z`;
  // console.log(pathD);
  return pathD;
};

export const Ticker = () => {
  let value;
  let maxValue;
  let minValue;
  let margin = { left: 0, top: 10, bottom: 30, right: 0 };
  let gradations = 20;
  let ticks;
  let arcFill = "#e6b2ca";
  let bgColor = "#336299";
  let lightColor = "#f9ecf2";
  const my = (selection) => {
    const width = selection.node().getBoundingClientRect().width;
    const height = selection.node().getBoundingClientRect().height;
    const smallAxis = d3.min([width, height]);

    selection.attr("viewBox", `0 0 ${width} ${height}`);

    const innerRadius = smallAxis * 0.4;
    const outerRadius = smallAxis * 0.6;

    // console.log(height, width, innerRadius, outerRadius);

    const radialScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range([-90, 90]);

    const arcAxis = selection
      .selectAll(".arcAxis")
      .data([null])
      .join("g")

      .attr("class", "arcAxis");

    arcAxis
      .selectAll(".arc")
      .data([null])
      .join("path")
      .attr("transform", `translate(${width / 2}, ${height - margin.bottom})`)
      .attr(
        "d",
        d3.arc()({
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2,
        })
      )
      .attr("class", "arc")
      .attr("fill", arcFill)
      .attr("stroke", "black");

    if (!ticks) {
      ticks = d3
        .range(Math.floor((maxValue - minValue) / gradations) - 1)
        .map((d) => minValue + (d + 1) * gradations);
      console.log(ticks);
    }

    const scaleTicks = arcAxis
      .selectAll(".scale-ticks")
      .data(ticks)
      .join((enter) => {
        const g = enter
          .append("g")
          .attr("class", "scale-ticks")
          .attr("id", (d) => `value${d}`)
          // .attr("transform", `translate(${width / 2}, ${height - margin.bottom})`)
          .attr(
            "transform",
            (d) =>
              `translate(${width / 2}, ${
                height - margin.bottom
              }) rotate(${radialScale(d)})`
          );
        g.append("path")
          .attr(
            "d",
            d3.arc()({
              innerRadius: (outerRadius + innerRadius) / 2,
              outerRadius: outerRadius,
              startAngle: 0,
              endAngle: Math.PI / 360,
            })
          )
          .attr("fill", "grey")
          .attr("class", "tick-lines");

        g.append("text")
          .attr("class", "tick-labels")
          .text((d) => d)
          .attr("x", 0)
          .attr("text-anchor", "middle")
          .attr("y", -outerRadius + (outerRadius - innerRadius) / 1.5)
          // .attr("y", -smallAxis * 0.52)
          .attr("font-size", "12px");
      });

    const needle = selection
      .selectAll(".needle")
      .data([value])
      .join(
        (enter) => {
          const g = enter
            .append("g")
            .attr("class", "needle")
            .attr(
              "transform",
              `translate(${width / 2}, ${
                height - margin.bottom
              }) rotate(${radialScale(minValue)})`
            );

          g.append("path")
            .attr(
              "d",
              generateTeardropPath(0, 0, smallAxis * 0.05, smallAxis * 0.7)
            )
            .attr("fill", "#0d1926")
            .attr("stroke", "#d9e5f2")
            .attr("stroke-width", 0.5)
            .attr("class", "teardrop");

          g.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", smallAxis * 0.025)
            .attr("fill", bgColor)
            .attr("stroke", lightColor)
            .attr("stroke-width", 0.5);

          g.append("text")
            .attr("x", 0)
            .attr("y", -height * 0.7)
            .attr("text-anchor", "middle")
            .attr("class", "needle-label ticker-label ")
            .attr("fill", "#0d1926")
            .attr("stroke", lightColor)
            .attr("stroke-width", 0.5)
            .text((d) => d);

          g.call((g) => {
            g.transition()
              .duration(1000)
              .delay(100)
              .attr(
                "transform",
                (d) =>
                  `translate(${width / 2}, ${
                    height - margin.bottom
                  }) rotate(${radialScale(d)}
                 )`
              );
          });
        },
        (update) => {

          update
            .transition()
            .duration(1000)
            .delay(100)
            .attr(
              "transform",
              (d) =>
                `translate(${width / 2}, ${
                  height - margin.bottom
                }) rotate(${radialScale(d)}
           )`
            );
          update
            .select(".needle-label")
            .transition()
            .delay(1100)
            .text((d) => d);
        }
      );

    selection
      .selectAll(".end-labels")
      .data([
        {
          value: minValue,
          x: width / 2 - outerRadius + (outerRadius - innerRadius) / 2,
        },
        {
          value: maxValue,
          x: width / 2 + outerRadius - (outerRadius - innerRadius) / 2,
        },
      ])
      .join("text")
      .attr("class", "end-labels")
      .attr("x", (d) => d.x)
      .attr("text-anchor", "middle")
      .attr("y", height - margin.bottom - 5)
      .text((d) => d.value);

    // , ${
    //           height - margin.bottom");
  };

  my.value = function (_) {
    return arguments.length ? ((value = _), my) : value;
  };
  my.maxValue = function (_) {
    return arguments.length ? ((maxValue = _), my) : maxValue;
  };
  my.minValue = function (_) {
    return arguments.length ? ((minValue = _), my) : minValue;
  };
  return my;
};
