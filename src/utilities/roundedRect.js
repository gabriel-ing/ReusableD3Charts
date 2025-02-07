export //function to return the path element for a rectangle with rounded corners centered at position
function roundedRect(x, y, width, height, radius, centered = true) {
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