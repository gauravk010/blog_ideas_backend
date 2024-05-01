const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config");
const PORT = process.env.PORT || 5000;

const app = express();
ConnectDB();
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname));

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/blog"));

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
