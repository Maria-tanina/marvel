import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        error: false,
        loading: true
    }
    marvelService = new MarvelService();
    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    }
    
    onError = () => {
        this.setState({error: true, loading: false})
    }
    renderItems = (arr) => {
        let objectFit = '';
        const notFoundImgName = 'image_not_available';
       
       const items = arr.map(item => {
            if(item.thumbnail.indexOf(notFoundImgName) > -1) {
                objectFit = 'contain';
            } else {
                objectFit = 'cover';
            }
            return(
                <li 
                className="char__item"
                key={item.id}
                onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt="abyss" style={{objectFit: objectFit}}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    render() {
        const {error, loading, charList} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                    {spinner}
                    {content}
                    {errorMessage}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;