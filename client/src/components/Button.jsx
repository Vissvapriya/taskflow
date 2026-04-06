// button component with rounded border 
// scale animation on hover
import React from 'react';

const Button = ({ children, onClick }) => { 
    return (
        <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105" onClick={onClick}>
            {children}
        </button>
    );  
};

export default Button;  


