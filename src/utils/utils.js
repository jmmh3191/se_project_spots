import { showInputError } from "../scripts/validation.js";

export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

export function handleSubmit(
  request,
  evt,
  loadingText = "Saving...",
  errorInput = null,
  config = null
) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(err);
      if (errorInput && config && typeof showInputError === "function") {
        showInputError(
          evt.target,
          errorInput,
          "Server error: Please check your link.",
          config
        );
      }
    })
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
