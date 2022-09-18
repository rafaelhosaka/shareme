import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBase64Image } from "../../hook/useBase64Image";
import { ProductEntity } from "../../models/product";
import { productImageDownload } from "../../services/productService";
import { userImageDownload } from "../../services/userService";
import { fullName } from "../../utils/formatedNames";
import css from "./ProductModal.module.scss";

interface ModalProps {
  product: ProductEntity;
  show?: boolean;
  onReject: () => void;
}

const ProductModal = ({ product, show, onReject }: ModalProps) => {
  const { image: productImage, setService: setProductService } =
    useBase64Image(null);
  const { image: userImage, setService: setUserImageService } =
    useBase64Image(null);

  useEffect(() => {
    setProductService(productImageDownload(product.id));
    setUserImageService(userImageDownload(product.user.id));
  }, []);

  return show ? (
    <div className={css["modal__container"]}>
      <div className={css["product-modal"]}>
        <div className={css["image__container"]}>
          <img className={css["product-image"]} src={productImage} />
        </div>
        <div>
          <div className={css["header"]}>
            <div className={css["user"]}>
              <Link to={`/profile/${product.user.id}/posts`}>
                <img className={css["user-image"]} src={userImage} />
              </Link>
              <Link to={`/profile/${product.user.id}/posts`}>
                <div className={css["user-name"]}>{fullName(product.user)}</div>
              </Link>
            </div>
            <div
              onClick={() => onReject()}
              className={`${css["thumbnail__close"]} m1 size--40`}
            >
              <i className={`${css["close__icon"]} fa-solid fa-xmark`}></i>
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
  ) : (
    <></>
  );
};

export default ProductModal;
