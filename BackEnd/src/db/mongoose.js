const mongoose = require("mongoose");
const dataBaseName = "demo-app";
const host = "127.0.0.1";
const port = 27017;

const uri = `mongodb://${host}:${port}/${dataBaseName}`;
mongoose.connect(uri, { useNewUrlParser: true });
