import React from 'react';
const About = () => {
    const organization = "SheCodes";
    const developers = "Monica and John Ouma";
    const userExperience = "We strive to provide the best user experience.";
    const feedback = "We welcome and value user feedback.";
  
    return (
      <div>
        <About 
          organization={organization} 
          developers={developers} 
          userExperience={userExperience} 
          feedback={feedback}
        />
      </div>
    );
  };
export default About;