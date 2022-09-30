import { useTranslation } from "react-i18next";
import { ProductEntity } from "../../../models/product";
import Product from "./Product";
import css from "./Product.module.scss";

interface ProductListProps {
  products: ProductEntity[];
}

const ProductList = ({ products }: ProductListProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${css["product-list__container"]}  ${
        products.length !== 0 && css["grid"]
      }`}
    >
      {products.length === 0 && (
        <div className={css["no-product"]}>{t("MARKETPLACE.noProducts")}</div>
      )}
      {products.map((p) => (
        <Product key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;
