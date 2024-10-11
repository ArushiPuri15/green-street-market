import React, { useEffect, useState } from 'react';

const EcoScore = () => {
    const [ecoScores, setEcoScores] = useState([]);

    useEffect(() => {
        // Fetch eco scores from the backend
        const fetchEcoScores = async () => {
            const response = await fetch('http://127.0.0.1:5000/api/eco-scores'); // Update with your API endpoint
            const data = await response.json();
            setEcoScores(data.scores);
        };

        fetchEcoScores();
    }, []);

    return (
        <div>
            <h2>Eco Score Management</h2>
            <ul>
                {ecoScores.map((score) => (
                    <li key={score.productId}>
                        {score.productName}: {score.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EcoScore;
