import { useEffect } from "react";
import { useBase64Image } from "../../../hook/useBase64Image";
import { ProductEntity } from "../../../models/product";
import { productImageDownload } from "../../../services/productService";
import css from "./Product.module.scss";

interface ProductProps {
  product: ProductEntity;
}

const Product = ({ product }: ProductProps) => {
  const { image: productImage, setService: setProductService } =
    useBase64Image(null);

  useEffect(() => {
    setProductService(productImageDownload(product.id));
  }, []);

  return (
    <div className={css["product__container"]}>
      <img className={css["product-image"]} src={productImage} />
      <div className={css["price"]}>
        {product.currency}
        {product.price}
      </div>
      <div className={css["title"]}>{product.title}</div>
    </div>
  );
};

export default Product;
