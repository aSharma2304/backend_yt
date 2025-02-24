import "dotenv/config";
import init from "./db/initialize.js";
import { app } from "./app.js";
init()
  .then(() => {
    app.on("error", (err) => {
      console.log(err);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed");
  });
