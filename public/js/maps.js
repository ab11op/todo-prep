
class UPSCMaps {
    constructor() {
        this.mapModal = new bootstrap.Modal(document.getElementById('map-modal'));
        this.mapContainer = document.getElementById('map-container');
        this.mapButtons = document.querySelectorAll('.map-categories button');

        this.maps = {
            airandwater: {
                title: 'Air and Water',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Air_and_Water.jpg',
                description: 'Air and Water Resources of India'
            },
            airports: {
                title: 'Airports',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Airports.jpg',
                description: 'Major Airports of India'
            },
            crops: {
                title: 'Crops',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Crops.jpg',
                description: 'Major Crops of India'
            },
            heritage: {
                title: 'Heritage Sites',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Heritage_Sites.jpg',
                description: 'Heritage Sites of India'
            },
            hillstations: {
                title: 'Hill Stations',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Hill_Stations.jpg',
                description: 'Hill Stations of India'
            },
            flag: {
                title: 'Indian Flag',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Indian_Flag.jpg',
                description: 'National Flag of India'
            },
            peaks: {
                title: 'Main Peaks',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Main_Peaks.jpg',
                description: 'Major Mountain Peaks of India'
            },
            monsoon: {
                title: 'Monsoon',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Monsoon.jpg',
                description: 'Monsoon Patterns in India'
            },
            passes: {
                title: 'Mountain Passes',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Mountain_Passes.jpg',
                description: 'Important Mountain Passes of India'
            },
            ranges: {
                title: 'Mountain Ranges',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Mountain_Ranges.jpg',
                description: 'Mountain Ranges of India'
            },
            hazards: {
                title: 'Natural Hazards',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Natural_Hazards.jpg',
                description: 'Natural Hazards in India'
            },
            vegetation: {
                title: 'Natural Vegetation',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Natural_Vegetation.jpg',
                description: 'Natural Vegetation of India'
            },
            resources: {
                title: 'Natural Resources',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Natural_Resources.jpg',
                description: 'Natural Resources of India'
            },
            political: {
                title: 'Political Map',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Political.jpg',
                description: 'Political Map of India'
            },
            population: {
                title: 'Population',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Population.jpg',
                description: 'Population Distribution in India'
            },
            ports: {
                title: 'Ports',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Ports.jpg',
                description: 'Major Ports of India'
            },
            railway: {
                title: 'Railway Network',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Railway.jpg',
                description: 'Railway Network of India'
            },
            roadway: {
                title: 'Roadway Network',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Roadway.jpg',
                description: 'Roadway Network of India'
            },
            soil: {
                title: 'Soil Types',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Soil.jpg',
                description: 'Soil Types of India'
            },
            temperature: {
                title: 'Temperature',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Temperature.jpg',
                description: 'Temperature Distribution in India'
            },
            topography: {
                title: 'Topography',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Topography.jpg',
                description: 'Topographical Features of India'
            },
            wind: {
                title: 'Wind Pattern',
                imageUrl: 'https://raw.githubusercontent.com/Naren-7701/INDIA-MAP/main/Wind_Pattern.jpg',
                description: 'Wind Patterns across India'
            }
        };

        this.bindEvents();
        this.showMap('rivers'); // Show default map
    }

    bindEvents() {
        this.mapButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mapType = button.dataset.mapType;
                this.showMap(mapType);
                this.mapButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        document.getElementById('show-maps').addEventListener('click', () => {
            this.mapModal.show();
            this.showMap('rivers');
        });
    }

    showMap(type) {
        const mapData = this.maps[type];
        if (!mapData) return;

        // Show loading state
        this.mapContainer.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;

        const img = new Image();
        img.onload = () => {
            this.mapContainer.innerHTML = `
                <div class="map-content">
                    <h4>${mapData.title}</h4>
                    <div class="map-image">
                        <img src="${mapData.imageUrl}" 
                             alt="${mapData.description}" 
                             class="img-fluid">
                    </div>
                    <p class="text-muted mt-2">${mapData.description}</p>
                </div>
            `;
        };
        img.onerror = () => {
            this.mapContainer.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Unable to load image for ${mapData.title}. Please try again later.
                </div>
            `;
        };
        img.src = mapData.imageUrl;
    }
}

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UPSCMaps();
});
