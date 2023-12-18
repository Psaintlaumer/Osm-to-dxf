const fs = require("fs");

// Read the SVG file content
const svgContent = fs.readFileSync("test.svg", "utf-8");

// Extract path data from the SVG content
const pathStartIndex = svgContent.indexOf('d="') + 3;
const pathEndIndex = svgContent.indexOf('"', pathStartIndex);
const pathData = svgContent.substring(pathStartIndex, pathEndIndex);

// Parse the path data and extract X, Y coordinates
const coordinates = [];
const commands = pathData.split(/[A-Za-z]/).filter(Boolean);
let currentX = 0;
let currentY = 0;

commands.forEach((command) => {
  console.table(command);
  const values = command.trim().split(",").map(parseFloat);

  for (let i = 0; i < values.length; i += 2) {
    const x = values[i];
    const y = values[i + 1];

    if (!isNaN(x) && !isNaN(y)) {
      currentX = x;
      currentY = y;
      coordinates.push({ x, y });
    } else if (!isNaN(x)) {
      currentX = x;
      coordinates.push({ x, y: currentY });
    } else if (!isNaN(y)) {
      currentY = y;
      coordinates.push({ x: currentX, y });
    }
  }
});

// Write coordinates to a dxf file
const outputTxt =
  "POLYLIGNE\n" + coordinates.map(({ x, y }) => `${x},${y}`).join("\n");
fs.writeFileSync("output.scr", outputTxt, "utf-8");

console.log("Conversion complete. Check output.txt for coordinates.");

