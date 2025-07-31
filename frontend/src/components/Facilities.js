import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './Facilities.css';

// Remove the default icon setting from Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Set up custom icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const facilityIcons = {
    library: require('./assets/library-icon.png'),
    canteen: require('./assets/canteen-icon.png'),
    sports: require('./assets/sports-icon.png'),
    parking: require('./assets/parking-icon.png'),
    medical: require('./assets/medical-icon.png'),
    atm: require('./assets/atm-icon.png')
};

const facilityTypes = [
    { value: 'library', label: '图书馆' },
    { value: 'canteen', label: '食堂' },
    { value: 'sports', label: '运动场' },
    { value: 'parking', label: '停车场' },
    { value: 'medical', label: '医务室' },
    { value: 'atm', label: 'ATM' }
];

const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [currentPosition, setCurrentPosition] = useState(null);
    const [nearbyFacilities, setNearbyFacilities] = useState([]);

    useEffect(() => {
        // Fetch facilities data
        const fetchFacilities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/facilities');
                setFacilities(response.data);
            } catch (error) {
                console.error('Error fetching facilities:', error);
            }
        };

        fetchFacilities();
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
                    // Fetch nearby facilities
                    fetchNearbyFacilities(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Error getting position:', error);
                }
            );
        }
    }, []);

    const fetchNearbyFacilities = async (lat, lng) => {
        try {
            const response = await axios.get('http://localhost:3000/api/facilities/nearby', {
                params: {
                    lat,
                    lng,
                    radius: 500 // 500 meters radius
                }
            });
            setNearbyFacilities(response.data);
        } catch (error) {
            console.error('Error fetching nearby facilities:', error);
        }
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const filteredFacilities = selectedType === 'all' 
        ? facilities 
        : facilities.filter(f => f.type === selectedType);

    return (
        <div className="facilities-container">
            <div className="facilities-controls">
                <select value={selectedType} onChange={handleTypeChange}>
                    <option value="all">所有设施</option>
                    {facilityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <MapContainer 
                center={currentPosition || [30.5234, 114.3187]}
                zoom={17}
                style={{ height: '60vh', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Display current position */}
                {currentPosition && (
                    <Circle
                        center={currentPosition}
                        radius={500}
                        color="blue"
                        fillColor="blue"
                        fillOpacity={0.1}
                    >
                        <Popup>
                            附近500米范围
                        </Popup>
                    </Circle>
                )}

                {/* Display facilities */}
                {filteredFacilities.map((facility) => (
                    <Marker
                        key={facility.id}
                        position={[facility.lat, facility.lng]}
                        icon={L.icon({
                            iconUrl: facilityIcons[facility.type],
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })}
                    >
                        <Popup>
                            <h3>{facility.name}</h3>
                            <p>{facility.description}</p>
                            <p>类型: {facility.type}</p>
                            <p>开放时间: {facility.opening_hours ? JSON.stringify(facility.opening_hours) : '全天开放'}</p>
                            <p>联系方式: {facility.contact_info ? JSON.stringify(facility.contact_info) : '暂无'}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="nearby-facilities">
                <h3>附近设施</h3>
                {nearbyFacilities.map((facility) => (
                    <div key={facility.id} className="facility-item">
                        <img 
                            src={facilityIcons[facility.type]} 
                            alt={facility.type}
                            style={{ width: '24px', height: '24px', marginRight: '10px' }}
                        />
                        <div>
                            <h4>{facility.name}</h4>
                            <p>类型: {facility.type}</p>
                            <p>距离: {facility.distance.toFixed(1)} 米</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Facilities;
