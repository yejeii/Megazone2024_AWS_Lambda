const apiUrl = process.API_URL;

class APIHandler {

  async getCards() {
    // Fetch cards from the server
    const response = await fetch(apiUrl+'/api/cards');
    return response.json();
  }

  async postCard(cardObj) {
    console.log(cardObj);
    // Post new card to the server
    const response = await fetch(apiUrl+'/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardObj),
    });
    const result = await response.json();
    return result.id; // Assuming the server returns the new card's ID
  }

  async putCard(cardObj) {
    // Update existing card
    await fetch(apiUrl+`/api/cards/${cardObj.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardObj),
    });
  }

  async deleteCard(id) {
    // Delete card by ID
    await fetch(apiUrl+`/api/cards/${id}`, {
      method: 'DELETE',
    });
  }
}

export default APIHandler;