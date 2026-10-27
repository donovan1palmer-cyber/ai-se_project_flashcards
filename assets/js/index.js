import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const deckList = document.querySelector(".gallery__list");
const deckTemplate = document.querySelector("#deck-template");
const homeView = document.querySelector("#home");
const deckView = document.querySelector("#deck-view");
const practiceButton = deckView.querySelector(".gallery__practice-btn");
const aboutView = document.querySelector("#about");
const notFoundView = document.querySelector("#not-found");
const mainContent = document.querySelector(".page__main-content");
const page = document.querySelector(".page");
const carousel = document.querySelector(".carousel");
let currentDeck = null;

const routes = {
  home: homeView,
  "deck-view": deckView,
  about: aboutView,
  "not-found": notFoundView,
};

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

  cardElement.dataset.deckId = item.id;
  title.textContent = item.name;
  count.textContent = `${item.cards.length} cards`;
  deckLink.href = `#deck/${item.id}`;
  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return deckEl;
}

function renderDeckEl(item) {
  const deckElement = createDeckEl(item);
  deckList.prepend(deckElement);
}

decks.forEach(renderDeckEl);

function updateDeckCount(deck) {
  const deckCard = [...deckList.querySelectorAll(".card")].find(
    (element) => element.dataset.deckId === deck.id,
  );

  if (deckCard) {
    deckCard.querySelector(".card__count").textContent =
      `${deck.cards.length} cards`;
  }
}

practiceButton.addEventListener("click", (event) => {
  event.preventDefault();

  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck.id}`;
  }
});

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

  if (hash.startsWith("deck/")) {
    const deckId = hash.slice("deck/".length);
    const deck = getDeckByID(deckId);

    if (deck) {
      currentDeck = deck;
      practiceButton.href = `#carousel/${currentDeck.id}`;
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

  const view = routes[hash] || routes["not-found"];

  if (view) {
    view.hidden = false;
  }
}

window.addEventListener("hashchange", router);
router();
