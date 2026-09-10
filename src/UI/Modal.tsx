import { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [portalTarget, setPortalTarget] = useState<Element | null>(null);

    useEffect(() => {
        // Resolve the portal target after mount so the DOM is guaranteed ready.
        setPortalTarget(document.getElementById('modal') ?? document.body);
    }, []);

    useEffect(() => {
        const modal = dialog.current;
        if (!modal) return;
        modal.showModal();

        return () => {
            modal.close(); // needed to avoid error being thrown
        };
    }, [portalTarget]); // re-run once the target (and therefore the dialog) is in the DOM

    // Clicking the backdrop (the <dialog> element itself, not its content)
    // should close the modal, same as pressing Escape.
    function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
        if (event.target === dialog.current) {
            dialog.current?.close();
        }
    }

    if (!portalTarget) return null;

    // The native `close` event covers Escape, backdrop clicks (handled
    // above), and any imperative .close() call, so onClose catches all of them.
    return createPortal(
        <dialog
            className="modal"
            ref={dialog}
            onClose={onClose}
            onClick={handleBackdropClick}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </dialog>,
        portalTarget
    );
}