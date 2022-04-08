import React from 'react'
import  Joi from 'joi-browser';
import Form from '../common/form';
import { getMovie, saveMovie } from '../services/movieService';
import { getGenres } from '../services/genreService';
import { getAuthors } from '../services/authorService';
import UploadImages from '../common/uploadImage';


class MovieForm extends Form {

    state = {
        data: {
            title: '',
            updatedCategoryId: [],
            steps: []
        },
        genres: [],
        authors: [],
        errors: {}
    }

    schema = {
        id: Joi.string(),
        title: Joi.string().required().label('Title')
    }

    async populateAuthors(){
        const { data: authors } = await getAuthors();
        this.setState({ authors });
    }

    async populateGenres(){
        const { data: genres } = await getGenres();
        this.setState({ genres });
    }

    async populateMovie(){
        try{
            const movieId = this.props.match.params.id;
            if(movieId === 'new') return;

            const {data: movie} = await getMovie(movieId);
            this.setState({ data: this.mapToViewModel(movie)} );
        }catch(ex){
            if(ex.response && ex.response.status === 404)
                this.props.history.replace('not-found');
        } 
    }

    async componentDidMount() {
        await this.populateAuthors();
        await this.populateGenres();
        await this.populateMovie();
    }

    mapCategory = (category) => {
        let mappedCategory = [];
        for(let cat of category){
            mappedCategory.push({
                value: cat.id,
                label: cat.name
            });
        }
        return mappedCategory;
    }

    mapAuthors = (authors) => {
        let mappedAuthor = [];
        for(let auth of authors){
            mappedAuthor.push({
                value: auth.id,
                label: auth.name
            });
        }
        return mappedAuthor;
    }

    mapAuthor = (author) => {
        return {
            value: author.id,
            label: author.name
        }
    }

    mapToViewModel(movie){
        let model = {
            isActive: movie.isActive,
            isPublic: movie.isPublic,
            id: movie.id,
            title: movie.title,
            description: movie.description,
            cookingTime: movie.cookingTime,
            prepTime: movie.prepTime,
            servings: movie.servings,
            cuisine: movie.cuisine,
            source: movie.source,
            imageURL: movie.imageURL,
            categoryId: this.mapCategory(movie.category),
            authorId: this.mapAuthor(movie.author),
            ingredients: movie.ingredients.join('\n'),
            steps: movie.steps,
            author: movie.author,
            social: movie.social,
        }

        return model
    }

    renderSteps(){
        const { data } = this.state;
        const { steps } = data;
        let stepList = [];
        
        for(let i = 0; i < steps.length; i++){
            const step = steps[i];
            const stepName = step.name === '' ? `step-${i}` : step.name;
            let textToDisplay = '';

            if(stepName in data){
                textToDisplay = data[stepName];
            }else {
                textToDisplay = step.steps.join('\n');
            }
             
            stepList.push(
                this.renderTextArea(`${stepName}`, `Step`, textToDisplay)
            );
        }

        return (
            <React.Fragment>
                {stepList}
            </React.Fragment>
        );
    }

    renderUploadImages = () => {
        const { data } = this.state;
        const { imageURL } = data;
        let cb = (images) => {
            this.state.data.imageURL = images[0];
        }
        return (
            <React.Fragment>
                <UploadImages images={[imageURL]} onHandleChange={cb}/>
            </React.Fragment>
        );
    }

    doSubmit = async () =>{
        const { data, genres } = this.state;

        let ingredients = data.ingredients.split('\n');
        ingredients = ingredients.map(ingredient =>{
          return ingredient.replace(/(\r\n|\n|\r)/gm, "").trim();
        })

        let steps = [];
        for(let i = 0; i < data.steps.length; i++){
            let stepName = `step-${i}`;
            if(stepName in data){
                steps.push({
                    name: '',
                    steps: data[stepName].split('\n')
                })
            }
        }

        if(steps.length === 0){
            steps = data.steps;
        }

        let category = [];
        for(let cat of data.categoryId){
            category.push({
                id: cat.value,
                name: cat.label,
                isActive: true
            });
        }

        let recipe = {
            id: data.id,
            title: data.title,
            description: data.description,
            cookingTime: data.cookingTime,
            prepTime: data.prepTime,
            servings: data.servings,
            cuisine: data.cuisine,
            source: data.source,
            imageURL: data.imageURL,
            category: category,
            ingredients,
            steps,
            author: data.author,
            social: data.social,
            isActive: data.isActive,
            isPublic: data.isPublic,
        }

        await saveMovie(recipe);
        this.props.history.push('/movies');
    }

    render(){
        return (
            <div>
                <h1>Movie Form</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("title", 'Title')}
                    {this.renderUploadImages()}
                    {this.renderCheckbox("isActive", 'Is Active')}
                    {this.renderCheckbox("isPublic", 'Is Public')}
                    {this.renderOptions("authorId", "Author", this.mapAuthors(this.state.authors), false)}
                    {this.renderOptions("categoryId", "Category", this.mapCategory(this.state.genres), true)}
                    {this.renderInput("description", 'Description')}
                    {this.renderTextArea("ingredients", 'Ingredients')}
                    {this.renderSteps()}
                    {this.renderInput("cookingTime", 'Cooking Time')}
                    {this.renderInput("prepTime", 'Prep Time')}
                    {this.renderInput("servings", 'Servings')}
                    {this.renderInput("cuisine", 'Cuisine')}
                    {this.renderInput("source", 'Source')}

                    {this.renderButton("Save")}
                </form>
            </div>
        )
    }
}

export default MovieForm;