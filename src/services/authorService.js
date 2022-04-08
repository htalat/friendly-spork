import http from './httpService';
import { apiUrl, recipeUrl } from '../config.json';

export function getAuthors() {
    return http.get(`${recipeUrl}/recipes/authors`).then(response => {
        return response.data;
    });
}