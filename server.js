var express = require('express');
var cors = require('cors')
var { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql');
var app = express();

app.use(cors())

var fakeDatabase = [
  { id: 0, fullName: 'Dujthep Taichan', nickName: 'Stop' },
  { id: 1, fullName: 'Test Test', nickName: 'Rain' }
];

var informationType = new graphql.GraphQLObjectType({
  name: 'Information',
  fields: {
    id: { type: graphql.GraphQLInt },
    fullName: { type: graphql.GraphQLString },
    nickName: { type: graphql.GraphQLString },
  }
});

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    getInformation: {
      type: informationType,
      args: {
        id: { type: graphql.GraphQLInt }
      },
      resolve: (_, {id}) => {
        return fakeDatabase.find(r => r.id == id);
      }
    }, 
    getAll: {
      type: new graphql.GraphQLList(informationType),
      resolve: () => {
        return fakeDatabase;
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');