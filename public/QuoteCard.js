import React, { useState, useEffect } from "react";

function QuoteCard({ quote, onNext, onFavorite, onComment }) {
    const [comment, setComment] = useState("");

    useEffect(() => {
        const comments = JSON.parse(localStorage.getItem("comments")) || {};
        setComment(comments[quote.id] || "");
    }, [quote]);

    const handleSaveComment = () => {
        onComment(quote, comment);
        alert("Comment saved!");
    };

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-xl text-center">
            <p className="text-xl italic mb-4">“{quote.text}”</p>
            <p className="text-gray-600">— {quote.author} ({quote.book})</p>

            <textarea
                className="border mt-4 p-2 w-full rounded-md"
                placeholder="Add your reflection..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={handleSaveComment}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                >
                    Save Comment
                </button>
                <button
                    onClick={() => onFavorite(quote)}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-xl hover:bg-yellow-500"
                >
                    Favorite
                </button>
                <button
                    onClick={onNext}
                    className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400"
                >
                    Next Quote
                </button>
            </div>
        </div>
    );
}

export default QuoteCard;
