import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton'
import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        error: false,
        loading: false
    }
    marvelService = new MarvelService();
    
    componentDidMount() {
        this.updateChar();
    }
    componentDidUpdate(prevProps) {
        if(this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }
    
    updateChar = () => {
        const {charId} = this.props;
        if(!charId) {
            return;
        }
       
        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }
    onCharLoaded = (char) => {
        this.setState({char, loading: false})
    }
    onCharLoading = () => {
        this.setState({loading:true})
    }
    onError = () => {
        this.setState({loading: false, error: true})
    }
    render() {
        const {char, loading, error} = this.state;
        const skeleton = !(loading || error || char) ? <Skeleton/> : null;
        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> :null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;
        return (
            <div className="char__info">
              {errorMessage}
              {spinner}
              {skeleton}
              {content}
            </div>
        )
   }
}
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let objectFit = '';
    const notFoundImgName = 'image_not_available';
        if(thumbnail.indexOf(notFoundImgName) > -1) {
            objectFit = 'contain';
        } else {
            objectFit = 'cover';
        }
    return (
        <>
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={{objectFit: objectFit}}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics with this character'}
                    {comics.map((item, i) => {
                        
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li> 
                        )
                    }).slice(0, 9)}
                    
                </ul>
        </>
    )
}
CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;