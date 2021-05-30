import { ObjectID } from "mongodb";
import { db } from "../../lib/mongo";
import parse from "../../lib/parse";

class CustomersService {
  getValidDocumentForInsert(data) {
    const customer = {
      date_created: new Date(),
      date_updated: null,
    };
    customer.name = parse.getString(data.name);
    customer.email = parse.getString(data.email);
    customer.password = parse.getString(data.password);

    return customer;
  }

  async addCustomer(data) {
    const customer = await this.getValidDocumentForInsert(data);
    // is email unique
    if (customer.email && customer.email.length > 0) {
      const customerCount = await db
        .collection("customers")
        .countDocuments({ email: customer.email });
      if (customerCount > 0) {
        return { status: false, message: "Customer email must be unique" };
      }
    }

    const insertResponse = await db
      .collection("customers")
      .insertMany([customer]);
    const newCustomerId = insertResponse.ops[0]._id.toString();
    const newCustomer = await this.getSingleCustomer(newCustomerId);

    return newCustomer;
  }

  getFilter(params = {}) {
    const filter = {};
    const id = parse.getObjectIDIfValid(params.id);
    const name = parse.getString(params.name);
    const email = parse.getString(params.email);

    if (id) {
      filter._id = new ObjectID(id);
    }

    if (email != "") {
      filter.email = email.toLowerCase();
    }

    if (name != "") {
      filter.name = name;
    }

    return filter;
  }

  getCustomers(params = {}) {
    const filter = this.getFilter(params);
    const limit = parse.getNumberIfPositive(params.limit) || 10000000;
    const offset = parse.getNumberIfPositive(params.offset) || 0;
    return Promise.all([
      db
        .collection("customers")
        .find(filter)
        .sort({ date_created: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      db.collection("customers").countDocuments(filter),
    ]).then(([customers, customersCount]) => {
      const items = customers.map((customer) =>
        this.changeProperties(customer)
      );
      const result = {
        total_count: customersCount,
        has_more: offset + items.length < customersCount,
        offset: offset,
        data: items,
      };

      return result;
    });
  }
  changeProperties(customer) {
    if (customer) {
      customer.id = customer._id.toString();
      delete customer._id;
    }
    return customer;
  }
  getSingleCustomer(id) {
    if (!ObjectID.isValid(id)) {
      return { status: false, message: "Invalid identifier" };
    }
    return this.getCustomers({ id }).then((items) =>
      items.data.length > 0 ? items.data[0] : {}
    );
  }
}

export default new CustomersService();
