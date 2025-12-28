import "./index.css";

import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import { handleSubmit } from "../utils/utils.js";

import Api from "../utils/Api.js";

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
const deleteForm = deleteModal.querySelector(".modal__form");
const cancelDeleteBtn = document.querySelector("#cancel-confirm");

const previewModal = document.querySelector("#preview-modal");
const previewModalClosedBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewTitleEl = previewModal.querySelector(".modal__caption");

const avatarBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarUrlInput = avatarModal.querySelector("#avatar-url-input");
const profileAvatar = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");
const pageElement = document.querySelector(".page");

const closeButtons = document.querySelectorAll(".modal__close-btn");

let currentUser;
let selectedCard, selectedCardId;

function handleLike(evt, _id) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .handleLikeStatus(_id, isLiked)
    .then((data) => {
      const isNowLiked = data.isLiked;
      evt.target.classList.toggle("card__like-btn_active", isNowLiked);
    })
    .catch(console.error);
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

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2c30c1a4-ec09-478f-8ddc-c9c3829032c5",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    currentUser = userInfo;

    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;

    cards.forEach(function (item) {
      renderCard(item, "append");
    });
  })
  .catch(console.error);

previewModalClosedBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

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
  function makeRequest() {
    return api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameEl.textContent = data.name;
        profileDescriptionEl.textContent = data.about;
        closeModal(editProfileModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.updateAvatar({ avatar: avatarUrlInput.value }).then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

function handleAddCardSubmit(evt) {
  function makeRequest() {
    return api
      .addNewCard({
        name: captionInput.value,
        link: linkInput.value,
      })
      .then((data) => {
        renderCard(data);
        closeModal(newPostModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

addCardFormElement.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", (event) => {
  function makeRequest() {
    return api.deleteNewCard({ _id: selectedCardId }).then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    });
  }
  handleSubmit(makeRequest, event, "Deleting...");
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

enableValidation(validationConfig);
