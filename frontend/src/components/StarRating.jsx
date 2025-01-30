import React from 'react';
import sanitizeHtml from 'sanitize-html'; // Import sanitize-html for XSS protection
import './StarRating.css'; // Import custom CSS for styling

const StarRating = ({ rating, onRatingChange }) => {
    const cleanInput = (input) => sanitizeHtml(input, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {}
    });

    const handleClick = (index) => {
        const sanitizedRating = cleanInput(index + 1);
        onRatingChange(sanitizedRating);
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                return (
                    <span
                        key={index}
                        className={index < rating ? "star filled" : "star"}
                        onClick={() => handleClick(index)}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;
