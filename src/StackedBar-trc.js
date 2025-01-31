import * as d3 from "d3";

export const stackedBarChart = () => {
  let width;
  let height;
  let data;
  let subGroups;
  let groups;
  let title;
  let margin = { top: 50, right: 50, bottom: 80, left: 80 };
  let proportional = false;

  let tooltipValue = (d, key) => ` ${key} : ${d.data[key]}`;

  const my = (selection) => {
    // selection.append("rect").attr("width", 100).attr("height", 100);

    const subs = subGroups.map((d) => d.subgroup);
    const sums = data.map(d =>
        subs.reduce((sum, key) => sum + Number(d[key]), 0)
      );
    const maxY = d3.max(sums);

    const xScale = d3
      .scaleBand()
      .domain(groups)
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const colorScale = d3
      .scaleOrdinal()
      .domain(subs)
      .range(subGroups.map((d) => d.color));

    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([height - margin.bottom, margin.bottom]);

    let tooltip;

    tooltip = d3.select("#tooltip");
    if (!tooltip) {
      tooltip = d3.select("body").append("div").attr("id", "tooltip").attr("class", "tooltip");
      const tooltipStyles = {
        position: "absolute",
        opacity: "0",
        background: "white",
        border: "1px solid black",
        padding: "2px",
        "border-radius": "5px",
        "font-size": "11px",
        "line-height": "12px",
      };
    }

    const stackedData = d3.stack().keys(subs)(data);

    selection

      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => colorScale(d.key))
      .each(function (d) {
        d3.select(this).attr("data-key", d.key);
      })
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => xScale(d.data.group))
      .attr("y", (d) => yScale(d[1]))
      .attr("stroke", "black")
      .attr("stroke-width", "0.5px")
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("mouseover", function (event, d) {
        
        d3.select(this).attr("opacity", 0.5);
        const key = d3.select(this.parentNode).attr("data-key");
       
        tooltip = d3.select("#tooltip");
        tooltip
          .html(tooltipValue(d, key))
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
        tooltip.transition().duration(200).style("opacity", 0.9);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("opacity", 0).html("");
      });

    selection
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));
    selection
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

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
  my.subGroups = function (_) {
    return arguments.length ? ((subGroups = _), my) : subGroups;
  };

  my.groups = function (_) {
    return arguments.length ? ((groups = _), my) : groups;
  };
  my.margin = function (_) {
    return arguments.length ? ((margin = _), my) : margin;
  };
  my.propotional = function (_) {
    return arguments.length ? ((proportional = _), my) : title;
  };
  my.title = function (_) {
    return arguments?.length ? ((title = _), my) : title;
  };
  return my;
};
