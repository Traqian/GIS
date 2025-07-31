const express = require('express');
const router = express.Router();
const Building = require('../models/building');

// 建筑物相关API
router.get('/buildings', async (req, res) => {
    try {
        const buildings = await Building.getAll();
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/buildings/:id', async (req, res) => {
    try {
        const building = await Building.getById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.json(building);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/buildings/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 1000 } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
        
        const nearbyBuildings = await Building.getNearby(parseFloat(lat), parseFloat(lng), parseFloat(radius));
        res.json(nearbyBuildings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
