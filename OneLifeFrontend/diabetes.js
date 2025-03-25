document.getElementById('diabetes-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const data = {
        input_data: [
            parseFloat(document.getElementById('pregnant').value),
            parseFloat(document.getElementById('glucose').value),
            parseFloat(document.getElementById('bp').value),
            parseFloat(document.getElementById('triceps').value),
            parseFloat(document.getElementById('insulin').value),
            parseFloat(document.getElementById('bmi').value),
            parseFloat(document.getElementById('age').value)
        ]
    };

    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = `Prediction: ${JSON.stringify(data.prediction)}`;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    });
});
