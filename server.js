require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const AdmZip = require("adm-zip");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "public")));

app.post("/downloadCertificates", (req, res) => {
  console.log(req.body);
  // const zip = AdmZip();
  // for (let i = 0; i < req.body.certificates.length; i++) {
  //   zip.addLocalFile(req.body.certificates[i]);
  // }

  // const zipFolderName = "Certificates.zip";

  // const data = zip.toBuffer();

  // res.set("Content-Type", "application/octet-stream");
  // res.set("Content-Disposition", `attachment; filename=${zipFolderName}`);
  // res.set("Content-Length", data.length);
  // res.send(data);
});

app.listen(process.env.port || 5000, () => {
  console.log("Server is listening");
});
