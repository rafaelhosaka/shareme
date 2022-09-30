import { useEffect, useState } from "react";
import { useBase64Image } from "../../../hook/useBase64Image";
import { ProductEntity } from "../../../models/product";
import { productImageDownload } from "../../../services/productService";
import ProductModal from "../../Modal/ProductModal";
import Spinner from "../../Spinner/Spinner";
import css from "./Product.module.scss";

interface ProductProps {
  product: ProductEntity;
}

const Product = ({ product }: ProductProps) => {
  const { image: productImage, setService: setProductService } =
    useBase64Image(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setProductService(productImageDownload(product.id));
  }, []);

  return (
    <div className={css["product__container"]}>
      <ProductModal
        product={product}
        show={showModal}
        onReject={() => setShowModal(false)}
      />
      <div
        className={css["image__container"]}
        onClick={() => setShowModal(true)}
      >
        <Spinner show={!productImage} sizeClass="size--400">
          <img className={css["product-image"]} src={productImage} />
        </Spinner>
      </div>
      <div>
        <div className={css["price"]}>
          {product.currency}
          {product.price}
        </div>
        <div className={css["title"]}>{product.title}</div>
      </div>
    </div>
  );
};

export default Product;
