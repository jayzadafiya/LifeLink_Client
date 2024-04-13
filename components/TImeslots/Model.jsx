import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function Modal({ open, children }) {
  const [isClient, setIsClient] = useState(false);
  const dialog = useRef();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (open) {
        dialog.current.showModal();
      } else {
        dialog.current.close();
      }
    }
  }, [open, isClient]);

  if (!isClient) return null;

  return createPortal(
    <dialog className="modal" ref={dialog}>
      <section>
        <div className="">{open ? children : null}</div>
      </section>
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
