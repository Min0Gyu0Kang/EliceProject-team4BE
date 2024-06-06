const express = require("express");
const { swaggerUi, specs } = require("./swagger/swagger");
require("dotenv").config();
const user = require("./routes/user.js"); // swagger 예제 코드 추후 삭제 예정

const app = express();

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/user", user);

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
