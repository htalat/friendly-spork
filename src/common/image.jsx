import React from 'react'

const Image = ({ name, label, url, error, ...rest }) =>{
    
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <img src={url} alt={name} />
            { error && <div className="alert alert-danger">{error}</div>}
        </div>
    )
}

export default Image;