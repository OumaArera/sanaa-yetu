import React from 'react';
const About = () => {
    const organization = "Sanaa Yetu";
    const developers = "Monica and John Ouma";
    const userExperience = "We strive to provide the best user experience.";
    const feedback = "We welcome and value user feedback.";
  
    return (
      <div>
          <h1>{organization}</h1>
          <h3>{developers}</h3>
          <h3>{userExperience}</h3>
          <p>{feedback}</p>

      </div>
    );
  };
export default About;