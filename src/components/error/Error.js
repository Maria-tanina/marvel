import img from './error.gif'

const Error = () => {
    return(
        <img src={img} alt="error" style={{display:'block', margin: '0 auto', width: '250px', height: '250px', objectFit: 'contain' }} />
    )
}

export default Error;