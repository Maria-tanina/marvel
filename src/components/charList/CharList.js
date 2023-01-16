import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        error: false,
        loading: true,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }
   
    marvelService = new MarvelService();
    componentDidMount() {
        this.onRequest();
    }
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }
    onCharListLoading = () => {
        this.setState({newItemLoading: true})
    }
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }
    onError = () => {
        this.setState({error: true, loading: false})
    }
    itemRefs = [];
    setRefs = (elem) => {
        this.itemRefs.push(elem);
    }
    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    renderItems = (arr) => {
        let objectFit = '';
        const notFoundImgName = 'image_not_available';
       
       const items = arr.map((item, i) => {
            if(item.thumbnail.indexOf(notFoundImgName) > -1) {
                objectFit = 'contain';
            } else {
                objectFit = 'cover';
            }
            return(
                <li 
                tabIndex={0}
                ref={this.setRef}
                className="char__item"
                key={item.id}
                onClick={() => 
                    {this.props.onCharSelected(item.id);
                    this.focusOnItem(i)}
                }
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }
                }}>
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
        const {error, loading, charList, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                    {spinner}
                    {content}
                    {errorMessage}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => this.onRequest(offset)}
                style={{'display': charEnded ? 'none' : 'block' }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;
