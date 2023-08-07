import accountRouter from "../routes/api/account.js";
import userDataRouter from "../routes/api/userData.js";
const configRoutes = (app) => {
  app.use("/api/account", accountRouter);
  app.use("/api/userData", userDataRouter);
  app.use("/", (req, res) => {
    res.status(200).send("Welcome to Champion Online Casino!");
  });
};
export default configRoutes;
