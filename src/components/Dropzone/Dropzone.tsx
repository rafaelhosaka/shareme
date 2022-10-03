import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import css from "./Dropzone.module.scss";

interface DropzoneProps {
  files: File[];
  onSelect: (files: File[]) => void;
  onClose: () => void;
  onError?: (message: string) => void;
  acceptVideo?: boolean;
  maxFiles?: number;
}

const Dropzone = ({
  files,
  onSelect,
  onClose,
  onError,
  acceptVideo = false,
  maxFiles = 1,
}: DropzoneProps) => {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length !== 0) {
        if (onError) {
          onError("DROPZONE.alertInvalidFileType");
        }
        fileRejections = [];
      } else {
        onSelect(acceptedFiles);
      }
    },
    []
  );

  let accept;
  if (acceptVideo) {
    accept = { "image/*": [], "video/*": [] };
  } else {
    accept = { "image/*": [] };
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop,
    accept: accept,
    maxFiles: maxFiles,
    useFsAccessApi: false,
  });

  const getDropZone = () => {
    return (
      <div {...getRootProps({ className: css.dropzone })}>
        <input {...getInputProps()} />
        <div className={css["dropzone__label"]}>
          {acceptVideo ? t("DROPZONE.addPhotoVideo") : t("DROPZONE.addPhoto")}
        </div>
        <div className={css["dropzone__sublabel"]}>
          {t("DROPZONE.dragDrop")}
        </div>
      </div>
    );
  };

  const getThumbnail = () => {
    return (
      <div className={css.thumbnail}>
        <div
          onClick={onClose}
          className={`${css["thumbnail__close"]} m1 size--40`}
        >
          <i className={`${css["close__icon"]} fa-solid fa-xmark`}></i>
        </div>
        <div className={files.length <= 1 ? "" : "grid--2x1"}>
          {files.map((file) => (
            <>
              {file.type.startsWith("image") ? (
                <img
                  className={css["thumbnail__image"]}
                  key={file.name}
                  src={URL.createObjectURL(file)}
                />
              ) : (
                <video
                  className={css["thumbnail__image"]}
                  controls
                  controlsList="nodownload"
                >
                  <source src={URL.createObjectURL(file)} />
                </video>
              )}
            </>
          ))}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    if (files.length === 0) return getDropZone();

    return getThumbnail();
  };

  return <div>{renderPreview()}</div>;
};

export default Dropzone;
