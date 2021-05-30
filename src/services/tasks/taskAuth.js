import { ObjectID } from "mongodb";
import { db } from "../../lib/mongo";
import parse from "../../lib/parse";
import CustomersService from "../customers/customer";
import TasksService from "./task";

class TasksAuthService {
  async getTask(req, res, next) {
    if (req.user !== undefined) {
      var id = parse.getString(req.user.id);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;

        //get tasks
        const ResultTasks = await TasksService.getTask({
          idCustomer: customer.id,
        });

        return ResultTasks;
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }

  async addTask(req, res, next) {
    if (req.user !== undefined) {
      var id = parse.getString(req.user.id);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;
        const data = {
          ...req.body,
          ...{ idCustomer: customer.id },
        };
        //add task
        const ResultTasks = await TasksService.addTask(data);
        return ResultTasks;
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }
  async updateTask(req, res, next) {
    if (req.user !== undefined) {
      var id = parse.getString(req.user.id);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        //update task
        const ResultTasks = await TasksService.updateTask(
          req.params.id,
          req.body
        );
        return ResultTasks;
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }
  async deleteTask(req, res, next) {
    if (req.user !== undefined) {
      var id = parse.getString(req.user.id);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;
        const ResultTask = await TasksService.getTask({
          id: req.params.id,
          idCustomer: customer.id,
          delete: true,
        }).then((items) => {
          return items.data.length > 0
            ? { status: true, data: items.data[0] }
            : { status: false };
        });
        if (ResultTask.status) {
          return await TasksService.deleteTask(req.params.id);
        }
        return {
          status: false,
          message: "have not access",
        };
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }

  async commentaireTask(req, res) {
    if (req.user !== undefined) {
      var id = parse.getString(req.user.id);
      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;
        const { id } = req.params;

        const taskObjectID = new ObjectID(id);

        const commentaireData = {
          id: new ObjectID(),
          idCustomer: customer.id,
          nameCustomer: customer.name,
          description: req.body.description,
        };

        await db.collection("tasks").updateOne(
          {
            _id: taskObjectID,
          },
          {
            $push: { commentaires: commentaireData },
          }
        );
        return await TasksService.getSingleTask(id);
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }
  async getSingleTask(req, res, next) {
    if (req.user !== undefined) {
      var id = parse.getString(req.user.id);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;

        //get tasks
        const ResultTasks = await TasksService.getTask({
          idCustomer: customer.id,
          id: req.params.id,
        });

        return ResultTasks;
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }
}

export default new TasksAuthService();
