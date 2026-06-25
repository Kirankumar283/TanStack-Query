import { toast } from "sonner";

// ---------------------------------------------------------
// Centralized Toast Utilities
// ---------------------------------------------------------

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
  });
};

export const showWarningToast = (message: string) => {
  toast.warning(message, {
    duration: 4000,
  });
};

/**
 * Handles API / unknown errors and displays an appropriate toast.
 */
export const showApiErrorToast = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: string }).message)
        : "An unexpected error occurred";

  showErrorToast(message);
};
