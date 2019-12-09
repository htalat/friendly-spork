import React from 'react';

const SearchBox = ({value, change}) =>{
    return(
        <input
            type="text"
            name="query"
            className="form-control my-3"
            placeholder="Search..."
            value={value}
            onChange={e => change(e.currentTarget.value)}
        />
    )
}

export default SearchBox;