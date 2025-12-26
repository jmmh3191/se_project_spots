import "./index.css";

import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2c30c1a4-ec09-478f-8ddc-c9c3829032c5",
    "Content-Type": "application/json",
  },
});

let currentUser;

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    currentUser = userInfo;
    cards.forEach(function (item) {
      renderCard(item, "append");
    });
    const avatarElement = document.querySelector(".profile__avatar");
    if (!userInfo.avatar.toLowerCase().includes("placeholder")) {
      avatarElement.src = userInfo.avatar;
    }
    document.querySelector(".profile__name").textContent = userInfo.name;
    document.querySelector(".profile__description").textContent =
      userInfo.about;
  })
  .catch(console.error);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const addCardFormElement = document.querySelector("#new-post-modal form");
const captionInput = document.querySelector("#caption-image-input");
const linkInput = document.querySelector("#card-image-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const deleteModal = document.querySelector("#delete-modal");

const previewModal = document.querySelector("#preview-modal");
const previewModalClosedBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewTitleEl = previewModal.querySelector(".modal__caption");

let selectedCard, selectedCardId;

const avatarBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarUrlInput = avatarModal.querySelector("#avatar-url-input");
const profileAvatar = document.querySelector(".profile__avatar");

function renderLoading(
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

previewModalClosedBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function handleLike(evt, _id) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .handleLikeStatus(_id, isLiked)
    .then((data) => {
      console.log(data);
      const isNowLiked = data.isLiked;
      if (isNowLiked) {
        evt.target.classList.add("card__like-btn_active");
      } else {
        evt.target.classList.remove("card__like-btn_active");
      }
    })
    .catch((error) => {
      evt.target.classList.toggle("card__like-btn_active");
      console.error("Failed to update like status:", error);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  function handleDeleteCard(cardElement, cardId) {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  }

  const likeButton = cardElement.querySelector(".card__like-btn");
  const deleteButton = cardElement.querySelector(".card__delete-btn");

  if (data.isLiked) {
    likeButton.classList.add("card__like-btn_active");
  } else {
    likeButton.classList.remove("card__like-btn_active");
  }

  likeButton.addEventListener("click", (evt) => handleLike(evt, data._id));
  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewTitleEl.textContent = data.name;
    previewImageEl.alt = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleModalClick(event) {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

const pageElement = document.querySelector(".page");

function openModal(modal) {
  if (!modal) return;

  modal.classList.add("modal_is-opened");

  pageElement?.classList.add("page_modal-opened");

  modal.addEventListener("click", handleModalClick);
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove("modal_is-opened");
  pageElement?.classList.remove("page_modal-opened");

  modal.removeEventListener("click", handleModalClick);
  document.removeEventListener("keydown", handleEscapeKey);
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig
  );
  openModal(editProfileModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

avatarBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(".modal__submit-btn");

  renderLoading(true, submitButton);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(".modal__submit-btn");

  renderLoading(true, submitButton);

  api
    .updateAvatar({ avatar: avatarUrlInput.value })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, "Save");
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);

  cardsList[method](cardElement);
}

addCardFormElement.addEventListener("reset", () => {
  disableButton(cardSubmitBtn, validationConfig);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(".modal__submit-btn");

  renderLoading(true, submitButton);

  const name = captionInput.value;
  const link = linkInput.value;

  api
    .addNewCard({ name, link })
    .then((data) => {
      renderCard(data);
      closeModal(newPostModal);
      evt.target.reset(); // Reset form on success
    })
    .catch((error) => {
      console.error("Error adding new card:", error);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Save");
    });
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

const deleteForm = deleteModal.querySelector(".modal__form");

deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = event.target.querySelector(".modal__submit-btn");

  renderLoading(true, submitButton, "Delete", "Deleting");

  api
    .deleteNewCard({ _id: selectedCardId })
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error("Failed to delete card:", err);
      alert("Could not delete card. Please try again.");
    })
    .finally(() => {
      renderLoading(false, submitButton, "Delete");
    });
});

const cancelDeleteBtn = document.querySelector("#cancel-confirm");

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

enableValidation(validationConfig);
