import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getMovies, deleteMovie } from '../services/movieService';
import { getGenres } from '../services/genreService';
import Pagination from '../common/pagination';
import ListGroup from '../common/listGroup';
import { paginate } from '../utils/paginate';
import MoviesTable from './moviesTable';
import SearchBox from '../common/searchBox';
import _ from 'lodash';
import { toast } from 'react-toastify';

export default class movies extends Component {

    state = {
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        searchQuery: "",
        selectedGenre: null,
        sortColumn: { path: 'title', order: 'asc'}
    }

    async componentDidMount() {
        const { data } = await getGenres();
        const genres = [ {name: 'All Genres', _id: -1}, ...data];

        const { data: movies } = await getMovies();

        this.setState({movies, genres })
    }

    handleDelete = async (movie) => {
        const originalMovies = this.state.movies;
        let { movies } = this.state;
        movies = movies.filter(m => m._id !== movie._id);
        this.setState({ movies });

        try{
            await deleteMovie(movie._id);
        }catch(ex){
            if(ex.response && ex.response.status === 404)
                toast.error('This movie has already been deleted');

            this.setState({ movies: originalMovies })
        }
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

    handleSearch = (query) =>{
        this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1});
    }

    handleGenreSelect = (genre) => {
        this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
    }

    getPageData = () =>{

        const { 
            pageSize, 
            currentPage, 
            selectedGenre, 
            sortColumn,
            searchQuery,
            movies: allMovies
        } = this.state;

        let filteredMovies = selectedGenre && selectedGenre._id !== -1 ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;

        if(searchQuery)
            filteredMovies = allMovies.filter(m => m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
        else if(selectedGenre && selectedGenre._id)
            filteredMovies = allMovies.filter(m => m.genre._id === selectedGenre._id);

        const sorted = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);

        const movies = paginate(sorted, currentPage, pageSize);

        return { totalCount: filteredMovies.length, data: movies };
    }

    render() {

        let count = this.state.movies.length;

        const { 
            pageSize, 
            currentPage,
            sortColumn,
            searchQuery,
            user
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
                    {user && (
                        <Link
                            to="/movies/new"
                            className="btn btn-primary"
                            style={{marginBotton: 20}}
                        >
                            New Movie
                        </Link>
                    )}
                    <p>Showing {totalCount} movies in the database.</p>
                    <SearchBox value={searchQuery} change={this.handleSearch} />
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