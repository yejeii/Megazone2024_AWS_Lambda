// App.jsx
import React, { useEffect, useState } from 'react';
import Column from './Column';
import APIHandler from './APIHandler.jsx';
import '../style.scss';
import './App.css';

const API = new APIHandler();

function App() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getCards();
        console.log(cards);
    }, []);

    const getCards = async () => {
        const cardsData = await API.getCards();
        if (cardsData && cardsData.length > 0) {
            setCards(cardsData);
        }
    };

    const createCard = (category, title) => {
        const newCard = { title, id: Date.now(), category }; // 사용자 입력값 사용
        setCards(prevCards => [...prevCards, newCard]);
        registerCard(newCard);
    };

    const registerCard = async (cardObj) => {
        const cardId = await API.postCard(cardObj);
        setCards(prevCards =>
            prevCards.map(card => card.id === cardObj.id ? { ...card, id: cardId } : card)
        );
    };

    const deleteCard = async (id) => {
        await API.deleteCard(id);
        setCards(prevCards => prevCards.filter(card => card.id !== id));
    };

    const updateCard = async (cardObj) => {
        await API.putCard(cardObj);
    };

    const onChangeCard = async (card, newTitle) => {
        const updatedCard = { ...card, title: newTitle };
        if (newTitle.length > 0) {
            await updateCard(updatedCard); // Ensure this function calls the APIHandler to update the card
            setCards(prevCards => prevCards.map(c => c.id === card.id ? updatedCard : c)); // Update the local state
        } else {
            await deleteCard(card.id); // Delete card if the title is empty
        }
    };

    // Drag and Drop Events
    const onDragStart = (event) => {
        const currentColumnType = event.target.parentNode.parentNode.getAttribute("data-card-category");
        const cardId = event.target.id;

        // Add hoverable effect for other columns
        const cardContainers = document.querySelectorAll('.card-container');
        cardContainers.forEach(element => {
            if (element.parentNode.getAttribute('data-card-category') !== currentColumnType) {
                element.classList.add('hoverable');
            }
        });

        event.dataTransfer.setData("columnType", currentColumnType);
        event.dataTransfer.setData("cardID", cardId);
    };

    const cardOnDrop = (event) => {
        event.preventDefault();
        event.target.classList.remove('hover');

        const from = event.dataTransfer.getData("columnType");
        const to = event.target.parentNode.getAttribute("data-card-category");
        const id = event.dataTransfer.getData("cardID");
        const card = document.getElementById(id);

        if (from && to && card && from !== to) {
            event.target.appendChild(card);
            updateCard(getCardInfo(card)); // Ensure this function exists and is implemented
        }
    };

    const onDragEnd = () => {
        const cardContainers = document.querySelectorAll('.card-container');
        cardContainers.forEach(element => {
            element.classList.remove('hoverable');
        });
    };

    const getCardInfo = (cardElement) => {
        return {
            id: cardElement.id.replace('card-id-', ''),
            title: cardElement.querySelector('.card-title').value,
            category: cardElement.parentNode.getAttribute('data-card-category')
        };
    };

    return (
        <>
            <nav>
                <div></div>
                <div>AWS 칸반 보드</div>
                <div></div>
            </nav>
            <div className="column-container">
                {['todo', 'ongoing', 'test', 'done'].map(category => (
                    <Column
                        key={category}
                        category={category}
                        cards={cards.filter(card => card.category === category)}
                        onCreateCard={createCard}
                        onDeleteCard={deleteCard}
                        onChangeCard={onChangeCard}
                        onDragStart={onDragStart} // Pass drag event handler
                        onDrop={cardOnDrop} // Pass drop handler
                    />
                ))}
            </div>
        </>
    );
}

export default App;