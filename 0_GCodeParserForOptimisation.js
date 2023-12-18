const readline = require("readline");
const fs = require("fs");

let inputFile = "abc.nc"; // Replace with your input file
let outputFile = "output_file.txt"; // Replace with your output file

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

main();

async function main() {
  //inputFile = await question("Nom du fichier scr : ");
  //outputFile = await question("Nom du fichier destination : ");
  const solInit = await processFile();
  console.log("Ah ah !");
  //console.table(solInit);
  const aa = optimisation(solInit);
  ecrireFichierDest(aa);
}
function question(prompt) {
  return new Promise((resolve, reject) => {
    rl.question(`** ${prompt} : `, (input) => {
      resolve(input);
    });
  });
}

function processFile() {
  return new Promise((resolve) => {
    const fileStream = fs.createReadStream(inputFile);
    const outputStream = fs.createWriteStream(outputFile);
    const tableauOperation = [];
    // Create a readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Detects line endings correctly on Windows as well
    });

    // Event handler for each line read
    rl.on("line", (line) => {
      const l = line.toLowerCase().split(" ");

      if (l[0] == "g0" && l[1].substr(0, 1) != "z") {
        tableauOperation.push({
          xStart: parseFloat(l[1].replace("x", "")),
          yStart: parseFloat(l[2].replace("y", "")),
          xEnd: 0,
          yEnd: 0,
          zStart: 999,
          op: [line],
        });
      } else {
        //console.log(line);
        if (tableauOperation[tableauOperation.length - 1]) {
          if (
            l[0] == "g1" &&
            l[1].substr(0, 1) == "z" &&
            tableauOperation[tableauOperation.length - 1].op.length == 1
          ) {
            tableauOperation[tableauOperation.length - 1].zStart = parseFloat(
              l[1].replace("z", "")
            );
          }
          //On renseigne ou se tr
          if (l[0] == "g1" && l[1].substr(0, 1) == "x") {
            tableauOperation[tableauOperation.length - 1].xEnd = parseFloat(
              l[1].replace("x", "")
            );
            tableauOperation[tableauOperation.length - 1].yEnd = parseFloat(
              l[2].replace("y", "")
            );
          }
          if (l[0] == "g1" && l[1].substr(0, 1) == "z") {
            tableauOperation[tableauOperation.length - 1].zEnd = parseFloat(
              l[1].replace("z", "")
            );
          }

          tableauOperation[tableauOperation.length - 1].op.push(line);
        }
      }
    });

    // Event handler when the entire file is read
    rl.on("close", () => {
      console.log("File reading finished.");
      console.table(tableauOperation);
      resolve(tableauOperation);
    });
  });
}
function optimisation(data) {
  const chemin = [];
  const ptRestant = data;
  let baryCentre = {};
  let ecartTypeDist = 999999;
  maj_ptRestant(0, 0);

  while (ptRestant.length > 0) {
    //Trie du tableau depoint
    ptRestant.sort((a, b) => a.score - b.score || b.zEnd - a.zEnd);
    //console.table(ptRestant);
    //On ajoute le premier elt au chemin
    chemin.push(ptRestant[0]);
    const position = { x: ptRestant[0].xEnd, y: ptRestant[0].yEnd };
    //On retire le premier pt de ptRestant
    ptRestant.shift();
    maj_ptRestant(position.x, position.y);
  }

  const res = chemin.map((t) => t.op);

  //console.table(res);
  return res;

  //Mise à jour des valeurs pts restants
  function maj_ptRestant(posX, posY) {
    const tabPtStart = [];
    const tabDist = [];
    ptRestant.forEach((item) => {
      item.distance = Math.sqrt(
        (posX - item.xStart) ** 2 + (posY - item.yStart) ** 2
      );
      tabDist.push(item.distance);
      tabPtStart.push([item.xStart, item.yStart]);
      return item;
    });

    baryCentre = calculerBarycentre(tabPtStart);

    ptRestant.forEach((item, i) => {
      //Calcul de la distance au baryCentre
      item.dstBary = Math.sqrt(
        (baryCentre.x - item.xStart) ** 2 + (baryCentre.y - item.yStart) ** 2
      );
      //Calcul score
      item.score = item.distance - 0.5 * item.dstBary;
      return item;
    });

    ecartTypeDist = calculerEcartType(tabDist);
    console.table(ptRestant);
    console.log({ baryCentre, ecartTypeDist });
  }
}
function distanceTotale(parcours) {
  let distanceTotale = 0;
  for (let i = 0; i < parcours.length - 1; i++) {
    distanceTotale += distance(parcours[i], parcours[i + 1]);
  }
  return distanceTotale;
}
function distance(p1, p2) {
  return Math.sqrt((p1.xEnd - p2.xStart) ** 2 + (p1.yEnd - p2.yStart) ** 2);
}
function calculerBarycentre(points) {
  // Vérifier si le tableau de points n'est pas vide
  if (points.length === 0) {
    return null; // ou une valeur par défaut, selon vos besoins
  }

  // Initialiser les sommes
  let sommeX = 0;
  let sommeY = 0;

  // Calculer les sommes des coordonnées x et y
  for (let i = 0; i < points.length; i++) {
    sommeX += points[i][0];
    sommeY += points[i][1];
  }

  // Calculer les coordonnées du barycentre
  const barycentreX = sommeX / points.length;
  const barycentreY = sommeY / points.length;

  // Retourner le résultat sous forme de tableau [x, y]
  return { x: barycentreX, y: barycentreY };
}
function calculerEcartType(tableau) {
  // Vérifier si le tableau n'est pas vide
  if (tableau.length === 0) {
    return null; // ou une valeur par défaut, selon vos besoins
  }

  // Calculer la moyenne des nombres dans le tableau
  const moyenne =
    tableau.reduce((acc, valeur) => acc + valeur, 0) / tableau.length;

  // Calculer la somme des carrés des écarts par rapport à la moyenne
  const sommeCarresEcarts = tableau.reduce(
    (acc, valeur) => acc + Math.pow(valeur - moyenne, 2),
    0
  );

  // Calculer l'écart-type en prenant la racine carrée de la moyenne des carrés des écarts
  const ecartType = Math.sqrt(sommeCarresEcarts / tableau.length);

  return ecartType;
}

function ecrireFichierDest(data) {
  const outputStream = fs.createWriteStream(outputFile);

  for (i = 0; i < data.length; i++) {
    for (j = 0; j < data[i].length; j++) {
      outputStream.write(data[i][j] + "\n"); // Add a newline character
    }
  }
}
