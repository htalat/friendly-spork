import React from 'react'

const TextArea = ({ name, value, label, error, ...rest }) =>{
    
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea 
                {...rest}
                name={name}
                id={name}
                className="form-control"
                rows={5}
                col={50}
                value={value}
            />
            { error && <div className="alert alert-danger">{error}</div>}
        </div>
    )
}

export default TextArea;