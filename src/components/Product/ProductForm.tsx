import { useEffect, useState } from "react";
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
import { fullName } from "../../utils/formatedNames";
import { useAlert } from "../Alert/Alert";
import Dropzone from "../Dropzone/Dropzone";
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

  useEffect(() => {
    async function init() {
      const { data: categories } = await getCategories();
      setCategories(categories);
      const { data: currencies } = await getCurrencies();
      setCurrencies(currencies);
    }
    init();
  }, []);

  const isValid = () => {
    if (files.length === 0) {
      dispatchAlert(t("MARKETPLACE.alertImageEmpty"), "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setSubmmiting(true);
      e.preventDefault();
      if (!isValid()) {
        setSubmmiting(false);
        return;
      }
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
        setFiles([]);
        reset();
        setSubmmiting(false);
        dispatchAlert(t("MARKETPLACE.alertCreateSuccess"), "success");
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
            {fullName(currentUser)}
          </Link>
        </div>

        <span className="form-label">{t("MARKETPLACE.title")}</span>
        <div className="form-group">
          <input className={css.field} {...bindTitle} required />
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
          <input type="number" className={css.field} {...bindPrice} required />
        </div>

        <span className="form-label">{t("MARKETPLACE.image")}</span>
        <div className="form-group">
          <Dropzone
            files={files}
            onSelect={(files: File[]) => setFiles(files)}
            onClose={() => setFiles([])}
            onError={(message: string) => dispatchAlert(t(message), "danger")}
          />
        </div>

        <span className="form-label">{t("MARKETPLACE.description")}</span>
        <div className="form-group">
          <textarea className={css.field} {...bindDescription} required />
        </div>

        <span className="form-label">{t("MARKETPLACE.category")}</span>
        <div className="form-group">
          <select className={`${css.field}`} {...bindCategory} required>
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
