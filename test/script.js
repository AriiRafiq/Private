let medications = [];
let selectedMedication = null;

window.onload = function() {
    medications = [...MEDICATION_DATA];
    document.getElementById('details').style.display = 'none';
    document.getElementById('searchBox').value = '';
    document.getElementById('unitBox').value = '';
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

// Add event listener for unitBox input
unitBox.addEventListener('input', () => {

    if (unitBox.value) {
        updatePrice();
    }
});

title.addEventListener('click', () => {
	resetFields();
});

function resetFields() {
	searchBox.value = '';
	unitBox.value = '';
        priceLabel.textContent = '';
    }
	
	
	
document.getElementById('barcodeIcon').addEventListener('click', function() {
    document.getElementById('barcodeScanner').click();
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Use a barcode scanning library to read the barcode from the image
    // For example, using QuaggaJS or a similar library

    // Example using QuaggaJS
    Quagga.decodeSingle({
        src: URL.createObjectURL(file),
        numOfWorkers: 0,  // Needs to be 0 for the browser environment
        inputStream: {
            size: 800  // restrict input size to speed up scanning
        },
        decoder: {
            readers: ['code_128_reader'] // add other readers if needed
        }
    }, function(result) {
        if (result && result.codeResult) {
            document.getElementById('searchBox').value = result.codeResult.code;
        } else {
            alert('Barcode could not be detected. Please try again.');
        }
    });
}
