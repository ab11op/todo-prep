
class UPSCMaps {
    constructor() {
        this.mapModal = new bootstrap.Modal(document.getElementById('map-modal'));
        this.mapContainer = document.getElementById('map-container');
        this.mapButtons = document.querySelectorAll('.map-categories button');

        this.maps = {
            rivers: {
                title: 'Rivers of India',
                imageUrl: 'https://raw.githubusercontent.com/craigdsouza/water_resources_india/master/images/river-basins-and-command-areas.PNG',
                description: 'Major River Basins and Command Areas of India'
            },
            mountains: {
                title: 'Mountain Ranges',
                imageUrl: 'https://i.ibb.co/VSQ5m0h/mountains.jpg',
                description: 'Mountain Ranges of India'
            },
            states: {
                title: 'States & Union Territories',
                imageUrl: 'https://i.ibb.co/9HKpXZM/states.jpg',
                description: 'States and Union Territories of India'
            },
            agriculture: {
                title: 'Agricultural Regions',
                imageUrl: 'https://i.ibb.co/QKmg43B/agriculture.jpg',
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
