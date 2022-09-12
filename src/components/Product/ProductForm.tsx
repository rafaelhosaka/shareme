import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useInput } from "../../hook/useInput";
import { getTranslatedCategory } from "../../models/product";
import { UserProfileDTO } from "../../models/userProfile";
import {
  createProduct,
  getCategories,
  getCurrencies,
} from "../../services/productService";
import { useAlert } from "../Alert/Alert";
import Spinner from "../Spinner/Spinner";
import css from "./ProductForm.module.scss";

const ProductForm = () => {
  const { user: currentUser } = useUser();
  const userImage = useUserImage();
  const { t } = useTranslation();

  const { value: title, bind: bindTitle, reset: resetTitle } = useInput("");
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");
  const { value: price, bind: bindPrice, reset: resetPrice } = useInput("");
  const {
    value: category,
    bind: bindCategory,
    reset: resetCategory,
  } = useInput("");
  const [categories, setCategories] = useState([]);
  const {
    value: currency,
    bind: bindCurrency,
    reset: resetCurrency,
  } = useInput("");
  const [currencies, setCurrencies] = useState([]);

  const [submitting, setSubmmiting] = useState(false);
  const [alert, dispatchAlert] = useAlert();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length !== 0) {
        dispatchAlert("Invalid type", "danger");
        fileRejections = [];
      } else {
        setFiles(acceptedFiles);
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop,
    accept: {
      "image/*": [],
    },
  });

  useEffect(() => {
    async function init() {
      const { data: categories } = await getCategories();
      setCategories(categories);
      const { data: currencies } = await getCurrencies();
      setCurrencies(currencies);
    }
    init();
  }, []);

  const handleClose = () => {
    setFiles([]);
  };

  const renderPreview = () => {
    if (files.length === 0) return getDropZone();

    return getThumbnail();
  };

  const getDropZone = () => {
    return (
      <div {...getRootProps({ className: css.dropzone })}>
        <input {...getInputProps()} />
        <div className={css["dropzone__label"]}>
          {t("MARKETPLACE.addPhoto")}
        </div>
        <div className={css["dropzone__sublabel"]}>
          {t("MARKETPLACE.dragDrop")}
        </div>
      </div>
    );
  };

  const getThumbnail = () => {
    return (
      <div className={css.thumbnail}>
        <div
          onClick={() => handleClose()}
          className={`${css["thumbnail__close"]} m1 size--40`}
        >
          <i className={`${css["close__icon"]} fa-solid fa-xmark`}></i>
        </div>
        <div className={files.length <= 1 ? "" : "grid--2x1"}>
          {files.map((file) => (
            <img
              className={css["thumbnail__image"]}
              key={file.name}
              src={URL.createObjectURL(file)}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setSubmmiting(true);
      e.preventDefault();
      if (currentUser) {
        const formData = new FormData();
        formData.append(
          "product",
          JSON.stringify({
            title,
            price,
            description,
            category,
            currency,
            user: new UserProfileDTO(currentUser),
          })
        );
        formData.append("file", files[0]);
        createProduct(formData);
        handleClose();
        reset();
        setSubmmiting(false);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const reset = () => {
    resetDescription();
    resetPrice();
    resetTitle();
    resetCategory();
    resetCurrency();
  };

  return (
    <div className={`${css["form__container"]} my-2`}>
      {alert}
      <header>
        <h1 className={`${css.heading} my-2`}>
          {t("MARKETPLACE.createListing")}
        </h1>
      </header>
      <form
        className="p2"
        onSubmit={(e) => {
          setSubmmiting(true);
          handleSubmit(e);
        }}
      >
        <div className={css.user}>
          <Link to={`/profile/${currentUser?.id}/posts`}>
            <Spinner show={!userImage} sizeClass="size--60">
              <img
                className={`${css["user-image"]} size--60`}
                src={userImage}
              />
            </Spinner>
          </Link>
          <Link
            className={css["user-name"]}
            to={`/profile/${currentUser?.id}/posts`}
          >
            {currentUser?.fullName}
          </Link>
        </div>

        <span className="form-label">{t("MARKETPLACE.title")}</span>
        <div className="form-group">
          <input className={css.field} {...bindTitle} />
        </div>

        <span className="form-label">{t("MARKETPLACE.price")}</span>
        <div className={`${css["price"]}`}>
          <select className={css.field} {...bindCurrency} required>
            <option value=""></option>
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input type="number" className={css.field} {...bindPrice} />
        </div>

        <span className="form-label">{t("MARKETPLACE.image")}</span>
        <div className="form-group">{renderPreview()}</div>

        <span className="form-label">{t("MARKETPLACE.description")}</span>
        <div className="form-group">
          <textarea className={css.field} {...bindDescription} />
        </div>

        <span className="form-label">{t("MARKETPLACE.category")}</span>
        <div className="form-group">
          <select className={`${css.field}`} {...bindCategory}>
            <option value=""></option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {getTranslatedCategory(c, t)}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={submitting}
          className="btn my-2 btn--primary btn--stretched"
        >
          {t("MARKETPLACE.create")}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
