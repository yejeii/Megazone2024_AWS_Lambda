import React, { useEffect, useRef, useState } from 'react';

const Card = ({ card, onDelete, onChange, onDragStart, onDragEnd }) => {
    const [title, setTitle] = useState(card.title); // Local state for the title
    const textareaRef = useRef(null); // Reference to the textarea

    // Update the title when the card prop changes
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
            id={`card-id-${card.id}`} // ID for dragging
        >
            <div className="card-delete" onClick={() => onDelete(card.id)}>x</div>
            <textarea
                ref={textareaRef}
                rows={3}
                cols={1}
                name="title"
                value={title} // Bind the title directly to the local state
                className="card-title"
                onChange={handleChange} // Call handleChange to update title on change
                onBlur={handleBlur} // Call handleBlur when textarea loses focus
            />
        </div>
    );
};

export default Card;
