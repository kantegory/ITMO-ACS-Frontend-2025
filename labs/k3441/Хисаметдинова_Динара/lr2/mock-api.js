const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

let dbData;
try {
    const dbPath = path.join(__dirname, 'db.json');
    dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('Loaded db.json with properties:', dbData.properties.length);
} catch (error) {
    console.error('Failed to load db.json:', error);
    process.exit(1);
}

app.get('/api/v1/hotels/search', (req, res) => {
    const { latitude, longitude, radius = 50 } = req.query;

    const hasCoordinates = latitude && longitude;

    setTimeout(() => {
        const hotels = dbData.properties.map(property => ({
            id: `mock_${property.id}`,
            name: property.title,
            title: property.title,
            location: property.location,
            type: property.type,
            price: property.price,
            rating: property.rating,
            reviews: property.reviews || Math.floor(Math.random() * 100) + 10,
            amenities: property.amenities || ['WiFi', 'Parking'],
            image: property.image,
            description: property.description,
            maxGuests: property.maxGuests || 4,
            bedrooms: property.bedrooms || 1,
            bathrooms: property.bathrooms || 1,
            coordinates: hasCoordinates ? {
                lat: parseFloat(latitude) + (Math.random() - 0.5) * 0.1,
                lng: parseFloat(longitude) + (Math.random() - 0.5) * 0.1
            } : {
                lat: null,
                lng: null
            },
            source: 'mock-api',
            isExternal: true
        }));

        const response = {
            success: true,
            data: hotels,
            total: hotels.length,
            location: hasCoordinates ? {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                radius: parseFloat(radius)
            } : null,
            source: 'mock-api'
        };

        res.json(response);
    }, 500);
});

app.listen(PORT, () => {
    console.log(`Mock API: http://localhost:${PORT}`);
});

module.exports = app;