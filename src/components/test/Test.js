import React from "react";

const Test = (props) => {
    return (
        <div>
            {

                React.Children.map(props.children, child => {
                    return React.cloneElement(child, {className: 'elem'})
                })
            }
        </div>
    )
}

export default Test;