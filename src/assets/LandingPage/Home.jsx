import React, { useState, useEffect } from 'react';
import image11 from '../Images/image11.jpg';
import image17 from '../Images/image17.jpg';
import image13 from '../Images/image13.jpg';
import image14 from '../Images/image14.jpg';
import './Slider.css'; 

const Slider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image11, image17, image13, image14];
  const messages = [
   <div className = 'heading'>
    Welcome to SanaaYetu
   </div>, 
    'Discover a treasure trove of unique artisanal products lovingly crafted by talented artisans from around Kenya. Whether you\'re searching for exquisite textiles, finely crafted woodworks, shimmering jewelry, or captivating pottery, our platform brings together a vibrant community of artisans and buyers, celebrating the beauty of handmade creations.',
    'Why Shop with SanaaYetu: At SanaaYetu, we\'re committed to providing you with high-quality artisanal products that tell a story. With each purchase, you\'re not just buying a product; you\'re supporting talented artisans and their communities, preserving traditional craftsmanship, and contributing to sustainable livelihoods.',
    'Contact Us: If you have any questions or inquiries, feel free to reach out to us. You can contact us via email at contact@sanaayetu.com or call us at +123456789.',
    
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [images.length]);

  return (
    <div className="slider-container">
      <div className="slider-card">
        <img className="slider-image" src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
        <div className="message-overlay">
          <h1>{messages[currentImageIndex]}</h1>
        </div>
      </div>
    </div>
  );
};

export default Slider;
