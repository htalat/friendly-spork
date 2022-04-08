import http from './httpService';
import { apiUrl, recipeUrl } from '../config.json'

const apiEndpoint = `${recipeUrl}/recipes`;

function movieUrl(id){
    return `${apiEndpoint}/${id}`;
}

export function getMovies() {
    return http.get(apiEndpoint).then(response => {
        return response.data;
    });
}
  
export function deleteMovie(id) {
    return http.delete(movieUrl(id));
}

export function getMovie(id) {
    return http.get(movieUrl(id)).then(response => {
        return response.data;
    });
}
  
export function saveMovie(movie) {
    if(movie.id){
        const id = movie.id;
        const body = { recipe: movie };
        return http.put(movieUrl(id), body);
    }

    const body = { recipe: movie };
    return http.post(apiEndpoint, body)
}