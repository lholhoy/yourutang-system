import { useState, useEffect } from 'react';
import axios from 'axios';

const PSGC_API_BASE = 'https://psgc.gitlab.io/api';

export default function usePhLocations() {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(`${PSGC_API_BASE}/provinces/`);
                // Sort alphabetically
                const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setProvinces(sorted);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    const fetchCities = async (provinceCode) => {
        if (!provinceCode) {
            setCities([]);
            return;
        }
        setLoading(true);
        try {
            // Fetch cities and municipalities
            const [citiesRes, munisRes] = await Promise.all([
                axios.get(`${PSGC_API_BASE}/provinces/${provinceCode}/cities`),
                axios.get(`${PSGC_API_BASE}/provinces/${provinceCode}/municipalities`)
            ]);

            const combined = [...citiesRes.data, ...munisRes.data];
            const sorted = combined.sort((a, b) => a.name.localeCompare(b.name));
            setCities(sorted);
        } catch (error) {
            console.error("Error fetching cities/municipalities:", error);
            setCities([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBarangays = async (cityCodeOrMuniCode) => {
        if (!cityCodeOrMuniCode) {
            setBarangays([]);
            return;
        }
        setLoading(true);
        try {
            // Try fetching as city first, then municipality if needed, or just use the generic endpoint if available
            // PSGC API has separate endpoints. We can try one and then the other, or check our cities list to see if it's a city or municipality.
            // However, the ID is unique, so we can try both endpoints or use a generic one if it exists.
            // Actually, simpler approach: The city/muni object usually has a type or we can just try both endpoints.
            // But wait, the previous fetchCities merged them.

            // Let's try fetching from cities first
            let response;
            try {
                response = await axios.get(`${PSGC_API_BASE}/cities/${cityCodeOrMuniCode}/barangays`);
            } catch (e) {
                // If 404, try municipalities
                response = await axios.get(`${PSGC_API_BASE}/municipalities/${cityCodeOrMuniCode}/barangays`);
            }

            const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setBarangays(sorted);
        } catch (error) {
            console.error("Error fetching barangays:", error);
            setBarangays([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        provinces,
        cities,
        barangays,
        fetchCities,
        fetchBarangays,
        loading
    };
}
