const { google } = require("googleapis");

const discoveryUrl = "https://keep.googleapis.com/$discovery/rest?version=v1";
// google.discover(discoveryUrl, function (err) {
//   // const keep = google.keep("v1");

//   // console.log(keep);
//   console.log(Object.keys(google));
// });

const main = async () => {
  const foo = await google.discoverAPI(discoveryUrl);

  console.log(foo);
};

main();

// const https = require("https");

// async function main() {
//   const auth = new google.auth.GoogleAuth({
//     // Scopes can be specified either as an array or as a single, space-delimited string.
//     scopes: ["https://keep.googleapis.com"],
//   });
//   const authClient = await auth.getClient();

//   // obtain the current project Id
//   const project = await auth.getProjectId();

//   // Fetch the list of GCE zones within a project.
//   const res = await compute.zones.list({ project, auth: authClient });
//   console.log(res.data);
// }

// main().catch(console.error);

// const data = JSON.stringify({
//   name: "John Doe",
//   job: "DevOps Specialist",
// });

// const options = {
//   protocol: "https:",
//   hostname: "keep.googleapis.com",
//   path: "/v1/notes",
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     "Content-Length": data.length,
//   },
// };

// const req = https
//   .request(options, (res) => {
//     let data = "";

//     res.on("data", (chunk) => {
//       data += chunk;
//     });

//     res.on("end", () => {
//       console.log(JSON.parse(data));
//     });
//   })
//   .on("error", (err) => {
//     console.log("Error: ", err.message);
//   });

// req.write(data);
// req.end();
