import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CampusMap from '../components/CampusMap';

// Mock Leaflet components
jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => <div>TileLayer</div>,
    Marker: ({ children }) => <div>Marker</div>,
    Popup: ({ children }) => <div>Popup</div>
}));

describe('CampusMap Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders map container', () => {
        render(
            <MemoryRouter>
                <CampusMap />
            </MemoryRouter>
        );
        expect(screen.getByText('MapContainer')).toBeInTheDocument();
    });

    test('displays buildings markers', async () => {
        // Mock API response
        const mockBuildings = [
            { id: 1, name: '图书馆', lat: 30.5234, lng: 114.3187 },
            { id: 2, name: '教学楼', lat: 30.5235, lng: 114.3188 }
        ];

        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: () => Promise.resolve(mockBuildings)
        });

        render(
            <MemoryRouter>
                <CampusMap />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText('Marker')).toHaveLength(2);
        });
    });

    test('handles building click', async () => {
        const mockBuilding = { id: 1, name: '图书馆', description: '主图书馆' };
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: () => Promise.resolve(mockBuilding)
        });

        render(
            <MemoryRouter>
                <CampusMap />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Popup')).toBeInTheDocument();
        });
    });

    test('displays current position', async () => {
        // Mock geolocation
        const mockGeolocation = {
            getCurrentPosition: jest.fn((success) => {
                success({
                    coords: {
                        latitude: 30.5234,
                        longitude: 114.3187
                    }
                });
            })
        };
        global.navigator.geolocation = mockGeolocation;

        render(
            <MemoryRouter>
                <CampusMap />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Circle')).toBeInTheDocument();
        });
    });
});
