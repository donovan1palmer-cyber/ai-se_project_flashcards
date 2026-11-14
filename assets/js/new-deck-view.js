import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function openModal(modal) {
  modal.classList.add("modal_visible");
}

function closeModal(modal) {
  modal.classList.remove("modal_visible");
}

function showError(message) {
  errorMessageEl.textContent = message;
  openModal(errorModalEl);
}

function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

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

function disableSubmitBtn() {
  submitBtn.disabled = false;
}

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

  if (jsonData.color.toLowerCase() != values.color) {
    showError("Invalid COlor");
    return;
  }

  const id = `${slugify(jsonData.name)}-${Date.now()}`;
  const deck = {
    id,
    color: normalizeColor(values.color),
    name: jsonData.name,
    cards: jsonData.cards,
  };

  decks.push(deck);
  window.location.hash = "deck/" + id;
});

export { disableSubmitBtn };
