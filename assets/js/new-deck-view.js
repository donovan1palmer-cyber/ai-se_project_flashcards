import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

const form = document.querySelector("#new-deck-form");
const submitBtn = form.querySelector(".new-deck-view__submit-button");
const textarea = form.querySelector("textarea");

const errorModalEl = document.querySelector("#error-modal");
const errorMessageEl = errorModalEl.querySelector(".modal__error");
const closeModalBtnEl = errorModalEl.querySelector(".modal__close");

/**
 * Makes a modal visible.
 *
 * @param {HTMLElement} modal
 * @returns {void}
 */
function openModal(modal) {
  modal.classList.add("modal_visible");
}

/**
 * Hides a modal.
 *
 * @param {HTMLElement} modal
 * @returns {void}
 */
function closeModal(modal) {
  modal.classList.remove("modal_visible");
}

/**
 * Displays an error message in the error modal.
 *
 * @param {string} message
 * @returns {void}
 */
function showError(message) {
  errorMessageEl.textContent = message;
  openModal(errorModalEl);
}

/**
 * Checks that a deck name is a string between 2 and 80 characters long.
 *
 * @param {unknown} name
 * @returns {string|null} The valid name, or null if it is invalid.
 */
function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

/**
 * Parses JSON text, returning null when the text is invalid.
 *
 * @param {string} jsonString
 * @returns {unknown|null}
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

closeModalBtnEl.addEventListener("click", function () {
  closeModal(errorModalEl);
});

/**
 * Enables the submit button when the JSON field is not empty.
 *
 * @returns {void}
 */
function updateSubmitBtn() {
  submitBtn.disabled = textarea.value.trim().length === 0;
}

textarea.addEventListener("input", updateSubmitBtn);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);
  const jsonData = parseJSON(textarea.value);

  if (jsonData === null) {
    showError("Invalid JSON");
    return;
  }

  if (validateName(jsonData.name) === null) {
    showError("Invalid name");
    return;
  }

  if (Array.isArray(jsonData.cards) === false) {
    showError("Invalid Array");
    return;
  }

  if (typeof jsonData.color != "string") {
    showError("Invalid String");
    return;
  }

  if (jsonData.color.toLowerCase() != values.color.toLowerCase()) {
    showError("Invalid COlor");
    return;
  }

  const deck = {
    color: normalizeColor(values.color),
    name: jsonData.name,
    cards: jsonData.cards,
  };

  addDeck(deck)
    .then((newDeck) => {
      fetchedDecks.push({
        ...newDeck,
        cards: newDeck.cards?.length > 0 ? newDeck.cards : jsonData.cards,
      });
      window.location.hash = "deck/" + newDeck._id;
    })
    .catch(showError);
});

export { updateSubmitBtn, showError };
