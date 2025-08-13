import React from "react";
import { modalStyles as style } from "../assets/dummystyle";
import { X } from "lucide-react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className={style.overlay}>
      <div className={style.container}>
        {!hideHeader && (
          <div className={style.header}>
            <h3 className={style.title}>{title}</h3>
            {showActionBtn && (
              <button className={style.actionButton} onClick={onActionClick}>
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}

        <button type="button" className={style.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
        <div className={style.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
