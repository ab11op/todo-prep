class UPSCMaps {
    constructor() {
        this.mapModal = new bootstrap.Modal(document.getElementById('map-modal'));
        this.mapContainer = document.getElementById('map-container');
        this.mapButtons = document.querySelectorAll('.map-categories button');

        // Map data
        this.maps = {
            rivers: {
                title: 'Rivers of India',
                content: `
                    <div class="map-info">
                        <h4>Major Rivers of India</h4>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h5 class="text-primary">Himalayan Rivers</h5>
                                <ul>
                                    <li>Indus System: Indus, Jhelum, Chenab, Ravi, Beas, Sutlej</li>
                                    <li>Ganga System: Ganga, Yamuna, Son, Gomti, Ghaghra, Gandak, Kosi</li>
                                    <li>Brahmaputra System: Brahmaputra, Tista, Manas</li>
                                </ul>
                            </li>
                            <li class="list-group-item">
                                <h5 class="text-success">Peninsular Rivers</h5>
                                <ul>
                                    <li>West Flowing: Narmada, Tapi, Sabarmati, Mahi</li>
                                    <li>East Flowing: Mahanadi, Godavari, Krishna, Kaveri</li>
                                </ul>
                            </li>
                        </ul>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/River_systems_of_India.svg" 
                                 alt="Rivers of India Map" 
                                 class="img-fluid border rounded">
                        </div>
                    </div>
                `
            },
            mountains: {
                title: 'Mountain Ranges',
                content: `
                    <div class="map-info">
                        <h4>Mountain Ranges of India</h4>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h5 class="text-primary">Himalayas</h5>
                                <ul>
                                    <li>Greater Himalayas (Himadri)</li>
                                    <li>Lesser Himalayas (Himachal)</li>
                                    <li>Outer Himalayas (Siwaliks)</li>
                                </ul>
                            </li>
                            <li class="list-group-item">
                                <h5 class="text-success">Other Ranges</h5>
                                <ul>
                                    <li>Western Ghats (Sahyadri)</li>
                                    <li>Eastern Ghats</li>
                                    <li>Aravalli Range</li>
                                    <li>Vindhya Range</li>
                                    <li>Satpura Range</li>
                                </ul>
                            </li>
                        </ul>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/India_physical_map.svg" 
                                 alt="Mountain Ranges of India Map" 
                                 class="img-fluid border rounded">
                        </div>
                    </div>
                `
            },
            states: {
                title: 'States & Union Territories',
                content: `
                    <div class="map-info">
                        <h4>States and Union Territories</h4>
                        <div class="row">
                            <div class="col-md-6">
                                <h5 class="text-primary">States (28)</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">Andhra Pradesh</li>
                                    <li class="list-group-item">Arunachal Pradesh</li>
                                    <li class="list-group-item">Assam</li>
                                    <li class="list-group-item">Bihar</li>
                                    <li class="list-group-item">Chhattisgarh</li>
                                    <li class="list-group-item">Goa</li>
                                    <li class="list-group-item">Gujarat</li>
                                    <!-- Add more states as needed -->
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h5 class="text-info">Union Territories (8)</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">Andaman and Nicobar Islands</li>
                                    <li class="list-group-item">Chandigarh</li>
                                    <li class="list-group-item">Dadra and Nagar Haveli and Daman and Diu</li>
                                    <li class="list-group-item">Delhi</li>
                                    <li class="list-group-item">Jammu and Kashmir</li>
                                    <li class="list-group-item">Ladakh</li>
                                    <li class="list-group-item">Lakshadweep</li>
                                    <li class="list-group-item">Puducherry</li>
                                </ul>
                            </div>
                        </div>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/India_states_and_union_territories_map.svg" 
                                 alt="States and UTs of India Map" 
                                 class="img-fluid border rounded">
                        </div>
                    </div>
                `
            },
            agriculture: {
                title: 'Agricultural Regions',
                content: `
                    <div class="map-info">
                        <h4>Agricultural Regions of India</h4>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h5 class="text-success">Major Crop Regions</h5>
                                <ul>
                                    <li>Rice: Eastern and Southern regions</li>
                                    <li>Wheat: Northern Plains</li>
                                    <li>Cotton: Maharashtra, Gujarat</li>
                                    <li>Tea: Assam, West Bengal</li>
                                    <li>Coffee: Karnataka, Kerala, Tamil Nadu</li>
                                </ul>
                            </li>
                            <li class="list-group-item">
                                <h5 class="text-warning">Agricultural Seasons</h5>
                                <ul>
                                    <li>Kharif (July-October): Rice, Maize, Sorghum, Cotton, Groundnut</li>
                                    <li>Rabi (October-March): Wheat, Barley, Peas, Gram</li>
                                    <li>Zaid (March-July): Watermelon, Cucumber, Vegetables</li>
                                </ul>
                            </li>
                        </ul>
                        <div class="map-image mt-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/India_agriculture_map.svg" 
                                 alt="Agricultural Map of India" 
                                 class="img-fluid border rounded">
                        </div>
                    </div>
                `
            }
        };

        this.bindEvents();
    }

    bindEvents() {
        // Bind map category buttons
        this.mapButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mapType = button.dataset.mapType;
                this.showMap(mapType);

                // Update active button
                this.mapButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Show maps modal
        document.getElementById('show-maps').addEventListener('click', () => {
            this.mapModal.show();
            // Show default map (rivers)
            this.showMap('rivers');

            // Log for debugging
            console.log('Map modal opened');
        });
    }

    showMap(type) {
        const mapData = this.maps[type];
        if (!mapData) {
            console.error('Map type not found:', type);
            return;
        }

        console.log('Showing map:', type); // Debug log
        this.mapContainer.innerHTML = mapData.content;
    }
}

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing UPSC Maps'); // Debug log
    new UPSCMaps();
});