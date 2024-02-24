import React from 'react';
import image1 from '../Images/image1.jpeg';
const Home = () => {
    return (
      <div>
         <h1 className="absolute top-10 left-10 z-10 text-white text-2xl bg-black bg-opacity-50 p-4">
          Sanaa Yetu Marketplace 
        </h1>
        <img src={image1} alt='page info home'/> 
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis accusamus cumque quas aperiam blanditiis! Esse dolores temporibus, cupiditate veniam necessitatibus illum nulla excepturi beatae optio tenetur voluptate, delectus asperiores similique.</p>
      </div>
    );
}


export default Home;