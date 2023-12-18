const readline = require("readline");
const fs = require("fs");

let inputFile = "abc.nc"; // Replace with your input file
let outputFile = "output_file.txt"; // Replace with your output file

let speed_XY = 2000;
let speed_Z = 2000;
let estimatedTime = 0;

let coord = [0, 0, 0];
let tpsParcours = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

main();

async function main() {
  speed_XY = await question("Renseignez valeur de dplt :");
  speed_XY = parseFloat(speed_XY);
  inputFile = await question("Nom du fichier scr : ");
  outputFile = await question("Nom du fichier destination : ");
  processFile();
}
function question(prompt) {
  return new Promise((resolve, reject) => {
    rl.question(`** ${prompt} : `, (input) => {
      resolve(input);
    });
  });
}
function processFile() {
  const fileStream = fs.createReadStream(inputFile);
  const outputStream = fs.createWriteStream(outputFile);

  // Create a readline interface
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // Detects line endings correctly on Windows as well
  });

  // Event handler for each line read
  rl.on("line", (line) => {
    // Modify the line before writing it to the output
    const modifiedLine = modifyLine(line);

    // Write the modified line to the output file
    outputStream.write(modifiedLine + "\n"); // Add a newline character

    //console.log(`Modified Line: ${modifiedLine}`);
  });

  // Event handler when the entire file is read
  rl.on("close", () => {
    console.log("File reading finished.");

    // Close the output file stream when done writing
    outputStream.end(() => {
      console.log("Tps de parcours : " + tpsParcours + " min");
      console.log("File writing finished.");
    });
  });
}

// Function to modify each line (customize this to your needs)

function modifyLine(line) {
  const data = line;
  let res = data;
  const d = data.split(" ");

  function modificationVitesse() {
    if (d[0].toLowerCase() === "g0") {
      if (d[1].slice(0, 1).toLowerCase() === "z") {
        res = data + " f" + speed_Z;
        d.push("f" + speed_Z);
      }
      if (
        d[1].slice(0, 1).toLowerCase() === "x" ||
        d[1].slice(0, 1).toLowerCase() === "y"
      ) {
        res = data + " f" + speed_XY;
        d.push("f" + speed_XY);
      }
    }
    //console.log("d length: " + d.length);
    //console.table(d);
  }
  function calcTpsParcours() {
    let tpsMin = 0;
    if (d[0].toLowerCase() === "g0" || d[0].toLowerCase() === "g1") {
      const coordFutur = JSON.parse(JSON.stringify(coord));
      let speed = 1000;
      for (let i = 1; i < d.length; i++) {
        //console.log(i);
        //console.log(d[i].slice(0, 1).toLowerCase());
        if (d[i].slice(0, 1).toLowerCase() === "x") {
          let a = d[i].toLowerCase().replace("x", "");
          coordFutur[0] = parseFloat(a);
        }
        if (d[i].slice(0, 1).toLowerCase() === "y") {
          let a = d[i].toLowerCase().replace("y", "");
          coordFutur[1] = parseFloat(a);
        }
        if (d[i].slice(0, 1).toLowerCase() === "z") {
          let a = d[i].toLowerCase().replace("z", "");
          coordFutur[2] = parseFloat(a);
          console.log(a);
        }
        if (d[i].slice(0, 1).toLowerCase() === "f") {
          let a = d[i].toLowerCase().replace("f", "");
          speed = parseFloat(a);
        }
      }
      let dist = Math.round(calculateDistance(coord, coordFutur) * 100) / 100;
      tpsMin = Math.round((100 * dist) / speed) / 100;
      console.log({ tpsMin, dist, speed });
      coord = JSON.parse(JSON.stringify(coordFutur));
    }
    return tpsMin;
  }
  modificationVitesse();
  tpsParcours = tpsParcours + calcTpsParcours();

  return res;
}
function calculateDistance(pointA, pointB) {
  console.log({ pointA, pointB });
  if (pointA.length !== 3 || pointB.length !== 3) {
    throw new Error(
      "Les points doivent avoir trois coordonnées en trois dimensions."
    );
  }

  const [x1, y1, z1] = pointA;
  const [x2, y2, z2] = pointB;

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const deltaZ = z2 - z1;

  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);

  return distance;
}
