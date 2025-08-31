import { useState, useEffect, useCallback, useRef } from 'react';
import { createIncident, getAllIncidents, createIncidentWebSocket } from './api';
import { useSession } from 'next-auth/react';

export function useIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const [totalCounts, setTotalCounts] = useState({
        power_cut: 0,
        traffic_jam: 0,
        safety_issue: 0,
        other: 0
    });
    const wsRef = useRef(null);

    // Fetch all incidents from API
    const fetchIncidents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllIncidents(session);
            
            if (response.success) {
                setIncidents(response.data || []);
                updateTotalCounts(response.data || []);
            } else {
                setError(response.message || 'Failed to fetch incidents');
            }
        } catch (err) {
            console.warn('Failed to fetch incidents:', err.message);
            setError(err.message || 'Failed to fetch incidents');
            // Don't block the UI, just show empty state
            setIncidents([]);
        } finally {
            setLoading(false);
        }
    }, [session]);

    // Create new incident
    const createNewIncident = useCallback(async (incidentData) => {
        try {
            setError(null);
            const response = await createIncident(incidentData,session);
            
            if (response.success) {
                // Don't manually add to incidents - WebSocket will handle it
                // This prevents double counting when WebSocket broadcasts the new incident
                return { success: true, data: response.data };
            } else {
                setError(response.message || 'Failed to create incident');
                return { success: false, error: response.message };
            }
        } catch (err) {
            setError(err.message || 'Failed to create incident');
            return { success: false, error: err.message };
        }
    }, [session]);

    // Update total counts based on incident types
    const updateTotalCounts = useCallback((incidentList) => {
        const today = new Date().toDateString();
        const todayIncidents = incidentList.filter(incident => {
            const incidentDate = new Date(incident.reportedAt).toDateString();
            return incidentDate === today;
        });

        const counts = {
            power_cut: todayIncidents.filter(i => i.incidentType === 'power_cut').length,
            traffic_jam: todayIncidents.filter(i => i.incidentType === 'traffic_jam').length,
            safety_issue: todayIncidents.filter(i => i.incidentType === 'safety_issue').length,
            other: todayIncidents.filter(i => i.incidentType === 'other').length
        };

        setTotalCounts(counts);
    }, []);

    // WebSocket connection for real-time updates
    const connectWebSocket = useCallback(() => {
        // Prevent multiple connections
        if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        try {
            const ws = createIncidentWebSocket();
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected for incidents');
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'new_incident') {
                        setIncidents(prev => [message.data, ...prev]);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            ws.onerror = (error) => {
                console.warn('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                wsRef.current = null;
                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (!wsRef.current) {
                        connectWebSocket();
                    }
                }, 5000);
            };
        } catch (err) {
            console.warn('Failed to connect WebSocket:', err);
            // Don't block the UI if WebSocket fails
        }
    }, []); // Remove dependencies to prevent re-renders

    // Initialize data and WebSocket connection
    useEffect(() => {
        fetchIncidents();
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [fetchIncidents, connectWebSocket]);

    // Update total counts when incidents change
    useEffect(() => {
        updateTotalCounts(incidents);
    }, [incidents, updateTotalCounts]);

    return {
        incidents,
        loading,
        error,
        totalCounts,
        createNewIncident,
        fetchIncidents
    };
}
