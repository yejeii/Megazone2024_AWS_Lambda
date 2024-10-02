const apiUrl = 'https://6kjaur2wze.execute-api.us-east-1.amazonaws.com';

class APIHandler {

  async getCards() {
    // Fetch cards from the server
    const response = await fetch(apiUrl+'/api/cards');
    let datas = await response.json();
    if (datas.length === 0) {
      return null;
    } else {
      return datas;
    }
  }

  async postCard(cardObj) {
    console.log(cardObj);
    // Post new card to the server
    const response = await fetch(apiUrl+'/api/cards', {
      method: 'POST',
      body: JSON.stringify({
        id: cardObj.id,
        title: cardObj.title,
        category: cardObj.category
      }),
    });
    const result = await response.json();
    return result.id; // Assuming the server returns the new card's ID
  }

  async putCard(cardObj) {
    // Update existing card
    await fetch(apiUrl+`/api/cards/${cardObj.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: cardObj.id,
        title: cardObj.title,
        category: cardObj.category
      }),
    });
  }

  async deleteCard(id) {
    // Delete card by ID
    await fetch(apiUrl+`/api/cards/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id
      })
    });
  }
}

export default APIHandler;