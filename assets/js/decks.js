const fetchedDecks = [];

/**
 * Finds a fetched deck by its database ID.
 *
 * @param {string} deckId
 * @returns {{_id: string, name: string, color: string, cards: Array<{question: string, answer: string}>}|undefined}
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Removes the deck matching the given ID from fetchedDecks in place.
 *
 * @param {string} deckId
 * @returns {void}
 */
function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { fetchedDecks, getDeckByID, removeDeckByID };
