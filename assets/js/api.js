const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
  "Content-Type": "application/json",
  Authorization: "01a1db94-2915-7063-aa2a-344684671608",
};

/**
 * Parses a successful API response or rejects with its HTTP status.
 *
 * @param {Response} res
 * @returns {Promise<unknown>|null}
 */
function processResponse(res) {
  if (res.ok) {
    if (res.status === 204) {
      return null;
    }
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches all decks for the current account.
 *
 * @returns {Promise<Array<{_id: string, name: string, color: string, cards: Array<{question: string, answer: string}>}>>}
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck from the current account.
 *
 * @param {string} deckId
 * @returns {Promise<unknown|null>}
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Creates a deck for the current account.
 *
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} deck
 * @returns {Promise<{_id: string, name: string, color: string, cards: Array<{question: string, answer: string}>}|null>}
 */
function addDeck(deck) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify(deck),
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck };
