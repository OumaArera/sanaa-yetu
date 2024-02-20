import React from 'react';
import image1 from '../Images/image1.jpeg';
import image2 from '../Images/image2.jpg'
import image3 from '../Images/image3.jpg'
import image4 from '../Images/image4.jpg'
import image5 from '../Images/image5.jpg'

import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <h1 className="title">
         SanaaYetu Marketplace!
      </h1>
      <img className="image" src={image1} alt="page info home" />
      <img className="image" src={image2} alt="page info home" />
      <img className="image" src={image3} alt="page info home" />
      <img className="image" src={image4} alt="page info home" />
      <div className="card custom-style">
        <img className="image" src={image5} alt="page info home" />
        <div className="card-info">
          <p>SanaaYetu Marketplace is a platform empowering artisans to showcase and sell their crafts while connecting them with buyers through an intuitive interface.</p>
        </div>
      </div>
       
    </div>
  );
}

export default Home;