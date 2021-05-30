import express from "express";
import TasksRoute from "./routes/tasks";
import CustomersRoute from "./routes/customer";

const router = express.Router();

new TasksRoute(router);
new CustomersRoute(router);

export default router;
