import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BuildingInfo.css';

const BuildingInfo = () => {
    const { id } = useParams();
    const [building, setBuilding] = useState(null);
    const [nearbyBuildings, setNearbyBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBuildingData = async () => {
            try {
                // Fetch specific building data
                const buildingResponse = await axios.get(`http://localhost:3000/api/buildings/${id}`);
                setBuilding(buildingResponse.data);

                // Fetch nearby buildings
                const nearbyResponse = await axios.get(`http://localhost:3000/api/buildings/nearby`, {
                    params: {
                        lat: buildingResponse.data.lat,
                        lng: buildingResponse.data.lng,
                        radius: 200 // 200 meters radius
                    }
                });
                setNearbyBuildings(nearbyResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBuildingData();
    }, [id]);

    if (loading) {
        return (
            <div className="building-info-container">
                <div className="loading">加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="building-info-container">
                <div className="error">错误: {error}</div>
            </div>
        );
    }

    if (!building) {
        return (
            <div className="building-info-container">
                <div className="not-found">未找到建筑物信息</div>
            </div>
        );
    }

    return (
        <div className="building-info-container">
            <div className="building-header">
                <h1>{building.name}</h1>
                <div className="building-type">{building.building_type}</div>
            </div>

            <div className="building-details">
                <div className="detail-section">
                    <h2>基本信息</h2>
                    <div className="detail-item">
                        <span className="label">地址:</span>
                        <span className="value">{building.address}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">楼层数:</span>
                        <span className="value">{building.floors}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">容纳人数:</span>
                        <span className="value">{building.capacity}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h2>描述</h2>
                    <p>{building.description || '暂无描述'}</p>
                </div>

                <div className="detail-section">
                    <h2>附近建筑物</h2>
                    <div className="nearby-buildings">
                        {nearbyBuildings.map(nb => (
                            <div key={nb.id} className="nearby-building">
                                <h3>{nb.name}</h3>
                                <p>距离: {nb.distance.toFixed(1)} 米</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="building-actions">
                <button className="action-button">
                    <a href={`https://maps.google.com?q=${building.lat},${building.lng}`} target="_blank" rel="noopener noreferrer">
                        在地图上查看
                    </a>
                </button>
                <button className="action-button">
                    导航到此地
                </button>
            </div>
        </div>
    );
};

export default BuildingInfo;
