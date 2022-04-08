import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import Image from './image';
import Select from './select';
import TextArea from './textArea';
import Option from './option';
import { default as ReactSelect } from "react-select";

export default class Form extends Component {
    
    
    validateProperty = ({name, value}) =>{

        const obj = { [name]: value};
        const schema = { [name]: this.schema[name] };
        const { error } = Joi.validate(obj, schema);
        
        return error ? error.details[0].message : null;
    }    
    
    validate = () =>{
        // const opts = { abortEarly: false };
        // const { error } = Joi.validate(this.state.data, this.schema, opts);

        // if(!error) return null;

        // const errors = {};
        // for(let item of error.details)
            // errors[item.path[0]] = item.message;
        // return errors;
    }

    handleChange = ({currentTarget: input}) =>{
        // const errors = {...this.state.errors};
        // const errorMessage = this.validateProperty(input);
        // if(errorMessage) errors[input.name] = errorMessage;
        // else delete errors[input.name];

        const data = { ...this.state.data};
        data[input.name] = input.value;
        this.setState({ data, errors: [] });
    }

    handleCheckboxChange = ({currentTarget: input}) =>{
        const data = { ...this.state.data};
        data[input.name] = !data[input.name];
        this.setState({ data });
    }

    handleOptionChange = (name, selected) =>{
        const data = { ...this.state.data};
        data[name] = selected;
        this.setState({ data });
    }

    handleSubmit = e => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        // if(errors) return;

        this.doSubmit();
    }

    renderButton(label){
        return (
            <button 
            disabled={false}
            className="btn btn-primary">
                {label}
            </button>
        )
    }

    renderCheckbox(name, label) {

        const { data, errors } = this.state;

        return(
            <Input
                name={name}
                value={data[name]}
                label={label}
                type={'checkbox'}
                error={errors[name]}
                onChange={this.handleCheckboxChange}
                defaultChecked={data[name]}
            />
        )     
    }

    renderInput(name, label, type = 'text') {

        const { data, errors } = this.state;

        return(
            <Input
                name={name}
                value={data[name]}
                label={label}
                type={type}
                error={errors[name]}
                onChange={this.handleChange}
            />
        )
    }

    renderSelect(name, label, options){

        const { data, errors } = this.state;

        return (
            <Select 
                name={name}
                value={data[name]}
                label={label}
                options={options}
                onChange={this.handleChange}
                error={errors[name]}    
                multiple        
            />
        )
    }

    renderImage(name, label) {

        const { data, errors } = this.state;

        return (
           <Image
                name={name}
                url={data[name]}
           />
        )
    }

    renderTextArea(name, label, overrideValue = null) {
        const { data, errors } = this.state;
        const valueToUse = overrideValue ? overrideValue : data[name];

        return (
            <TextArea
                key={name}
                name={name}
                value={valueToUse}
                label={label}
                onChange={this.handleChange}
                error={errors[name]}
            />
        )
    }

    renderOptions(name, label, options, isMulti){
        const { data, errors } = this.state;
        return (
            <ReactSelect
                options={options}
                isMulti={isMulti}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option
                }}
                onChange={(selected) => this.handleOptionChange(name, selected)}
                allowSelectAll={true}
                value={data[name]}
            />
        )
    }
}
