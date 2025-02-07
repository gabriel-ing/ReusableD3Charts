import * as d3 from "d3";

export const barChart = () => {
  // let width;
  // let height;
  let data;
  let yValue;
  let xValue;
  let margin = { top: 50, right: 50, bottom: 50, left: 80 };
  let radius = 5;
  let xLabel;
  let color = "#e17055";
  let yLabel;
  let xType;
  let yType;
  let x;
  let heightScale;
  let filterOne = null;
  let filterTwo = null;
  let title;

  const my = (selection) => {
    // selection.attr("width", width).attr("height", height);
    const width = selection.node().getBoundingClientRect().width;
    const height = selection.node().getBoundingClientRect().height;
    selection.attr("viewBox", `0 0 ${width} ${height}`);
    //console.log(data);
    let filteredData = data;
    let axisHeight = height - margin.top - margin.bottom;
    if (filterOne) {
      filteredData = filteredData.filter(filterOne);
    }
    if (filterTwo) {
      filteredData = filteredData.filter(filterTwo);
    }
    //console.log(filteredData);

    x = d3
      .scaleBand()
      .domain(filteredData.map( (d) => d[xValue]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    heightScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d[yValue])])
      .range([axisHeight, 0]);

    const marks = filteredData.map((d) => ({
      x: x(d[xValue]),
      height: axisHeight - heightScale(d[yValue]),

      value: d[yValue].toFixed(1),
    }));

    const t = d3.transition().duration(1000);
    //console.log(data);
    //console.log(marks);
    const bars = selection
      .selectAll(".bar")
      .data(marks)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => d.x)
            .attr("y", (d) => height - margin.bottom)
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .attr("fill", color)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .on("mouseover", function (event, d) {
              d3.select(this).style("opacity", "0.6");
              const barLabel = selection
                .append("text")
                .attr("class", "barLabels")
                .attr("text-anchor", "middle")
                .attr("x", d.x + x.bandwidth() / 2)
                .attr("y", height - margin.bottom - d.height - 10)
                .transition()
                .duration(100)
                .text(d.value);
            })
            .on("mouseout", function (event, d) {
              d3.select(this).style("opacity", 1);
              d3.selectAll(".barLabels").transition().duration(100).remove();
            })
            .call((enter) =>
              enter
                .transition(t)
                .attr("height", (d) => d.height)
                .attr("y", (d) => height - d.height - margin.bottom)
            ),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .delay((d, i) => i * 8)
              .attr("x", (d) => d.x)
              .attr("width", x.bandwidth())
              .attr("height", (d) => d.height)
              .attr("y", (d) => height - d.height - margin.bottom)
              .attr("fill", color)
          ),
        (exit) => exit.remove()
      );

    selection
      .selectAll("g.yAxis")
      .data([null])
      .join("g")
      .attr("class", "yAxis ticks")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(heightScale));

    selection
      .selectAll("g.xAxis")
      .data([null])
      .join("g")
      .attr("class", "xAxis ticks")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .transition(t)
      .call(d3.axisBottom(x));

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

  // my.width = function (_) {
  //   return arguments.length ? ((width = +_), my) : width;
  // };

  // my.height = function (_) {
  //   return arguments.length ? ((height = +_), my) : width;
  // };
  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };

  my.xValue = function (_) {
    return arguments.length ? ((xValue = _), my) : xValue;
  };

  my.yValue = function (_) {
    return arguments.length ? ((yValue = _), my) : yValue;
  };
  my.margin = function (_) {
    return arguments.length ? ((margin = _), my) : margin;
  };
  my.radius = function (_) {
    return arguments.length ? ((radius = +_), my) : radius;
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
  my.title = function (_) {
    return arguments.length ? ((title = _), my) : title;
  };
  my.color = function (_) {
    return arguments.length ? ((color = _), my) : color;
  };
  return my;
};
