import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from '../services/authService';
import Like from '../common/like';
import Table from '../common/table';

class MoviesTable extends Component {

    columns = [
        { path: 'title', label: 'Title', content: movie => <Link to={`/movies/${movie.id}`}> {movie.title} </Link>},
        { path: 'imageURL', label: 'Image', content: movie => <Link to={{ pathname: movie.imageURL}} target="_blank"> {`${movie.imageURL}`} </Link>},
    ]

    deleteColumn = { key: 'delete', content:  movie => <button onClick={ () => this.props.onDelete(movie)} className="btn btn-danger btn-sm">Delete</button> }

    constructor(){
        super();

        const user = auth.getCurrentUser();
        if(user && user.isAdmin){
            this.columns.push(this.deleteColumn)
        }
    }

    raiseSort =  path =>{
        const sortColumn = {...this.props.sortColumn};
        if (sortColumn.path === path)
            sortColumn.order = (sortColumn.order === 'asc') ? 'desc' : 'asc';
        else{
            sortColumn.path = path;
            sortColumn.order = 'asc';
        }
        this.props.onSort(sortColumn);
    }

    render(){

        const { movies, onSort, sortColumn } = this.props;

        return (
            <Table
                columns={this.columns}
                data={movies}
                sortColumn={sortColumn}
                onSort={onSort}
            />
        );
    }
}

export default MoviesTable;
