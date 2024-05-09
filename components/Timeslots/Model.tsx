import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function Modal({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}): React.JSX.Element {
  const [isClient, setIsClient] = useState<boolean>(false);
  const dialog = useRef<any>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensures that these operations are performed only in the client-side environment
  useEffect(() => {
    if (isClient) {
      if (open) {
        dialog.current?.showModal();
      } else {
        dialog.current?.close();
      }
    }
  }, [open, isClient]);

  if (!isClient) return <></>;

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return <></>;

  return createPortal(
    <dialog className="modal" ref={dialog}>
      <section>
        <div className="">{open ? children : null}</div>
      </section>
    </dialog>,
    modalRoot
  );
}

export default Modal;
