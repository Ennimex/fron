// frontend/src/services/api.js
import axios from 'axios';

// Configura la URL base del backend
const api = axios.create({
    baseURL: 'http://localhost:3001', // Asegúrate de que coincida con el puerto del backend
});

// Ejemplo de función para obtener datos
export const getData = async () => {
    try {
        const response = await api.get('/api/data');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};