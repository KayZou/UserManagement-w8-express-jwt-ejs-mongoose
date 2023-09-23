require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    app: "user management, mainly backend",
  });
});

app.use("/users", userRoute);
app.use("/admins", adminRoute);
const port = process.env.PORT || 4000;

app.get("*", (req, res) => {
  res.render("404");
});
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, (req, res) => {
      console.log(`mconnecti l DB, o listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
// mongodb+srv://elghe:HwZ2LEMzqrig9kTo@cluster0.vj32cse.mongodb.net/UserMang?retryWrites=true&w=majority
