const data = "g0 x379.89814843 y482.11352419 f1213";
const d = data.split(" ");
let res = data;
const coord = [0, 0, 0];
console.table(d);

//Précision vitesse de déplacement
if (d[0].toLowerCase() === "g0") {
  if (d[1].slice(0, 1).toLowerCase() === "z") {
    res = data + " f" + 1000;
    d.push("f" + 1000);
  }
  if (
    d[1].slice(0, 1).toLowerCase() === "x" ||
    d[1].slice(0, 1).toLowerCase() === "y"
  ) {
    res = data + " f" + 1000;
    d.push("f" + 1000);
  }
}
console.log("d length: " + d.length);
console.table(d);

//Calcul du temps de parcours
if (d[0].toLowerCase() === "g0" || d[0].toLowerCase() === "g1") {
  const coordFutur = JSON.parse(JSON.stringify(coord));
  let speed = 1000;
  for (let i = 1; i < d.length; i++) {
    console.log(i);
    console.log(d[i].slice(0, 1).toLowerCase());
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
    }
    if (d[i].slice(0, 1).toLowerCase() === "f") {
      let a = d[i].toLowerCase().replace("f", "");
      speed = parseFloat(a);
    }
  }
  let dist = calculateDistance(coord, coordFutur);
  console.log(coord);
  console.log(coordFutur);
  console.log(speed);
  console.log(dist);
  let tpsMin = dist / speed;
  console.log("tps : " + tpsMin);
}

function calculateDistance(pointA, pointB) {
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
