import React from 'react';
import image1 from '../Images/image1.jpeg';
const Home = () => {
    return (
      <div>
         <h1 className="absolute top-10 left-10 z-10 text-white text-2xl bg-black bg-opacity-50 p-4">
          Welcome to SanaaYetu Marketplace! 
        </h1>
        <img src={image1} alt='page info home'/>  
      </div>
    );
}


export default Home;