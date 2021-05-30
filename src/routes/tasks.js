import TasksService from "../services/tasks/task";
import security from "../lib/security";
import TasksAuthService from "../services/tasks/taskAuth";

class TasksRoute {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(
      "/task",
      security.checkUserToken.bind(this),
      this.getTask.bind(this)
    );
    this.router.get(
      "/task/:id",
      security.checkUserToken.bind(this),
      this.getSingleTask.bind(this)
    );
    this.router.post(
      "/task",
      security.checkUserToken.bind(this),
      this.addTask.bind(this)
    );
    this.router.put(
      "/task/:id",
      security.checkUserToken.bind(this),
      this.updateTask.bind(this)
    );
    this.router.post(
      "/task/commentaire/:id",
      security.checkUserToken.bind(this),
      this.commentaireTask.bind(this)
    );
    this.router.delete(
      "/task/:id",
      security.checkUserToken.bind(this),
      this.deleteTask.bind(this)
    );
  }

  addTask(req, res, next) {
    TasksAuthService.addTask(req)
      .then((data) => res.send(data))
      .catch(next);
  }
  updateTask(req, res, next) {
    TasksAuthService.updateTask(req)
      .then((data) => res.send(data))
      .catch(next);
  }
  deleteTask(req, res, next) {
    TasksAuthService.deleteTask(req, res)
      .then((data) => res.send(data))
      .catch(next);
  }

  commentaireTask(req, res, next) {
    TasksAuthService.commentaireTask(req, res)
      .then((data) => res.send(data))
      .catch(next);
  }

  getTask(req, res, next) {
    TasksAuthService.getTask(req, res)
      .then((data) => res.send(data))
      .catch(next);
  }
  getSingleTask(req, res, next) {
    TasksAuthService.getSingleTask(req)
      .then((data) => res.send(data))
      .catch(next);
  }
}

export default TasksRoute;
