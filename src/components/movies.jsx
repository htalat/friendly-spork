import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import Pagination from '../common/pagination';
import ListGroup from '../common/listGroup';
import { paginate } from '../utils/paginate';
import MoviesTable from './moviesTable';
import _ from 'lodash';

export default class movies extends Component {

    state = {
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        sortColumn: { path: 'title', order: 'asc'}
    }

    componentDidMount() {

        const genres = [ {name: 'All Genres', _id: -1}, ...getGenres()];

        this.setState({movies: getMovies(), genres })
    }

    handleDelete = (movie) => {
        let { movies } = this.state;
        movies = movies.filter(m => m._id !== movie._id);
        this.setState({ movies })
    }

    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
    }

    handleSort = sortColumn =>{

        this.setState({ sortColumn });
    }

    handlePageChange = (page) =>{
        this.setState({ currentPage: page})
    }

    handleGenreSelect = (genre) => {
        this.setState({ selectedGenre: genre, currentPage: 1 });
    }

    getPageData = () =>{

        const { 
            pageSize, 
            currentPage, 
            selectedGenre, 
            sortColumn,
            movies: allMovies
        } = this.state;

        const filteredMovies = selectedGenre && selectedGenre._id !== -1 ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;

        const sorted = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);

        const movies = paginate(sorted, currentPage, pageSize);

        return { totalCount: filteredMovies.length, data: movies };
    }

    render() {

        let count = this.state.movies.length;

        const { 
            pageSize, 
            currentPage,
            sortColumn
        } = this.state;

        if(count === 0){
            return <p>There are no movies in the database</p>
        }

        const {totalCount, data: movies} = this.getPageData();

        return (
            <div className="row">
                <div className="col-3">
                    <ListGroup 
                        items={this.state.genres}
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handleGenreSelect} 
                    />
                </div>
                <div className="col">
                    <p>Showing {totalCount} movies in the database.</p>
                    <MoviesTable
                        movies={movies}
                        sortColumn={sortColumn}
                        onLike={this.handleLike}
                        onDelete={this.handleDelete}
                        onSort={this.handleSort}
                    />
                    <Pagination 
                        itemsCount={totalCount} 
                        pageSize={pageSize} 
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange}
                    />
                </div>
            </div>
        )
    }
}
