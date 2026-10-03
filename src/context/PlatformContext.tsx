import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query } from 'firebase/firestore';

export type DeviceStatus = 'connected' | 'disconnected';
export type MTLSStatus = 'verified' | 'expiring_soon' | 'failed';

export interface Device {
    id: string;
    name: string;
    type: 'Sensor' | 'Gateway' | 'Actuator';
    ip: string;
    status: DeviceStatus;
    mtlsStatus: MTLSStatus;
    certExpiry: string;
    certFingerprint: string;
    lastHeartbeat: string;
    firmwareVersion: string;
    protocol: string;
    location: string;
}

interface PlatformContextType {
    devices: Device[];
    theme: string;
    toggleTheme: () => void;
    refreshData: () => void;
    lastRefreshed: Date;
    provisionDevice: (device: Partial<Device>) => void;
    rotateCertificate: (deviceId: string) => void;
    revokeDevice: (deviceId: string) => void;
    warningsCount: number;
    isLoading: boolean;
}

const INITIAL_DEVICES: Device[] = [];

const HEARTBEATS = ['Just now', '1s ago', '2s ago', '3s ago', '5s ago', '8s ago', '12s ago'];

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
    const [isLoading, setIsLoading] = useState(true);
    const theme = 'light';
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, 'devices'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedDevices: Device[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Unknown Device',
                    type: data.type || 'Sensor',
                    ip: data.ip || '0.0.0.0',
                    status: data.status || 'disconnected',
                    mtlsStatus: data.mtlsStatus || 'failed',
                    certExpiry: data.certExpiry || 'Unknown',
                    certFingerprint: data.certFingerprint || 'Unknown',
                    lastHeartbeat: data.lastHeartbeat || 'Unknown',
                    firmwareVersion: data.firmwareVersion || 'Unknown',
                    protocol: data.protocol || 'Unknown',
                    location: data.location || 'Unknown'
                } as Device;
            });

            setDevices(fetchedDevices);
            setLastRefreshed(new Date());
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching devices:", error);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const toggleTheme = () => { };

    const refreshData = () => {
        setDevices(prev => prev.map(d => ({
            ...d,
            lastHeartbeat: d.status === 'connected'
                ? HEARTBEATS[Math.floor(Math.random() * HEARTBEATS.length)]
                : d.lastHeartbeat
        })));
        setLastRefreshed(new Date());
    };

    const provisionDevice = (newDevice: Partial<Device>) => {
        const fullDevice: Device = {
            id: `iot_${Math.random().toString(36).substr(2, 6)}`,
            name: newDevice.name || 'New Device',
            type: newDevice.type || 'Sensor',
            ip: newDevice.ip || '0.0.0.0',
            status: 'connected',
            mtlsStatus: 'verified',
            certExpiry: 'Mar 08, 2027',
            certFingerprint: `SHA256:${Math.random().toString(16).substr(2, 2).toUpperCase()}:...`,
            lastHeartbeat: 'Just now',
            firmwareVersion: 'v1.0.0',
            protocol: 'MQTT over TLS 1.3',
            location: newDevice.location || 'Unknown',
        };
        setDevices(prev => [...prev, fullDevice]);
    };

    const API_BASE = 'http://localhost:8000';

    const rotateCertificate = async (deviceId: string) => {
        try {
            const res = await fetch(`${API_BASE}/device/rotate?device_id=${deviceId}`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                console.error('Rotate failed:', data);
            } else {
                console.log('[ROTATE] Success:', data);
            }
        } catch (err) {
            console.error('Rotate error:', err);
            // Optimistic local fallback
            setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, mtlsStatus: 'verified' as MTLSStatus, certExpiry: 'Mar 08, 2027' } : d));
        }
    };

    const revokeDevice = async (deviceId: string) => {
        try {
            const res = await fetch(`${API_BASE}/device/revoke?device_id=${deviceId}`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                console.error('Revoke failed:', data);
            } else {
                console.log('[REVOKE] Success:', data);
            }
        } catch (err) {
            console.error('Revoke error:', err);
            // Optimistic local fallback
            setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'disconnected' as DeviceStatus, mtlsStatus: 'failed' as MTLSStatus } : d));
        }
    };


    const warningsCount = devices.filter(d => d.mtlsStatus !== 'verified').length;

    return (
        <PlatformContext.Provider value={{
            devices, theme, toggleTheme, refreshData, lastRefreshed,
            provisionDevice, rotateCertificate, revokeDevice, warningsCount, isLoading
        }}>
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatform = () => {
    const context = useContext(PlatformContext);
    if (!context) throw new Error('usePlatform must be used within a PlatformProvider');
    return context;
};
