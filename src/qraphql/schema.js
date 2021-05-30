const graphql = require("graphql");

import CustomersService from "../services/customers/customer";
import TasksAuthService from "../services/tasks/taskAuthQraph";
import CustomersAuthService from "../services/customers/customerAuth";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const TaskType = new GraphQLObjectType({
  name: "Task",

  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    status: { type: GraphQLBoolean },
    idCustomer: { type: GraphQLString },
    customers_ids: { type: new GraphQLList(GraphQLID) },
    commentaires: { type: new GraphQLList(CommentaireType) },
  }),
});

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});
const CommentaireType = new GraphQLObjectType({
  name: "Commentaire",
  fields: () => ({
    id: { type: GraphQLID },
    idCustomer: { type: GraphQLID },
    nameCustomer: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const RESQETType = new GraphQLObjectType({
  name: "ResponseGET",
  fields: () => ({
    total_count: { type: GraphQLInt },
    has_more: { type: GraphQLBoolean },
    offset: { type: GraphQLInt },
    data: { type: new GraphQLList(CustomerType) },
  }),
});
const RESQETTypeTask = new GraphQLObjectType({
  name: "ResponseGETTask",
  fields: () => ({
    total_count: { type: GraphQLInt },
    has_more: { type: GraphQLBoolean },
    offset: { type: GraphQLInt },
    data: { type: new GraphQLList(TaskType) },
  }),
});

const RESType = new GraphQLObjectType({
  name: "Response",
  fields: () => ({
    status: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    data: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    task: {
      type: TaskType,

      args: { id: { type: GraphQLID }, idCustomer: { type: GraphQLString } },
      resolve(parent, args) {
        return TasksAuthService.getSingleTask(args);
      },
    },
    tasks: {
      type: RESQETTypeTask,
      args: { idCustomer: { type: GraphQLID } },
      resolve(parent, args) {
        return TasksAuthService.getTask(args);
      },
    },
    customer: {
      type: CustomerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return CustomersService.getSingleCustomer(args.id);
      },
    },
    customers: {
      type: RESQETType,
      args: {
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return CustomersService.getCustomers(args);
      },
    },
    login: {
      type: RESType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return CustomersAuthService.login(args);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: RESType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let Customer = {
          name: args.name,
          email: args.email,
          password: args.password,
        };
        return CustomersAuthService.register(Customer);
      },
    },

    addTask: {
      type: TaskType,
      args: {
        description: { type: new GraphQLNonNull(GraphQLString) },
        idCustomer: { type: new GraphQLNonNull(GraphQLID) },
        customers_ids: { type: new GraphQLList(GraphQLID) },
      },
      resolve(parent, args) {
        let task = {
          description: args.description,
          idCustomer: args.idCustomer,
          customers_ids: args.customers_ids,
        };

        return TasksAuthService.addTask(task);
      },
    },

    updateTask: {
      type: TaskType,
      args: {
        status: { type: GraphQLBoolean },
        idCustomer: { type: new GraphQLNonNull(GraphQLID) },
        id: { type: new GraphQLNonNull(GraphQLID) },
        customers_ids: { type: new GraphQLList(GraphQLID) },
      },
      resolve(parent, args) {
        let task = {
          idCustomer: args.idCustomer,
          id: args.id,
          status: args.status,
          customers_ids: args.customers_ids,
        };

        return TasksAuthService.updateTask(task);
      },
    },
    deleteTask: {
      type: RESType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        idCustomer: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return TasksAuthService.deleteTask(args);
      },
    },
    commentaireTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        idCustomer: { type: new GraphQLNonNull(GraphQLID) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return TasksAuthService.commentaireTask(args);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
