import { hexToString, removeColorClasses } from "./colors.js";

const deckView = document.querySelector("#deck-view");
const deckViewTitle = deckView.querySelector(".gallery__title");
const deckViewList = deckView.querySelector(".gallery__list");
const cardTemplate = document.querySelector("#card-template");
const page = document.querySelector(".page");

function renderDeckView(deck, updateDeckCount) {
  page.classList.remove("page_no-mobile-bar");
  const colorName = hexToString(deck.color);
  const newCardButton = deckViewList.querySelector(
    ".gallery__new-card-btn",
  ).parentElement;

  deckViewTitle.textContent = deck.name;
  deckViewList.querySelectorAll(".card").forEach((cardElement) => {
    cardElement.remove();
  });

  deck.cards.forEach((card) => {
    const cardEl = cardTemplate.content.cloneNode(true);
    const cardElement = cardEl.querySelector(".card");
    const cardTitle = cardEl.querySelector(".card__title");
    const flipButton = cardEl.querySelector(".card__btn_type_flip");
    const deleteButton = cardEl.querySelector(".card__btn_type_delete");
    let showingQuestion = true;

    if (colorName) {
      removeColorClasses(cardElement);
      cardElement.classList.add(`card_color_${colorName}`);
    }

    cardTitle.textContent = card.question;

    flipButton.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      cardTitle.textContent = showingQuestion ? card.question : card.answer;
      cardElement.classList.toggle("card_color_white", !showingQuestion);
      flipButton.setAttribute(
        "aria-label",
        showingQuestion ? "Show answer" : "Show question",
      );
    });

    deleteButton.addEventListener("click", () => {
      const cardIndex = deck.cards.indexOf(card);

      if (cardIndex !== -1) {
        deck.cards.splice(cardIndex, 1);
        cardElement.remove();
        updateDeckCount(deck);
      }
    });

    deckViewList.insertBefore(cardEl, newCardButton);
  });
}

export { renderDeckView };
