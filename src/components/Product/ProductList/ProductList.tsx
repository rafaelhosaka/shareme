import { ProductEntity } from "../../../models/product";
import Product from "./Product";
import css from "./Product.module.scss";

interface ProductListProps {
  products: ProductEntity[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className={css["product-list__container"]}>
      {products.map((p) => (
        <Product key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
