import { ObjectID } from "mongodb";
import { db } from "../../lib/mongo";
import parse from "../../lib/parse";
import AuthHeader from "../../lib/auth-header";
import CustomersService from "./customer";

class CustomersAuthService {
  async login(data) {
    var { email, password } = data;

    var email = parse.getString(email);
    var password = parse.getString(password);

    const ResultCustomer = await CustomersService.getCustomers({
      email,
    }).then((items) => {
      return items.data.length > 0
        ? { status: true, data: items.data[0] }
        : { status: false };
    });

    if (ResultCustomer.status) {
      var customer = ResultCustomer.data;
      if (customer.password === password) {
        var token = AuthHeader.encodeUserLoginAuth({
          id: customer.id,
          email: customer.email,
        });

        return {
          status: true,
          message: "success",
          data: token,
        };
      }

      return {
        status: false,
        message: "password inValid",
      };
    }

    return {
      status: false,
      message: "email not exist",
    };
  }

  async register(data) {
    var email = parse.getString(data.email);
    var password = parse.getString(data.password);
    var name = parse.getString(data.name);
    const ResultCustomer = await CustomersService.getCustomers({
      email,
    }).then((items) => {
      return items.data.length > 0
        ? { status: true, data: items.data[0] }
        : { status: false };
    });
    if (!ResultCustomer.status) {
      //add customer
      const customer = {
        email: email,
        name: name,
        password: password,
      };

      await CustomersService.addCustomer(customer);
      return {
        status: true,
        message: "Succès d'inscription",
      };
    }

    return {
      status: false,
      message: "déjà inscription",
    };
  }
}

export default new CustomersAuthService();
