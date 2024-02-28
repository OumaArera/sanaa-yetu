import React from 'react';
import './About.css'; // Import CSS file for styling

const About = () => {

    return (
        <div className="about-card">
            <h2>About Us</h2>
            <div className="section developers">
                <h3>Developers</h3>
                <p>Meet our talented team of developers who are passionate about creating innovative solutions:</p>
                <ul>
                    <li>John Doe - Full Stack Developer</li>
                    <li>Jane Smith - UI/UX Designer</li>
                    <li>David Johnson - Backend Developer</li>
                </ul>
            </div>
            <div className="section organization">
                <h3>Organization</h3>
                <p>Learn more about our organization and our mission:</p>
                <p>We are dedicated to providing high-quality products and services that enhance the user experience.</p>
            </div>
            <div className="section user-experience">
                <h3>User Experience</h3>
                <p>We prioritize user experience and strive to create intuitive and user-friendly interfaces:</p>
                <p>Our goal is to ensure that every interaction with our products is seamless and enjoyable for our users.</p>
            </div>
            <div className="section feedback">
                <h3>Feedback</h3>
                <p>We value feedback from our users as it helps us improve and grow:</p>
                <p>If you have any suggestions or comments, please feel free to reach out to us!</p>
            </div>
        </div>


    );
}

export default About;
