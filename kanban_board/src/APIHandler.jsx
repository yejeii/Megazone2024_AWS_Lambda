import config from './config.js';
import axios from 'axios';

class APIHandler {

  // 카드 가져오기
  async getCards() {
    try {
      const response = await axios.get('/api/cards');
      const datas = response.data;
      if (datas.length === 0) {
        return null;
      } else {
        return datas;
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error; // 오류를 던져서 호출한 쪽에서 처리할 수 있도록 합니다.
    }
  }

  // 새로운 카드 추가
  async postCard(cardObj) {
    console.log(cardObj);
    try {
      const response = await axios.post('/api/cards', {
        id: cardObj.id,
        title: cardObj.title,
        category: cardObj.category,
      });
      return response.data.id; // 서버에서 새로운 카드의 ID를 반환한다고 가정합니다.
    } catch (error) {
      console.error('Error posting card:', error);
      throw error;
    }
  }

  // 기존 카드 업데이트
  async putCard(cardObj) {
    try {
      await axios.put(`/api/cards/${cardObj.id}`, {
        id: cardObj.id,
        title: cardObj.title,
        category: cardObj.category,
      });
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  // 카드 삭제
  async deleteCard(id) {
    try {
      await axios.delete(`/api/cards/${id}`, {
        data: {
          id: id,
        },
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }
}

export default APIHandler;