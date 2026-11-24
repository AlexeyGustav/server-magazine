export interface PriceFilter {
  label: string;
  type: "range";
  min: number;
  max: number;
  currency: string;
}

export interface CheckboxFilter {
  label: string;
  type: "checkbox";
  options: string[];
}

export interface Filters {
  price: PriceFilter;
  additional: CheckboxFilter;
  material: CheckboxFilter;
  color: CheckboxFilter;
  style: CheckboxFilter;
}

export interface Product {
  id: number;
  img: string;
  title: string;
  description: string;
  text: string;
  oldPrice: string | null;
  newPrice: string;
  additional: string | null;
  material: string[];
  color: string[];
  style: string[];
  price: number;
}

export interface CatalogData {
  categories: string[];
  filters: Filters;
  products: Product[];
}
