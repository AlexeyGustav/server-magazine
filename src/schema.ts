export const typeDefs = `#graphql
  type PriceFilter {
    label: String!
    min: Int!
    max: Int!
    currency: String!
  }

  type CheckboxFilter {
    label: String!
    options: [String!]!
  }

  type Filters {
    price: PriceFilter!
    additional: CheckboxFilter!
    material: CheckboxFilter!
    color: CheckboxFilter!
    style: CheckboxFilter!
  }

  type Product {
    id: Int!
    img: String!
    title: String!          # категория
    description: String!
    text: String!
    oldPrice: String
    newPrice: String!
    additional: String      # метка: "Скидка" | "Новинка" | "Хит"
    material: [String!]!
    color: [String!]!
    style: [String!]!
    price: Int!
  }

  type Catalog {
    categories: [String!]!
    filters: Filters!
    products: [Product!]!
  }

  type Query {
    # весь каталог разом (категории + фильтры + товары)
    catalog: Catalog!
  }
`;
