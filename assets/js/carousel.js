import { hexToString, removeColorClasses } from "./colors.js";

function renderCarouselView(deck) {
  const title = document.querySelector(".carousel__title");
  const card = document.querySelector(".carousel__card");
  const cardText = document.querySelector(".carousel__card-text");
  const leftButton = document.querySelector(".carousel__btn_type_left");
  const rightButton = document.querySelector(".carousel__btn_type_right");
  const flipButton = document.querySelector(".carousel__btn_type_flip");
  const colorName = hexToString(deck.color);

  let currentIndex = 0;
  let showingQuestion = true;

  function updateButtonState() {
    const hasCards = deck.cards.length > 0;
    const isFirstCard = !hasCards || currentIndex === 0;
    const isLastCard = !hasCards || currentIndex === deck.cards.length - 1;

    leftButton.disabled = isFirstCard;
    rightButton.disabled = isLastCard;
    flipButton.disabled = !hasCards;

    leftButton.classList.toggle("carousel__btn_disabled", isFirstCard);
    rightButton.classList.toggle("carousel__btn_disabled", isLastCard);
    flipButton.classList.toggle("carousel__btn_disabled", !hasCards);
  }

  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    removeColorClasses(card);

    if (!currentCard) {
      cardText.textContent = "No cards in this deck.";
      card.classList.add("carousel__card_color_white");
      title.textContent = `${deck.name} Deck • 0/0`;
      updateButtonState();
      return;
    }

    if (showingQuestion) {
      cardText.textContent = currentCard.question;
      card.classList.add(`carousel__card_color_${colorName}`);
    } else {
      cardText.textContent = currentCard.answer;
      card.classList.add("carousel__card_color_white");
    }

    title.textContent = `${deck.name} Deck • ${currentIndex + 1}/${deck.cards.length}`;
    updateButtonState();
  }

  leftButton.onclick = () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      showingQuestion = true;
      updateDisplay();
    }
  };

  rightButton.onclick = () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex += 1;
      showingQuestion = true;
      updateDisplay();
    }
  };

  flipButton.onclick = () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  };

  updateDisplay();
}

export { renderCarouselView };
