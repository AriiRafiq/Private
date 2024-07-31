let medications = [];
let selectedMedication = null;

window.onload = function() {
    medications = [...MEDICATION_DATA];
    document.getElementById('details').style.display = 'none';
};

function suggestMedication() {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';
    const filteredMeds = medications.filter(med => 
        med.Drug.toLowerCase().includes(query) || med.Barcode.includes(query)
    );
    filteredMeds.forEach(med => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.innerText = `${med.Drug} (${med.Barcode})`;
        suggestion.onclick = function() {
            selectMedication(med);
        };
        suggestionsBox.appendChild(suggestion);
    });
}

function selectMedication(med) {
    selectedMedication = med;
    document.getElementById('unitBox').value = med.Unit;
    updatePrice();
    document.getElementById('details').style.display = 'block';
	document.getElementById('suggestions').innerHTML = '';
	document.getElementById('searchBox').value = `${med.Drug} (${med.Barcode})`;
}

function updatePrice() {
    if (!selectedMedication) return;
    const unit = parseInt(document.getElementById('unitBox').value);
    const price = (selectedMedication.OutPrice / selectedMedication.Unit) * unit;
    document.getElementById('priceLabel').innerText = `Price: ${price.toFixed(2)} IQD`;
}
