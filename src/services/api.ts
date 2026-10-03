import { auth } from '../firebase/config';

const PYTHON_SERVER_URL = import.meta.env.VITE_PYTHON_SERVER_URL || 'http://localhost:5001';

const getAuthToken = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
};

export const pythonApi = {
    get: async (endpoint: string) => {
        const token = await getAuthToken();
        const response = await fetch(`${PYTHON_SERVER_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        return response.json();
    },

    post: async (endpoint: string, data: unknown) => {
        const token = await getAuthToken();
        const response = await fetch(`${PYTHON_SERVER_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },
};

export const edafApi = {
    provisionDevice: async (deviceId: string) => {
        const response = await fetch(`${PYTHON_SERVER_URL}/provision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_id: deviceId }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to provision device');
        }
        return response.json();
    },

    publishCommand: async (deviceId: string, command: string) => {
        const response = await fetch(`${PYTHON_SERVER_URL}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_id: deviceId, command: command }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `Failed to dispatch ${command} command`);
        }
        return response.json();
    }
};
