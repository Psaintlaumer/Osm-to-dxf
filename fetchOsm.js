const overpassEndpoint = "https://overpass-api.de/api/interpreter";

const query = `
[bbox:48.3,1.3,48.5,1.5][out:json][timeout:90];
( way["waterway"="river"](48.3,1.3,48.5,1.5);
  way["waterway"="stream"](48.3,1.3,48.5,1.5);
  relation["natural"="water"](48.3,1.3,48.5,1.5);
  relation["water"="river"](48.3,1.3,48.5,1.5);
);
out geom;
`;

fetch(overpassEndpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: `data=${encodeURIComponent(query)}`,
})
  .then((response) => {
    //console.log(response);
    return response.json();
  })
  .then((result) => {
    // Process the result as needed
    console.log(result.elements[0]);
    console.log(result.elements[0].bounds);
    console.log(result.elements[0].tags);
    console.table(result.elements[0].nodes);
    console.table(result.elements[0].geometry);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
