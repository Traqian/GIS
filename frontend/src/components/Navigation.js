import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import Dijkstra from 'dijkstra-js';
import './Navigation.css';

// Remove the default icon setting from Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Set up custom icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Navigation = () => {
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        // Fetch all paths from server
        const fetchPaths = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/paths');
                setPaths(response.data);
            } catch (error) {
                console.error('Error fetching paths:', error);
            }
        };

        fetchPaths();
    }, []);

    const handleStartPointChange = (e) => {
        const [lat, lng] = e.target.value.split(',').map(Number);
        setStartPoint([lat, lng]);
    };

    const handleEndPointChange = (e) => {
        const [lat, lng] = e.target.value.split(',').map(Number);
        setEndPoint([lat, lng]);
    };

    const calculateRoute = () => {
        if (!startPoint || !endPoint || paths.length === 0) return;

        // Create graph for Dijkstra's algorithm
        const graph = new Dijkstra.Graph();
        const pathMap = new Map();

        // Add all paths to graph
        paths.forEach(path => {
            const start = JSON.stringify(path.start_point);
            const end = JSON.stringify(path.end_point);
            
            pathMap.set(start, path.start_point);
            pathMap.set(end, path.end_point);
            
            graph.addVertex(start);
            graph.addVertex(end);
            graph.addEdge(start, end, path.length_meters);
        });

        // Find shortest path
        const startKey = JSON.stringify(startPoint);
        const endKey = JSON.stringify(endPoint);
        
        const path = graph.find(startKey, endKey);
        
        if (path && path.length > 0) {
            // Convert path coordinates
            const routeCoordinates = path.map(key => pathMap.get(key));
            setRoute(routeCoordinates);
        } else {
            setRoute(null);
        }
    };

    const startNavigation = () => {
        if (!route) return;
        setIsNavigating(true);
        setCurrentStep(0);
    };

    const nextStep = () => {
        if (currentStep < route.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="navigation-container">
            <div className="navigation-controls">
                <div className="input-group">
                    <label>起点:</label>
                    <input 
                        type="text" 
                        placeholder="纬度,经度"
                        onChange={handleStartPointChange}
                    />
                </div>
                <div className="input-group">
                    <label>终点:</label>
                    <input 
                        type="text" 
                        placeholder="纬度,经度"
                        onChange={handleEndPointChange}
                    />
                </div>
                <button onClick={calculateRoute} disabled={!startPoint || !endPoint}>
                    规划路线
                </button>
                {route && (
                    <React.Fragment>
                        <button onClick={startNavigation} disabled={isNavigating}>
                            开始导航
                        </button>
                        {isNavigating && (
                            <div className="navigation-buttons">
                                <button onClick={previousStep} disabled={currentStep === 0}>
                                    上一步
                                </button>
                                <button onClick={nextStep} disabled={currentStep === route.length - 1}>
                                    下一步
                                </button>
                            </div>
                        )}
                    </React.Fragment>
                )}
            </div>

            <MapContainer 
                center={startPoint || [30.5234, 114.3187]} 
                zoom={17}
                style={{ height: '60vh', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {startPoint && (
                    <Marker position={startPoint} icon={L.icon({
                        iconUrl: require('./assets/start-marker.png'),
                        iconSize: [38, 38],
                        iconAnchor: [19, 38]
                    })}>
                        <Popup>起点</Popup>
                    </Marker>
                )}

                {endPoint && (
                    <Marker position={endPoint} icon={L.icon({
                        iconUrl: require('./assets/end-marker.png'),
                        iconSize: [38, 38],
                        iconAnchor: [19, 38]
                    })}>
                        <Popup>终点</Popup>
                    </Marker>
                )}

                {route && (
                    <Polyline 
                        positions={route} 
                        color="blue"
                        weight={5}
                        opacity={0.7}
                    />
                )}

                {route && isNavigating && (
                    <Marker 
                        position={route[currentStep]}
                        icon={L.icon({
                            iconUrl: require('./assets/current-location.png'),
                            iconSize: [38, 38],
                            iconAnchor: [19, 38]
                        })}
                    >
                        <Popup>
                            当前位置
                            <br />
                            步骤 {currentStep + 1}/{route.length}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {route && isNavigating && (
                <div className="navigation-info">
                    <h3>导航信息</h3>
                    <p>当前位置: {route[currentStep][0]}, {route[currentStep][1]}</p>
                    <p>总步数: {route.length}</p>
                    <p>当前步数: {currentStep + 1}</p>
                </div>
            )}
        </div>
    );
};

export default Navigation;
