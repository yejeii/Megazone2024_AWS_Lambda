import React, { useEffect, useRef, useState } from 'react';

const Card = ({ card, onDelete, onChange, onDragStart, onDragEnd }) => {
    const [title, setTitle] = useState(card.title);
    const textareaRef = useRef(null);

    useEffect(() => {
        setTitle(card.title);
    }, [card.title]);

    const handleChange = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle); // Update local state
    };

    const handleBlur = () => {
        onChange(card, title); // Call onChange when textarea loses focus
    };

    return (
        <div
            className="card"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            id={`card-id-${card.id}`}
        >
            <div className="card-delete" onClick={() => onDelete(card.id)}>x</div>
            <textarea
                ref={textareaRef}
                rows={3}
                cols={1}
                name="title"
                value={title}
                className="card-title"
                onChange={handleChange}
                onBlur={handleBlur} // Trigger save on blur
            />
        </div>
    );
};

export default Card;
