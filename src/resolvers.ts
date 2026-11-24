import { catalog } from "./data";

export const resolvers = {
  Query: {
    catalog: () => catalog,
  },
};
