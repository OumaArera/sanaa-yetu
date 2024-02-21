import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import send from "../Images/send.svg";

const sellerUrl = "http://localhost:3000/merchandise"
const userUrl = "http://localhost:3000/users"

const Cart = ({ loggedInUser }) => {
    const [itemsInCart, setItemsInCart] = useState([]);
    const [error, setError] = useState("");
    const [sellers, setSellers] = useState([]);
    const [sellerError, setSellerError] = useState("");
    const [textMessages, setTextMessages] = useState({});
    const [users, setUsers] = useState([])


    useEffect(() => {
        const fetchItemsInCart = async () => {
            try {
                const response = await fetch(`${userUrl}/${loggedInUser.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setItemsInCart(data.incart);
                    // Initialize text messages for each item
                    const initialMessages = {};
                    data.incart.forEach(item => {
                        initialMessages[item.id] = { text: "" };
                    });
                    setTextMessages(initialMessages);
                } else {
                    setError("There was a network error in getting your items!");
                }
            } catch (err) {
                console.error(err);
                setError("There was an error getting your items!");
            }
        };
        fetchItemsInCart();

        const fetchSellers = async () => {
            try {
                const response = await fetch(sellerUrl);
                if (response.ok) {
                    const data = await response.json();
                    setSellers(data);
                } else {
                    setSellerError("There was a network error in getting sellers data!");
                }
            } catch (err) {
                console.error(err);
                setSellerError("There was an error sellers data!");
            }
        };
        fetchSellers();

        const fetchUsers = async () =>{
            try{
                const response = await fetch(userUrl)
                if (response.ok){
                    const data = await response.json()
                    setUsers(data)
                }else{
                    setError("There was a problem fetching data!")
                }
                

            }catch(err){
                console.log(err)
                setError("Failed to fetch data!")
            }
        }
        fetchUsers()
    }, [loggedInUser.id]);

    const handleChange = (event, itemId) => {
        const { value } = event.target;
        setTextMessages(prevTextMessages => ({
            ...prevTextMessages,
            [itemId]: { text: value }
        }));
    };

    const handleSendMessage = async item => {
        try {
            // Find the specific seller
            const seller = sellers.find(seller => seller.username === item.seller);
            if (!seller) {
                setSellerError("Seller not found");
                return;
            }
    
            // Find the specific user sending the message
            const specificUser = Array.isArray(users) && users.find(user => user.username === item.seller);
            console.log(specificUser.messages)
            if (!specificUser) {
                setError("User not found");
                return;
            }

            // Check if the message is empty
            if (!textMessages[item.id].text.trim()) {
                setError("Please add a message to send!");
                return;
            }
    
            // Construct the message object
            const message = {
                id: uuidv4(),
                sender: loggedInUser.username,
                text: textMessages[item.id].text, 
                timeStamp: new Date().toISOString() 
            };
    
            // Update the messages array for the specific user
            const updatedUser = {
                ...specificUser,
                messages: [...specificUser.messages, message]
            };
    
            // Patch the updated user data to the server
            const response = await fetch(`${userUrl}/${specificUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(updatedUser)
            });
    
            if (response.ok) {
                const saveSentMessage = await fetch(`${userUrl}/${loggedInUser.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(updatedUser)
                })
                if(saveSentMessage.ok){
                    alert("Message saved!")
                }
            } else {
                setSellerError("Failed to send message. Please try again later.");
            }
        } catch (err) {
            console.error(err);
            setSellerError("Failed to send message. Please try again later.");
        }
    };
    
    

    return (
        <div>
            {itemsInCart && itemsInCart.map(item => (
                <div className="items-in-cart" key={item.id}>
                    {/* Render item details */}
                    <img className="images" src={item.images[0]} alt={item.name} />
                    <p>{item.name}</p>
                    <p>Price: {item.price}</p>
                    <p>{item.shopName}, {item.location}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Color: {item.color}</p>
                    <p>Size: {item.size}</p>
                    <p>Weight: {item.weight}</p>
                    <p>Shipping cost within Nairobi: {item.transport}</p>
                    <p>Delivery time: {item.deliverytime}</p>
                    <p>Class: {item.class}</p>
                    <p>Category: {item.category}</p>
                    {/* Render messages for the item */}
                    <div className="messages">
                        {item.messages.map((message, index) => (
                            <div className="my-messages" key={index}>
                                {message.sender}: {message.text} - {message.timeStamp}
                            </div>
                        ))}
                        {/* Input for sending message */}
                        <div className="send-message-card">
                            <input
                                className="send-message"
                                type="text"
                                name="text"
                                placeholder="Message"
                                value={textMessages[item.id].text}
                                onChange={event => handleChange(event, item.id)}
                            />
                            <div className="send-button">
                                {error && <div className="error">{error}</div>}
                                {sellerError && <div className="error">{sellerError}</div>}
                                <button onClick={() => handleSendMessage(item)}>
                                    <img src={send} alt="Send" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
           
        </div>
    );
};

export default Cart;


