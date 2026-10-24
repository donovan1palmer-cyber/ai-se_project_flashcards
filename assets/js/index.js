import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

const deckList = document.querySelector(".decks__list");
const deckTemplate = document.querySelector("#deck-template");
const homeView = document.querySelector("#home");
const aboutView = document.querySelector("#about");
const notFoundView = document.querySelector("#not-found");
const mainContent = document.querySelector(".page__main-content");
const carousel = document.querySelector(".carousel");

const routes = {
  home: homeView,
  about: aboutView,
  "not-found": notFoundView,
};

function createDeckEl(item) {
  const deckEl = deckTemplate.content.cloneNode(true);

  const title = deckEl.querySelector(".deck__title");
  const count = deckEl.querySelector(".deck__count");
  const deleteButton = deckEl.querySelector(".deck__delete-btn");
  const deckCard = deckEl.querySelector(".deck");
  const deckLink = deckEl.querySelector(".deck__link");
  const colorName = hexToString(item.color);

  if (colorName) {
    removeColorClasses(deckCard);
    deckCard.classList.add(`deck_color_${colorName}`);
  }

  title.textContent = item.name;
  count.textContent = `${item.cards.length} cards`;
  deckLink.href = `#deck/${item.id}`;
  deleteButton.addEventListener("click", () => {
    deckCard.remove();
  });

  return deckEl;
}

function renderDeckEl(item) {
  const deckElement = createDeckEl(item);
  deckList.prepend(deckElement);
}

decks.forEach(renderDeckEl);

function renderView() {
  const hash = window.location.hash.slice(1) || "home";

  Object.values(routes).forEach((section) => {
    if (section) {
      section.hidden = true;
    }
  });

  carousel.hidden = true;

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

  mainContent.classList.remove("page__main-content_location_carousel");

  const view = routes[hash] || routes["not-found"];

  if (view) {
    view.hidden = false;
  }
}

window.addEventListener("hashchange", renderView);
renderView();
