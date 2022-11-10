var express = require('express');
var cors = require('cors')
const path = require("path");
var { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql');
var app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, "public")));

var fakeDatabase = [
  { id: 0, fullName: 'Dujthep Taichan', nickName: 'Stop' },
];

var informationType = new graphql.GraphQLObjectType({
  name: 'Information',
  fields: {
    id: { type: graphql.GraphQLInt },
    fullName: { type: graphql.GraphQLString },
    nickName: { type: graphql.GraphQLString },
  }
});

var informationInput = new graphql.GraphQLInputObjectType({
  name: 'InformationInput',
  fields: {
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
      resolve: (_, { id }) => {
        return fakeDatabase.find(r => r.id == id);
      }
    },
    getAll: {
      type: new graphql.GraphQLList(informationType),
      resolve: () => {
        return fakeDatabase;
      }
    },
    createInformation: {
      type: informationType,
      args: {
        input: {
          type: new graphql.GraphQLNonNull(informationInput)
        }
      },
      resolve: (_, { input }) => {
        const data = { ...input, id: fakeDatabase.length };
        fakeDatabase.push(data)
        return data;
      }
    },
    updateInformation: {
      type: informationType,
      args: {
        id: { type: graphql.GraphQLInt },
        input: {
          type: new graphql.GraphQLNonNull(informationInput)
        }
      },
      resolve: (_, { id, input }) => {
        const idx = fakeDatabase.findIndex(r => id == r.id);
        if(idx === -1) {
          throw new Error('No information exits with id ' + id)
        }
        const data = { ...input, id };
        fakeDatabase.splice(idx, 1, data);
        return data;
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({ query: queryType });

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');