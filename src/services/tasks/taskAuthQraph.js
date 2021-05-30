import { ObjectID } from "mongodb";
import { db } from "../../lib/mongo";
import parse from "../../lib/parse";
import CustomersService from "../customers/customer";
import TasksService from "./task";

class TasksAuthService {
  async addTask(data) {
    if (data.idCustomer !== undefined) {
      var id = parse.getString(data.idCustomer.id);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
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

  async getSingleTask(data) {
    if (data.idCustomer !== undefined) {
      var id = parse.getString(data.idCustomer.id);

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
          id: data.id,
        });

        return ResultTasks;
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }
  async getTask(data) {
    if (data.idCustomer !== undefined) {
      var id = parse.getString(data.idCustomer);

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

  async updateTask(data) {
    if (data.idCustomer !== undefined) {
      var id = parse.getString(data.idCustomer);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        //update task
        const ResultTasks = await TasksService.updateTask(data.id, data);
        return ResultTasks;
      }
    }
    return {
      status: false,
      message: "token_error",
    };
  }

  async deleteTask(data) {
    if (data.idCustomer !== undefined) {
      var id = parse.getString(data.idCustomer);

      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;
        data.delete = true;
        const ResultTask = await TasksService.getTask(data).then((items) => {
          return items.data.length > 0
            ? { status: true, data: items.data[0] }
            : { status: false };
        });

        if (ResultTask.status) {
          const result = await TasksService.deleteTask(data.id);
          return {
            status: result,
          };
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
  async commentaireTask(data) {
    if (data.idCustomer !== undefined) {
      var id = parse.getString(data.idCustomer);
      const ResultCustomer = await CustomersService.getCustomers({
        id,
      }).then((items) => {
        return items.data.length > 0
          ? { status: true, data: items.data[0] }
          : { status: false };
      });

      if (ResultCustomer.status) {
        var customer = ResultCustomer.data;
        const { id } = data;

        const taskObjectID = new ObjectID(id);

        const commentaireData = {
          id: new ObjectID(),
          idCustomer: customer.id,
          nameCustomer: customer.name,
          description: data.description,
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
}

export default new TasksAuthService();
