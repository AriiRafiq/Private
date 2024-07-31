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
    const cameraFeed = document.getElementById('cameraFeed');
    const cameraContainer = document.getElementById('cameraContainer');

    if (cameraContainer.style.display === 'none') {
        // Show the camera feed and start scanning
        cameraContainer.style.display = 'block';

        // Initialize QuaggaJS
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                constraints: {
                    facingMode: "environment" // Use the rear camera
                },
                target: cameraFeed
            },
            decoder: {
                readers: ["code_128_reader"] // Add other readers if needed
            }
        }, function(err) {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
        });

        // Event handler for barcode detection
        Quagga.onDetected(function(data) {
            document.getElementById('searchBox').value = data.codeResult.code;
            suggestMedication();
        });
    } else {
        // Stop scanning and hide the camera feed
        Quagga.stop();
        cameraContainer.style.display = 'none';
    }
});