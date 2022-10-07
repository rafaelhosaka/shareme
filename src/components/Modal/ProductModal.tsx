import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBase64File } from "../../hook/useBase64File";
import { ProductEntity } from "../../models/product";
import { productImageDownload } from "../../services/productService";
import { userImageDownload } from "../../services/userService";
import { fullName } from "../../utils/formatedNames";
import Spinner from "../Spinner/Spinner";
import css from "./ProductModal.module.scss";

interface ModalProps {
  product: ProductEntity;
  show?: boolean;
  onReject: () => void;
}

const ProductModal = ({ product, show, onReject }: ModalProps) => {
  const {
    file: productImage,
    executeRequest: productImageDownloadExecute,
    cancelRequest: productImageDownloadCancel,
  } = useBase64File(productImageDownload);
  const {
    file: userImage,
    executeRequest: userImageDownloadExecute,
    cancelRequest: userImageDownloadCancel,
  } = useBase64File(userImageDownload);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    productImageDownloadExecute(product.id);
    userImageDownloadExecute(product.user.id);

    return () => {
      productImageDownloadCancel();
      userImageDownloadCancel();
    };
  }, []);

  useEffect(() => {
    if (show) {
      setVisible(show);
    } else {
      setTimeout(() => {
        setVisible(show);
      }, 300);
    }
  }, [show]);

  return (
    <div
      className={
        visible
          ? css["modal__container"]
          : `${css["modal__container"]} ${css["close"]}`
      }
    >
      <div
        className={
          show
            ? css["product-modal"]
            : `${css["product-modal"]} ${css["close"]}`
        }
      >
        <div
          onClick={() => onReject()}
          className={`${css["thumbnail__close"]} m1 size--40`}
        >
          <i className={`${css["close__icon"]} fa-solid fa-xmark`}></i>
        </div>
        <div className={css["image__container"]}>
          <img className={css["background-image"]} src={productImage} />
          <img className={css["product-image"]} src={productImage} />
        </div>
        <div>
          <div className={css["header"]}>
            <div className={css["user"]}>
              <Link to={`/profile/${product.user.id}/posts`}>
                <Spinner show={!userImage} sizeClass="size--60">
                  <img className={css["user-image"]} src={userImage} />
                </Spinner>
              </Link>
              <Link to={`/profile/${product.user.id}/posts`}>
                <div className={css["user-name"]}>{fullName(product.user)}</div>
              </Link>
            </div>
          </div>
          <div className={css["body"]}>
            <div className={css["title"]}>{product.title}</div>
            <div className={css["price"]}>
              {product.currency}
              {product.price}
            </div>
            <div className={css["description"]}>{product.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
