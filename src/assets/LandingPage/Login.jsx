import React, { useState, useEffect } from "react";

import "./Login.css";
import DisplayDetails from "../Buyer/DisplayDetails";
import Cart from "../Buyer/Cart";
import Orders from "../Buyer/Orders";

import closedEyeIcon from "../Images/closed.svg";
import openEyeIcon from "../Images/open.svg";
import cart from "../Images/cart.svg";
import orders from "../Images/bag.svg"


const url = "http://localhost:3000/users";

const Login = () =>{


    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState([]);
    const [loginError, setLoginError] = useState("");
    const [userType, setUserType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [control, setControl] = useState(1)
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    // const userId = loggedInUser.id;

    const fetchData = async () =>{
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            }else{
                setError("There was an error fetching the data");
                setLoginError("");
            }
        }catch(err){
            console.log(err)
            setError("There was an error fetching the data");
            setLoginError("");
        }
    };


    useEffect(() => {
        const loggedInUser = localStorage.getItem("loggedInUser");
        const userType = localStorage.getItem("userType");
        if (loggedInUser && userType) {
            setIsLoggedIn(true);
            setUserType(userType);
            setLoggedInUser(JSON.parse(loggedInUser)); 
            // Reset the logout timer upon initial login
            resetLogoutTimer();
        }
        fetchData(); 
    }, []);

    useEffect(() =>{
        fetchData()
    }, [])


    /*
    - Enable user to enter their username and password
    - Targets the entered data and stores it for login
    */ 
    const handleChange = event =>{
        const {name, value} = event.target;
        setFormData(prevData =>({
            ...prevData,
            [name]: value,
        }))
    }


    // Confirms user credentials 
    const confirmCredentials = () =>{

        // Check if there is data in the users state
        if (users.length === 0) {
            setError("Network error! Please wait as we this is being resolved");
            setLoginError("");
            return;
        }

        // Checks that user has entered the input fields
        if (!formData.username || !formData.password) {
            setLoginError("Please fill all the fields");
            return;
        }


        /*
        - Confirms that user exists in the database
        - If user exists, checks the password and logs them in if password is correct
        - If user password is incorrect, user is informed
        -If user doesn't exist, user is informed to signup
        */ 
        const isUsernameExists = users.some(user => user.username === formData.username);
        if (isUsernameExists) {
            const user = users.find(
                user => 
                    user.username === formData.username && 
                    user.password === formData.password);
            if (user){
                setIsLoggedIn(true);
                setLoggedInUser(user);
                localStorage.setItem("userType", user.type);
                localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store user object as string
                setUserType(user.type);
                // Reset the logout timer upon successful login
                resetLogoutTimer();
            } else {
                setLoginError("Invalid password");
            }
        } else {
            setLoginError("This email is not registered, please signup.");
        }
    }


    // Logs user out
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userType");
        clearTimeout(logoutTimer);
        setLoginError(null)
        setLoggedInUser('')
        setFormData({
            username: "",
            password: ""
        })
    };


    // Variable to store the logout timer
    let logoutTimer;


    const resetLogoutTimer = () => {
        clearTimeout(logoutTimer);
        // Set the logout timer to log out the user after 2 minutes of inactivity
        logoutTimer = setTimeout(() => {
            handleLogout();
        }, 120000); 
    };


    /*
    - Keeps user logged in even when browser is refreshed. 
    */ 
    useEffect(() =>{
        const loggedInUser = localStorage.getItem("loggedInUser");
        const userLoggedIn = loggedInUser !== null;
        if(userLoggedIn){
            setIsLoggedIn(true);
            setUserType(localStorage.getItem("userType"));
            // Reset the logout timer upon initial login
            resetLogoutTimer();
        }
        fetchData();
    }, []);


    // Event listeners for user actions to reset the logout timer
    useEffect(() => {
        const resetTimer = () => {
            resetLogoutTimer();
        };
        // Add event listeners for various user actions
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("mousedown", resetTimer);
        window.addEventListener("keypress", resetTimer);
        window.addEventListener("touchmove", resetTimer);
        return () => {
            // Remove event listeners when the component unmounts
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("mousedown", resetTimer);
            window.removeEventListener("keypress", resetTimer);
            window.removeEventListener("touchmove", resetTimer);
        };
    }, []);


    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };


    const handleShowCart = () => {
        setControl(1)
        setShowCart(prevShowCart => !prevShowCart); 
    };

    const handleShowOrders = () =>{
        setControl(2)
        setShowOrders(prevOrders => !prevOrders);
    }


    return (
        <div>
            {
            !isLoggedIn ?
            (
                <div id="login">
                    <h2 id="signin-title">Sign in</h2>
                    <br />
                    <input 
                        className="login"
                        name="username" 
                        value={formData.username} 
                        type="text" 
                        placeholder="Enter Username"
                        onChange={handleChange}
                    />

                    <br />
                    <div className="password-input">
                        <input
                            className="login"
                            name="password"
                            value={formData.password}
                            type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                            placeholder="Enter password"
                            onChange={handleChange}
                        />
                        <button className="toggle-password" onClick={togglePasswordVisibility}>
                            <img 
                            className="show-image"
                            src={showPassword ? openEyeIcon : closedEyeIcon} 
                            alt={showPassword ? "Hide" : "Show"} />
                        </button>
                    </div>
                    {setLoginError && <p className="error" >{loginError}</p>}
                    {setError && <p className="error" >{error}</p>}
                    <button 
                        onClick={confirmCredentials} 
                        className="login-button"
                    >
                        Continue
                    </button>
                </div>
            ): (
                <div id="after-login">
                    {isLoggedIn && (
                        <div id="after-login">
                            {userType === "admin" && (
                                <>
                                    <p className="my-view">Welcome, {loggedInUser.firstName} {loggedInUser.lastName}!</p>
                                    <button 
                                        onClick={handleLogout} 
                                        className="logout-button"
                                    >
                                        Sign out
                                    </button>
                                    <DisplayDetails 
                                        user={loggedInUser}
                                    />
                                </>
                            )}
                            {userType === "buyer" && (
                                <>
                                    <p className="my-view">Welcome, {loggedInUser.firstName} {loggedInUser.lastName}!</p>
                                    <button 
                                        onClick={handleLogout} 
                                        className="logout-button"
                                    >
                                        Sign out
                                    </button>
                                    <DisplayDetails 
                                        user={loggedInUser} 
                                    />
                                    <button className="show-cart" onClick={handleShowCart}>
                                        <img className="cart-image" src={cart} alt="Show Cart" />
                                     </button>
                                    {showCart && control === 1 && (
                                        <div className="cart">
                                            <Cart loggedInUser={loggedInUser} />
                                        </div>
                                    )}
                                    <button className="show-orders" onClick={handleShowOrders}>
                                        <img className="cart-image" src={orders} alt="Order" />
                                     </button>
                                    {showOrders && control === 2 && (
                                        <div className="orders">
                                            <Orders loggedInUser={loggedInUser} />
                                        </div>
                                    )}
                                </>
                            )}
                            {userType === "seller" && (
                                <>
                                    <p className="my-view">Welcome, {loggedInUser.firstName} {loggedInUser.lastName}!</p>
                                    <button 
                                        onClick={handleLogout} 
                                        className="logout-button"
                                    >
                                        Sign out
                                    </button>
                                    <DisplayDetails
                                        user={loggedInUser} 
                                    />

                                     <button className="show-cart" onClick={handleShowCart}>
                                        <img className="cart-image" src={cart} alt="Show Cart" />
                                     </button>
                                    {showCart && control === 1 && (
                                        <div className="cart">
                                            <Cart loggedInUser={loggedInUser} />
                                        </div>
                                    )}

                                    <button className="show-orders" onClick={handleShowOrders}>
                                        <img className="cart-image" src={orders} alt="Order" />
                                     </button>
                                    {showOrders && control === 2 && (
                                        <div className="orders">
                                            <Orders loggedInUser={loggedInUser} />
                                        </div>
                                    )}
                                </>
                            )}
                            
                        </div>
                    )}
                </div>
            )
            }
        </div>
    )

}

export default Login;


