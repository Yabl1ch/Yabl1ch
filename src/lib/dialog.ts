import * as React from "react";

let supportsDisplayTransition: boolean | undefined;

function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      window.CSS?.supports?.("overlay", "auto") &&
      canTransitionDisplay()
  );
}

export async function closeTopLayerDialog(dialog: HTMLDialogElement): Promise<void> {
  if (!dialog.open) return;

  if (!supportsTopLayerExit()) {
    dialog.setAttribute("data-closing", "");
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    }
    if (!dialog.hasAttribute("data-closing")) return;
    dialog.removeAttribute("data-closing");
  }

  if (dialog.open) {
    dialog.close();
  }
}

function isPointerOutsideDialog(e: PointerEvent, dialog: HTMLDialogElement): boolean {
  const rect = dialog.getBoundingClientRect();
  return (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  );
}

/**
 * Coordinates native `<dialog>` top-layer lifecycle, animated `Esc` / light-dismiss,
 * Safari `closedby` fallback, and focus return without duplicating boilerplate.
 */
export function useTopLayerDialog(
  dialogRef: React.RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  onClose: () => void
) {
  const isClosingRef = React.useRef(false);

  const requestClose = React.useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open || isClosingRef.current) return;
    isClosingRef.current = true;
    void closeTopLayerDialog(dialog).finally(() => {
      isClosingRef.current = false;
    });
  }, [dialogRef]);

  React.useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      isClosingRef.current = false;
      dialog.removeAttribute("data-closing");
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      requestClose();
    }
  }, [dialogRef, isOpen, requestClose]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };

    const handleClose = () => {
      isClosingRef.current = false;
      dialog.removeAttribute("data-closing");
      dialog.returnValue = "";
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);

    let removeLightDismiss: (() => void) | undefined;
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const handlePointerDown = (e: PointerEvent) => {
        if (!dialog.open) return;
        pressedOutside = isPointerOutsideDialog(e, dialog);
      };
      const handlePointerUp = (e: PointerEvent) => {
        if (dialog.open && pressedOutside && isPointerOutsideDialog(e, dialog)) {
          requestClose();
        }
        pressedOutside = false;
      };
      dialog.addEventListener("pointerdown", handlePointerDown);
      dialog.addEventListener("pointerup", handlePointerUp);
      removeLightDismiss = () => {
        dialog.removeEventListener("pointerdown", handlePointerDown);
        dialog.removeEventListener("pointerup", handlePointerUp);
      };
    }

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
      removeLightDismiss?.();
    };
  }, [dialogRef, onClose, requestClose]);

  return { requestClose };
}
