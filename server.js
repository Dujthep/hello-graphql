var express = require('express');
var cors = require('cors')
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var app = express();

app.use(cors())

var schema = buildSchema(`
  input InformationInput {
    fullName: String
    nickName: String
  }

  type Information {
    id: Int!
    fullName: String!
    nickName: String!
  }

  type Query {
    getInformation(id: ID!): Information
    getAll: [Information]
  }

  type Mutation {
    createInformation(input: InformationInput): Information
    updateInformation(id: ID!, input: InformationInput): Information
  }
`);

class Information {
  constructor(id, { fullName, nickName }) {
    this.id = id;
    this.fullName = fullName;
    this.nickName = nickName;
  }
}

var fakeDatabase = [
  { id: 0, fullName: 'Dujthep Taichan', nickName: 'Stop' }
];

var root = {
  getInformation: ({ id }) => {
    const data = fakeDatabase.find(r => r.id == id);
    if (!data) {
      throw new Error('no Information exists with id ' + id);
    }
    return new Information(id, fakeDatabase[id]);
  },
  createInformation: ({ input }) => {
    const id = fakeDatabase.length;
    fakeDatabase.push({...input, id: id});
    return new Information(id, input);
  },
  updateInformation: ({ id, input }) => {
    const data = fakeDatabase.find(r => r.id === id);
    if (!data) {
      throw new Error('no Information exists with id ' + id);
    }
    fakeDatabase[id] = {...input, id: fakeDatabase[id].id};
    return new Information(id, input);
  },
  getAll: () => {
    return fakeDatabase;
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');