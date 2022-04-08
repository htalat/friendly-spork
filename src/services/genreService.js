import http from './httpService';
import { apiUrl, recipeUrl } from '../config.json';

export function getGenres() {
    return http.get(`${recipeUrl}/recipes/categories`).then(response => {
        return response.data;
    });
}