import http from './httpService';
import { imageUrl } from '../config.json';

export function uploadImages(formData) {
    return http.post(`${imageUrl}/image`, formData).then(response => {
        return response.data;
    });
}