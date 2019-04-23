import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import ApolloClient from 'apollo-client';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';

import { testSchema as typeDefs } from 'apollos-church-api';

import cache from '../cache';
import { resolvers, schema, defaults } from '../../store';

// eslint-disable-next-line
export default (props) => {
  let finalProps = props;
  // eslint-disable-next-line
  if (!props.mocks) {
    // eslint-disable-next-line
    finalProps = { ...props, resolvers };
  }
  return <MockedProvider {...finalProps} />;
};

const serverSchema = makeExecutableSchema({
  typeDefs,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});
addMockFunctionsToSchema({ schema: serverSchema });

const link = new SchemaLink({ schema: serverSchema });
cache.writeData({ data: defaults });

export const client = new ApolloClient({
  link,
  cache,
  resolvers,
  typeDefs: schema,
});
