import { getAuthHeaders } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:9091';

export async function createIncident(incidentData,session) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/incidents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(session),
            },
            body: JSON.stringify(incidentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating incident:', error);
        throw error;
    }
}

export async function getAllIncidents(session) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/incidents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(session),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching incidents:', error);
        throw error;
    }
}

export async function getIncidentById(incidentId,session) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/incidents/${incidentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(session),
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching incident:', error);
        throw error;
    }
}

export function createIncidentWebSocket() {
    return new WebSocket(`${WS_BASE_URL}/incidents`);
}
