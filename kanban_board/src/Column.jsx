// Column.jsx
import React from 'react';
import Card from './Card';

const Column = ({ category, cards, onCreateCard, onDeleteCard, onChangeCard, onDragStart, onDrop }) => {
    const handleDrop = (event) => {
        event.preventDefault();
        onDrop(event); // Call the drop handler passed from App
    };

    return (
        <div className="column" data-card-category={category}>
            <div className="column-header">{category}</div>
            <div className="card card-create" onClick={() => onCreateCard(category)}>+</div>
            <section
                className="card-container"
                onDragOver={(event) => event.preventDefault()} // Allow drop
                onDrop={handleDrop}
            >
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        onDelete={onDeleteCard}
                        onChange={onChangeCard}
                        onDragStart={onDragStart} // Pass down drag event handler
                    />
                ))}
            </section>
        </div>
    );
};

export default Column;
