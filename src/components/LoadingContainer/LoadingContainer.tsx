import { useTranslation } from "react-i18next";
import css from "./LoadingContainer.module.scss";

interface LoadingContainerProps {
  labelSize?: "small" | "medium" | "large";
  showBackground?: boolean;
}

const LoadingContainer = ({
  labelSize = "small",
  showBackground = true,
}: LoadingContainerProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${css["container"]} ${showBackground && css["background"]}`}
    >
      <span className={`${css["label"]} ${css[labelSize]}`}>
        {t("loading")}
      </span>
    </div>
  );
};

export default LoadingContainer;
