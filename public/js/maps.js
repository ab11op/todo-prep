
class UPSCMaps {
    constructor() {
        this.mapModal = new bootstrap.Modal(document.getElementById('map-modal'));
        this.mapContainer = document.getElementById('map-container');
        this.mapButtons = document.querySelectorAll('.map-categories button');

        this.maps = {
            rivers: {
                title: 'Rivers of India',
                imageUrl: 'https://i.ibb.co/N9vK3Gz/rivers-india.jpg',
                description: 'Major Rivers of India'
            },
            mountains: {
                title: 'Mountain Ranges',
                imageUrl: 'https://i.ibb.co/wQp0L3y/mountains-india.jpg',
                description: 'Mountain Ranges of India'
            },
            states: {
                title: 'States & Union Territories',
                imageUrl: 'https://i.ibb.co/wMB6tY4/states-india.jpg',
                description: 'States and Union Territories of India'
            },
            agriculture: {
                title: 'Agricultural Regions',
                imageUrl: 'https://i.ibb.co/YX89pGF/agriculture-india.jpg',
                description: 'Agricultural Regions of India'
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
                    Image not available for ${mapData.title}
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
