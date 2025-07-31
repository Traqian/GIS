import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './RealTimeTracking.css';

// Remove the default icon setting from Leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Set up custom icons
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const RealTimeTracking = () => {
    const [position, setPosition] = useState(null);
    const [trackingEnabled, setTrackingEnabled] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [isCharging, setIsCharging] = useState(false);
    const [accuracy, setAccuracy] = useState(null);

    useEffect(() => {
        if (trackingEnabled) {
            // Request high accuracy
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosition([position.coords.latitude, position.coords.longitude]);
                    setAccuracy(position.coords.accuracy);
                    setLastUpdate(new Date());
                },
                (error) => {
                    console.error('Error getting position:', error);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );

            // Start watching position
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setPosition([position.coords.latitude, position.coords.longitude]);
                    setAccuracy(position.coords.accuracy);
                    setLastUpdate(new Date());
                },
                (error) => {
                    console.error('Error watching position:', error);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );

            // Cleanup
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [trackingEnabled]);

    useEffect(() => {
        // Get battery status
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                battery.addEventListener('levelchange', () => setBatteryLevel(battery.level * 100));
                battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
                setBatteryLevel(battery.level * 100);
                setIsCharging(battery.charging);
            });
        }
    }, []);

    const toggleTracking = () => {
        setTrackingEnabled(!trackingEnabled);
    };

    const formatTime = (date) => {
        return date ? date.toLocaleTimeString() : '未获取';
    };

    return (
        <div className="tracking-container">
            <div className="tracking-controls">
                <button onClick={toggleTracking} className={trackingEnabled ? 'active' : ''}>
                    {trackingEnabled ? '停止跟踪' : '开始跟踪'}
                </button>
                <div className="tracking-status">
                    <p>状态: {trackingEnabled ? '正在跟踪' : '未跟踪'}</p>
                    <p>电池: {batteryLevel !== null ? `${batteryLevel}%` : '未知'} {isCharging ? '(充电中)' : ''}</p>
                    <p>最后更新: {formatTime(lastUpdate)}</p>
                    <p>精度: {accuracy !== null ? `${accuracy} 米` : '未知'}</p>
                </div>
            </div>

            <MapContainer 
                center={position || [30.5234, 114.3187]}
                zoom={17}
                style={{ height: '60vh', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {position && (
                    <React.Fragment>
                        <Circle
                            center={position}
                            radius={accuracy || 20}
                            color="blue"
                            fillColor="blue"
                            fillOpacity={0.2}
                        >
                            <Popup>
                                当前位置
                                <br />
                                精度: {accuracy || 20} 米
                            </Popup>
                        </Circle>

                        <Marker 
                            position={position}
                            icon={L.icon({
                                iconUrl: require('./assets/current-location.png'),
                                iconSize: [38, 38],
                                iconAnchor: [19, 38]
                            })}
                        >
                            <Popup>
                                当前位置
                                <br />
                                更新时间: {formatTime(lastUpdate)}
                                <br />
                                精度: {accuracy || 20} 米
                            </Popup>
                        </Marker>
                    </React.Fragment>
                )}
            </MapContainer>

            {trackingEnabled && (
                <div className="tracking-info">
                    <h3>跟踪信息</h3>
                    <p>当前位置: {position ? `${position[0]}, ${position[1]}` : '未获取'}</p>
                    <p>精度: {accuracy !== null ? `${accuracy} 米` : '未知'}</p>
                    <p>最后更新: {formatTime(lastUpdate)}</p>
                    <p>电池电量: {batteryLevel !== null ? `${batteryLevel}%` : '未知'}</p>
                    <p>充电状态: {isCharging ? '正在充电' : '未充电'}</p>
                </div>
            )}
        </div>
    );
};

export default RealTimeTracking;
