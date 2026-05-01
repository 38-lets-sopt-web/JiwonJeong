import { createPortal } from "react-dom";
import { ModalBox, Overlay } from "./Modal.styles";

function Modal({ children, isOpen }) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Overlay>
      <ModalBox>{children}</ModalBox>
    </Overlay>,
    document.body,
  );
}

export default Modal;
