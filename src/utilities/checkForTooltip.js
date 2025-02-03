import * as d3 from "d3";
export function checkForTooltip() {
    // const tooltip = d3.select("#tooltip");
    let tooltip = document.getElementById("tooltip")

    if (!tooltip) {
    tooltip = d3.select("body").append("div").attr("id", "tooltip");
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
    Object.entries(tooltipStyles).forEach(([prop, value]) =>
      tooltip.style(prop, value)
    );
  }
  return tooltip;
}
