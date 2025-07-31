import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Remove the default icon setting from Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Set up custom icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const CampusMap = () => {
    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        // Fetch buildings data
        const fetchBuildings = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/buildings');
                setBuildings(response.data);
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };

        fetchBuildings();
    }, []);

    // Get current position
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentPosition([
                        position.coords.latitude,
                        position.coords.longitude
                    ]);
                },
                (error) => {
                    console.error('Error getting position:', error);
                }
            );
        }
    }, []);

    const handleBuildingClick = (building) => {
        setSelectedBuilding(building);
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer 
                center={[30.5234, 114.3187]} // Default to Wuhan University coordinates
                zoom={17}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Display current position */}
                {currentPosition && (
                    <Circle
                        center={currentPosition}
                        radius={10}
                        color="blue"
                        fillColor="blue"
                        fillOpacity={0.5}
                    />
                )}

                {/* Display buildings */}
                {buildings.map((building) => (
                    <Marker
                        key={building.id}
                        position={[building.lat, building.lng]}
                        eventHandlers={{
                            click: () => handleBuildingClick(building)
                        }}
                    >
                        <Popup>
                            <h3>{building.name}</h3>
                            <p>{building.description}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Building info panel */}
            {selectedBuilding && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'white',
                    padding: '15px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                    <h3>{selectedBuilding.name}</h3>
                    <p>{selectedBuilding.description}</p>
                    <p>地址: {selectedBuilding.address}</p>
                    <p>楼层数: {selectedBuilding.floors}</p>
                    <button
                        onClick={() => setSelectedBuilding(null)}
                        style={{
                            marginTop: '10px',
                            padding: '5px 10px',
                            border: 'none',
                            backgroundColor: '#ccc',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        关闭
                    </button>
                </div>
            )}
        </div>
    );
};

export default CampusMap;
