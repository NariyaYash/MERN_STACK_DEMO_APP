const cors = require("cors");
const express = require("express");
require("./db/mongoose");
const cookieParser = require("cookie-parser");
const usersRoutes = require("./routes/userRoutes");

const app = express();

app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(usersRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server is up on port: ", port));
