const fetchedDecks = [];

/**
 *
 * @param {string} deckId
 * @returns {object|undefined}
 */
function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId);
}

/**
 * Removes the deck matching the given ID from fetchedDecks in place.
 *
 * @param {string} deckId
 */
function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { fetchedDecks, getDeckByID, removeDeckByID };
