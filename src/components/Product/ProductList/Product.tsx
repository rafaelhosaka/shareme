import { useEffect, useState } from "react";
import { useBase64File } from "../../../hook/useBase64File";
import { ProductEntity } from "../../../models/product";
import { productImageDownload } from "../../../services/productService";
import ProductModal from "../../Modal/ProductModal";
import Spinner from "../../Spinner/Spinner";
import css from "./Product.module.scss";

interface ProductProps {
  product: ProductEntity;
}

const Product = ({ product }: ProductProps) => {
  const {
    file: productImage,
    executeRequest: productImageDownloadExecute,
    cancelRequest: productImageDownloadCancel,
  } = useBase64File(productImageDownload);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    productImageDownloadExecute(product.id);

    return () => {
      productImageDownloadCancel();
    };
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
        <Spinner show={!productImage}>
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
