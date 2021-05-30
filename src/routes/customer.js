import CustomersService from "../services/customers/customer";
import CustomersAuthService from "../services/customers/customerAuth";
import security from "../lib/security";
class CustomersRoute {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post("/login", this.login.bind(this));

    this.router.post("/register", this.register.bind(this));

    this.router.get(
      "/customer",
      security.checkUserToken.bind(this),
      this.getCustomers.bind(this)
    );

    this.router.get(
      "/customer/:id",
      security.checkUserToken.bind(this),
      this.getSingleCustomers.bind(this)
    );
  }
  register(req, res, next) {
    CustomersAuthService.register(req.body)
      .then((data) => res.send(data))
      .catch(next);
  }

  login(req, res, next) {
    CustomersAuthService.login(req.body)
      .then((data) => res.send(data))
      .catch(next);
  }

  getCustomers(req, res, next) {
    CustomersService.getCustomers(req.query)
      .then((data) => res.send(data))
      .catch(next);
  }
  getSingleCustomers(req, res, next) {
    CustomersService.getSingleCustomer(req.params.id)
      .then((data) => res.send(data))
      .catch(next);
  }
}

export default CustomersRoute;
