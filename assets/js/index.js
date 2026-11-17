import { fetchedDecks, getDeckByID, removeDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { updateSubmitBtn, showError } from "./new-deck-view.js";
import { deleteDeck, getDecks } from "./api.js";

const deckList = document.querySelector(".gallery__list");
const deckTemplate = document.querySelector("#deck-template");
const homeView = document.querySelector("#home");
const newDeckButton = document.querySelector("#home .gallery__new-card-btn");
const deckView = document.querySelector("#deck-view");
const practiceButton = deckView.querySelector(".gallery__practice-btn");
const aboutView = document.querySelector("#about");
const notFoundView = document.querySelector("#not-found");
const mainContent = document.querySelector(".page__main-content");
const page = document.querySelector(".page");
const carousel = document.querySelector(".carousel");
let currentDeck = null;
const newDeckView = document.querySelector("#new-deck-view");

const routes = {
  home: homeView,
  "deck-view": deckView,
  "new-deck": newDeckView,
  about: aboutView,
  "not-found": notFoundView,
};

/**
 * Clones the deck template and fills it with a deck's data and delete handler.
 *
 * @param {{_id: string, name: string, color: string, cards: Array<unknown>}} item
 * @returns {DocumentFragment}
 */
function createDeckEl(item) {
  const deckEl = deckTemplate.content.cloneNode(true);

  const title = deckEl.querySelector(".card__title");
  const count = deckEl.querySelector(".card__count");
  const deleteButton = deckEl.querySelector(".card__btn_type_delete");
  const cardElement = deckEl.querySelector(".card");
  const deckLink = deckEl.querySelector(".card__link");
  const colorName = hexToString(item.color);

  if (colorName) {
    removeColorClasses(cardElement);
    cardElement.classList.add(`card_color_${colorName}`);
  }

  cardElement.dataset.deckId = item._id;
  title.textContent = item.name;
  count.textContent = `${item.cards.length} cards`;
  deckLink.href = `#deck/${item._id}`;
  deleteButton.addEventListener("click", () => {
    deleteDeck(item._id)
      .then(() => {
        cardElement.remove();
        removeDeckByID(item._id);
      })
      .catch(showError);
  });

  return deckEl;
}

/**
 * Renders a deck card at the start of the deck list.
 *
 * @param {{_id: string, name: string, color: string, cards: Array<unknown>}} item
 * @returns {void}
 */
function renderDeckEl(item) {
  const deckElement = createDeckEl(item);
  deckList.prepend(deckElement);
}

newDeckButton.addEventListener("click", () => {
  window.location.hash = "#new-deck";
});

/**
 * Updates the rendered deck card's flashcard count.
 *
 * @param {{_id: string, cards: Array<unknown>}} deck
 * @returns {void}
 */
function updateDeckCount(deck) {
  const deckCard = [...deckList.querySelectorAll(".card")].find(
    (element) => element.dataset.deckId === deck._id,
  );

  if (deckCard) {
    deckCard.querySelector(".card__count").textContent =
      `${deck.cards.length} cards`;
  }
}

practiceButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck._id}`;
  }
});

/**
 * Displays the view requested by the current URL hash.
 *
 * @returns {void}
 */
function router() {
  const hash = window.location.hash.slice(1) || "home";
  currentDeck = null;

  Object.values(routes).forEach((section) => {
    if (section) {
      section.hidden = true;
    }
  });

  carousel.hidden = true;
  mainContent.classList.remove("page__main-content_location_carousel");
  page.classList.remove("page_no-mobile-bar");
  if (hash === "home") {
    deckList.querySelectorAll(".card").forEach((deck) => deck.remove());
    fetchedDecks.forEach(renderDeckEl);
  }
  if (hash.startsWith("deck/")) {
    const deckId = hash.slice("deck/".length);
    const deck = getDeckByID(deckId);

    if (deck) {
      currentDeck = deck;
      practiceButton.href = `#carousel/${currentDeck._id}`;
      renderDeckView(deck, updateDeckCount);
      deckView.hidden = false;
    } else {
      routes["not-found"].hidden = false;
    }

    return;
  }

  if (hash.startsWith("carousel/")) {
    mainContent.classList.add("page__main-content_location_carousel");

    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);

    if (deck) {
      carousel.hidden = false;
      renderCarouselView(deck);
    } else {
      mainContent.classList.remove("page__main-content_location_carousel");
      const notFound = routes["not-found"];
      if (notFound) {
        notFound.hidden = false;
      }
    }

    return;
  }

  if (hash === "new-deck") {
    updateSubmitBtn();
  }

  const view = routes[hash] || routes["not-found"];

  if (view) {
    view.hidden = false;
  }
}

window.addEventListener("hashchange", router);

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((serverDecks) => {
      fetchedDecks.push(...serverDecks);
    })
    .catch(showError)
    .finally(() => {
      router();
    });
});
