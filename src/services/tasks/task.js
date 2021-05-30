import { ObjectID } from "mongodb";
import { db } from "../../lib/mongo";
import parse from "../../lib/parse";
import url from "url";
import settings from "../../lib/settings";
import dateFormat from "dateformat";

class TasksService {
  getValidDocumentForInsert(data) {
    const task = {
      date_created: new Date(),
      date_updated: null,
      customers_ids: [],
      commentaires: [],
      status: false,
    };
    if (data.description !== undefined) {
      task.description = parse.getString(data.description);
    }
    if (data.status !== undefined) {
      task.status = parse.getBoolean(data.status);
    }
    if (data.idCustomer !== undefined) {
      task.idCustomer = parse.getObjectIDIfValid(data.idCustomer);
    }

    if (data.customers_ids !== undefined) {
      task.customers_ids = parse.getArrayOfObjectID(data.customers_ids);
    }

    return task;
  }
  async addTask(data) {
    const task = await this.getValidDocumentForInsert(data);

    const insertResponse = await db.collection("tasks").insertMany([task]);
    const newTaskId = insertResponse.ops[0]._id.toString();

    const newTask = await this.getSingleTask(newTaskId);

    return newTask;
  }
  getValidDocumentForUpdate(data) {
    const task = {
      date_updated: new Date(),
    };

    if (data.status !== undefined) {
      task.status = parse.getBoolean(data.status);
    }

    if (data.customers_ids !== undefined) {
      task.customers_ids = parse.getArrayOfObjectID(data.customers_ids);
    }
    return task;
  }
  async updateTask(id, data) {
    if (!ObjectID.isValid(id)) {
      return { status: false, message: "Invalid identifier" };
    }
    const taskObjectID = new ObjectID(id);
    const task = this.getValidDocumentForUpdate(data);
    await db.collection("tasks").updateOne(
      {
        _id: taskObjectID,
      },
      {
        $set: task,
      }
    );

    const updatedTask = await this.getSingleTask(id);

    return updatedTask;
  }

  getSingleTask(id) {
    if (!ObjectID.isValid(id)) {
      return { status: false, message: "Invalid identifier" };
    }
    return this.getTask({ id }).then((items) =>
      items.data.length > 0 ? items.data[0] : {}
    );
  }

  async deleteTask(id) {
    if (!ObjectID.isValid(id)) {
      return { status: false, message: "Invalid identifier" };
    }
    const taskObjectID = new ObjectID(id);

    const deleteResponse = await db
      .collection("tasks")
      .deleteOne({ _id: taskObjectID });

    return deleteResponse.deletedCount > 0;
  }

  getFilter(params = {}) {
    const filter = {};
    const id = parse.getObjectIDIfValid(params.id);
    const idCustomer = parse.getObjectIDIfValid(params.idCustomer);
    const delet = parse.getBoolean(params.delete);
    if (id) {
      filter._id = id;
    }

    if (idCustomer && !delet) {
      filter.$or = [
        {
          idCustomer: idCustomer,
        },
        {
          customers_ids: idCustomer,
        },
      ];
    } else if (idCustomer && delet) {
      filter.idCustomer = idCustomer;
    }

    return filter;
  }

  getTask(params = {}) {
    const filter = this.getFilter(params);
    const limit = parse.getNumberIfPositive(params.limit) || 10000000;
    const offset = parse.getNumberIfPositive(params.offset) || 0;
    return Promise.all([
      db
        .collection("tasks")
        .find(filter)
        .sort({ date_created: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      db.collection("tasks").countDocuments(filter),
    ]).then(([tasks, tasksCount]) => {
      const items = tasks.map((task) => this.changeProperties(task));
      const result = {
        total_count: tasksCount,
        has_more: offset + items.length < tasksCount,
        offset: offset,
        data: items,
      };
      return result;
    });
  }

  changeProperties(task) {
    if (task) {
      task.id = task._id.toString();
      delete task._id;
    }
    return task;
  }
}

export default new TasksService();
