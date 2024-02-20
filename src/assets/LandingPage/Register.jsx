import React, { useState, useEffect } from "react";

import "./Register.css"

import closedEyeIcon from "../Images/closed.svg";
import openEyeIcon from "../Images/open.svg";

const url = "http://localhost:3000/users";

const Register = () =>{

    const [showSecondForm, setShowSecondForm] = useState(false);
    const [signupError, setSignupError] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        type: ""
    })

    const isValidEmail = email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data from the server.");
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch user data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setNewUser(prevData => ({
            ...prevData,
            [name]: value,
        }));
        
    };

    const handleSelectChange = event =>{
        const {name, value} = event.target;
        setNewUser(prevData =>({
            ... prevData,
            [name]: value,
        }))
    }

    const handleContinue = () => {
        // Check if first name, last name, and type are filled
        if (newUser.firstName && newUser.lastName && newUser.type) {
            setShowSecondForm(true);
        } else {
            setSignupError("Please fill all the fields!")
        }
    };

    const isStrongPassword = (password, firstName, lastName, username) => {
        if (
            password.includes(firstName) ||
            password.includes(lastName) ||
            password.includes(username)
        ) {
            return "Password cannot contain your name or username.";
        }

        const containsCapitalLetter = /[A-Z]/.test(password);
        const containsSmallLetter = /[a-z]/.test(password);
        const containsNumber = /\d/.test(password);
        const containsSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasMinimumLength = password.length >= 6;

        if (
            containsCapitalLetter &&
            containsSmallLetter &&
            containsNumber &&
            containsSpecialCharacter &&
            hasMinimumLength
        ) {
            return "";
        } else {
            return "Please set a complex password";
        }
    };
    

    const handleSignup = async event =>{

        event.preventDefault();

        if (!newUser.username || !newUser.password || !confirmPassword){
            setError("Please fill all fields!");
            return;
        } 

        if (!isValidEmail(newUser.username)) {
            setError("Please enter a valid email address");
            return;
          }


        if (newUser.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const existingUser = users.find(user => user.username === newUser.username);
        if (existingUser) {
            setError("This email is already in use. Please sign in.");
            return;
        }

        if (newUser.password.includes(newUser.firstName) || newUser.password.includes(newUser.lastName)) {
            setError("Password cannot contain your name or username.");
            return;
        }

        const strongPasswordError = isStrongPassword(newUser.password, newUser.firstName, newUser.lastName, newUser.username);
        if (strongPasswordError) {
            setError(strongPasswordError);
            return;
        }

        try {
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(newUser)
            })
            if (response.ok){
                // alert("Signup successful!")
                setSignupSuccess(true);
                const data = await response.json();
                localStorage.setItem("newUser", JSON.stringify(data));
                setNewUser({
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    type: ""
                })
            }else{
                setError("There was an error signing up!");
            }
            
        }catch(err){
            console.log(err);
            setError("Network error, please try again later.");
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevShowConfirmPassword => !prevShowConfirmPassword);
    };

    if (signupSuccess) {
        return (
            <p id="success">Signup successful...</p>
        );
    }


    return (
        <div className="first-details">
            <h2 id="create-account">Create account</h2>
            <br />
            {!showSecondForm && (
                <div id="first-details">
                    <select onChange={handleSelectChange} name="type" id="user-type">
                        <option value="">Select user type</option>
                        <option value="seller">Seller</option>
                        <option value="buyer">Buyer</option>
                    </select>
                    <br />
                    <input
                        className="name"
                        type="text"
                        name="firstName"
                        placeholder="First name e.g John"
                        value={newUser.firstName}
                        onChange={handleChange}
                    />
                    <br />
                    <input
                        className="name"
                        type="text"
                        name="lastName"
                        placeholder="Last name e.g Doe"
                        value={newUser.lastName}
                        onChange={handleChange}
                    />
                    <br />
                    {signupError && <p className="signup-error">{signupError}</p>}
                    <button id="next" type="button" onClick={handleContinue}>Next</button>
                </div>
            )}
            {
                showSecondForm && (
                    <div id="second-form">
                        <br />
                        <input
                            className="userName"
                            name="username"
                            type="text"
                            placeholder="example@email.com"
                            value={newUser.username}
                            onChange={handleChange}
                        />
                        <br />
                        <input
                            className="userName"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={newUser.password}
                            onChange={handleChange}
                        />
                        <button className="toggle-password" onClick={togglePasswordVisibility}>
                            <img src={showPassword ? openEyeIcon : closedEyeIcon} alt={showPassword ? "Hide" : "Show"} />
                        </button>
                        <br />
                            <br />
                            <input
                                className="userName"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <button className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                                <img src={showConfirmPassword ? openEyeIcon : closedEyeIcon} alt={showPassword ? "Hide" : "Show"} />
                            </button>
                        <br />
                        {error && <p className="signup-error">{error}</p>}
                        <button id="signup" onClick={handleSignup} type="submit">Signup</button>
                    </div>
                )
            }
        </div>
    );
}

export default Register;

