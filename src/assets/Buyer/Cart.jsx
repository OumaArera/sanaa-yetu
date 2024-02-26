import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import send from "../Images/send.svg";
import deleteIcon from "../Images/delete.svg";
import "./Cart.css"


const sellerUrl = "http://localhost:3000/merchandise";
const userUrl = "http://localhost:3000/users";
const salesUrl = "http://localhost:3000/sales"


const Cart = ({ loggedInUser }) => {
    const [itemsInCart, setItemsInCart] = useState([]);
    const [error, setError] = useState("");
    const [sellers, setSellers] = useState([]);
    const [sellerError, setSellerError] = useState("");
    const [textMessages, setTextMessages] = useState({});
    const [users, setUsers] = useState([]);
    const [userToMapMessages, setUserToMapMessages] = useState([])
    const [paymentMethod, setPaymentMethod] = useState("")
    const [processingTransaction, setProcessingTransaction] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState({});
    const [enterPhoneNumber, setEnterPhoneNumber] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [transactionError, setTransactionError] = useState("");
    const [buyItem, setBuyItem] = useState(false);
    const [itemToBuy, setItemToBuy] = useState({});
    const [confirm, setConfirm] = useState(false);
    const [location, setLocation] = useState(null)


    useEffect(() =>{

    
        const fetchItemsInCart = async () => {
            try {
                const response = await fetch(`${userUrl}/${loggedInUser.id}`);
                if (response.ok) {
                    const data = await response.json();

                    setItemsInCart(data.incart);
                    setUserToMapMessages(data.messages)
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
    }, [])

    useEffect(() => {
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
            try {
                const response = await fetch(userUrl);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    setError("There was a problem fetching data!");
                }
            } catch (err) {
                console.log(err);
                setError("Failed to fetch data!");
            }
        };
        fetchUsers();
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
            if (!specificUser) {
                setError("User not found");
                return;
            }

            const userLoggedIn = Array.isArray(users) && users.find(user => user.username === loggedInUser.username)
            if (!userLoggedIn){
                setError("Buyer not found!")
                return;
            }

            // Check if the message is empty
            if (!textMessages[item.id].text.trim()) {
                setError("Please add a message to send!");
                return;
            }
    
            // Construct the message object
            const message = {
                id: item.id,
                sender: loggedInUser.username,
                text: textMessages[item.id].text, 
                timeStamp: new Date().toISOString() 
            };
    
            // Update the messages array for the specific user
            const updatedUser = {
                ...specificUser,
                messages: [...specificUser.messages, message]
            };
    
            // Message user is sending self!
            const savedMessage = {
                ...userLoggedIn,
                messages: [...userLoggedIn.messages, message]
            }
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
                    body: JSON.stringify(savedMessage)
                });
                if(saveSentMessage.ok){
                    setTextMessages("")
                }
            } else {
                setSellerError("Failed to send message. Please try again later.");
            }
        } catch (err) {
            console.error(err);
            setSellerError("Failed to send message. Please try again later.");
        }
    };

    const handeShowDetails = itemId => {
        setItemsInCart(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, seeDetails: !item.seeDetails } : item
            )
        );
    };

//_________________________________________________________________________________________________________ 

    const generateOrderNumber = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let orderNumber = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            orderNumber += characters.charAt(randomIndex);
        }
        return orderNumber;
    }
    const orderNumber = generateOrderNumber();


    const handlePaymentChange = event =>{
        const {name, value} = event.target;
        setPaymentMethod(prevData =>({
            ...prevData,
            [name]: value,
        }))
        setEnterPhoneNumber(true)
    }


    const handleBuyItem = () =>{
        // const orderNumberGenerator = "XYRDE";
        
        setBuyItem(true);
    }

    const handlePhoneNummber = event =>{
        const {name, value} = event.target;
        setPhoneNumber(prevValue =>({
            ...prevValue,
            [name]: value,
        }))
    }

    const processTransaction = item =>{
        getLocation();
        const timeStamp = new Date().toString();
        // Calculate the amount to pay
        let amountToPay = parseInt(item.price)+ parseInt(item.transport);

        const detailsToSave = {

            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            phone: phoneNumber.phone,
            buyer: loggedInUser.username,
            buyerLocation: location,
            seller: item.seller,
            image: item.images[0], 
            price: item.price,
            color: item.color,
            weight: item.weight,
            shopName: item.shopName,
            size: item.size,
            class: item.class,
            category: item.category,
            deliverytime: item.deliverytime,
            name: item.name,
            transport: item.transport,
            quantity: item.quantity,
            quantityBought: 1,
            payment: paymentMethod.payment,
            total: amountToPay,
            orderNumber: orderNumber,
            date: timeStamp,
            itemId: item.id,
            id: uuidv4()
        };
        setItemToBuy(detailsToSave)
        setConfirm(true)
        // const confirmation = confirm("Do you want to proceed with transaction?")
        // if (confirmation){
            
        // }
        
    }

    const confirmPayment = ()  =>{

        const updateSeller = Array.isArray(users) && users.find(user => user.username === itemToBuy.seller);

        const updateTransaction = {

            ...updateSeller,
            sales: [...updateSeller.sales, itemToBuy]
        }
        
        const pastOrders = {
            ...loggedInUser,
            pastorders: [...loggedInUser.pastorders, itemToBuy],
        }

        // const quantityToUpdate = parseInt(processingTransaction.quantity) - 1;
        const updatedItemQuantity = parseInt(itemToBuy.quantity) - 1;
        const number = phoneNumber.phone

        if (number.length >= 10){

            const updateQuantity = async ()=>{
                try{
                    const quantityToUpdate = await fetch(`${sellerUrl}/${itemToBuy.itemId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: JSON.stringify({quantity: updatedItemQuantity})
                    })
                    if (quantityToUpdate.ok){
                        alert("Quantity updaed!")
                        const updateTransactionToSeller = await fetch(`${userUrl}/${updateSeller.id}`,{
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                            body: JSON.stringify(updateTransaction)
                        })
                        if (updateTransactionToSeller.ok){
                            alert("That was quick!")
                        }else{
                            // alert("Ouch!")
                        }

                        const postTransaction = await fetch(salesUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify(itemToBuy)
                        })
                        if (postTransaction.ok){
                            alert("Sales updated!")
                            
                        }else{
                            // alert("Back at it!")
                        }
                        const updateItemInPastOrders = await fetch(`${userUrl}/${loggedInUser.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                            body: JSON.stringify(pastOrders)
                        })
                        if (updateItemInPastOrders.ok){
                            // handleDeleteItem(item)
                            setProcessingTransaction(2)
                            alert("You're crazy!")
                            
                            
                        }else{
                            // alert("Kidogo tu!")
                        }

                    }

                    // alert("Ouch!")
                }catch(err){
                    // alert("Ouch! Ouch!")
                    console.log(err)
                    setTransactionError("There was an error posting the transaction")
                }
            }
            updateQuantity()

            // const confirmation = confirm("Proceed with payment?")

        }else{
            alert("No phone number")
            setPhoneNumberError("Please enter a valid phone number")
        }
        
 
    }

    

    const handleDeleteItem = async item =>{
        // alert(`Can delete by the way! ${item.name}`)
        try{
            
            const updatedUser = { ...loggedInUser };
            updatedUser.incart = updatedUser.incart.filter(cartItem => cartItem.id !== item.id);
            const removeItemFromCart = await fetch(`${userUrl}/${loggedInUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(updatedUser)
            })
            if (removeItemFromCart.ok){
                setItemsInCart(prevItems => prevItems.filter(cartItem => cartItem.id !== item.id));
            }

        }catch(err){
            console.log(err)
            // alert("Aje sasa?")
        }

    }

    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
            },
            error => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
    };
    
    
//___________________________________________________________________________________________________________ 

    return (
        <div>
            {processingTransaction === 1 && itemsInCart && itemsInCart.map(item => (
                <div className="items-in-cart" key={item.id}>
                    {/* Render item details */}
                    <img className="images" src={item.images[0]} alt={item.name} />
                    <br />
                    <button 
                        className="see-more" 
                        onClick={() => handeShowDetails(item.id)}
                    >
                        {item.seeDetails === false ? "Show more" : "Show less"}
                    </button>
                    {item.seeDetails && (
                        <div>
                            <p className="details">Name: {item.name}</p>
                            <p className="details">Price: {item.price}</p>
                            <p className="details"> Shop Name{item.shopName}, located at {item.location}</p>
                            <p className="details">Quantity: {item.quantity}</p>
                            <p className="details">Color: {item.color}</p>
                            <p className="details">Size: {item.size}</p>
                            <p className="details">Weight: {item.weight}</p>
                            <p className="details">Shipping cost within Nairobi: {item.transport}</p>
                            <p className="details">Delivery time: {item.deliverytime}</p>
                            <p className="details">Class: {item.class}</p>
                            <p className="details">Category: {item.category}</p>
                            {/* Render messages for the item */}
                            <div className="messages">
                                {userToMapMessages.map((message, index) => (
                                message.id === item.id && // Check if message ID matches item ID
                                <div className="message-card" key={index}>
                                    <div id="username" className="sender">{message.sender}</div>
                                    <div className="sender">{message.text}</div>
                                    {/* <div className="sender">{message.timeStamp}</div> */}
                                </div>
                        ))}
                                {/* Input for sending message */}
                                <div className="send-message-card">
                                    <textarea
                                        className="send-message"
                                        type="message"
                                        name="text"
                                        placeholder="Message"
                                        value={textMessages[item.id].text}
                                        onChange={event => handleChange(event, item.id)}
                                    />
                                    <div className="send-button">
                                        {error && <div className="error">{error}</div>}
                                        {sellerError && <div className="error">{sellerError}</div>}
                                        <button className="send-btn" onClick={() => handleSendMessage(item)}>
                                            <img src={send} alt="Send" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="action">
                        <button 
                            className="buy-item" 
                            onClick={() =>handleBuyItem(item)}
                        >
                            Buy
                        </button>
                        <button 
                            className="delete-item" 
                            onClick={() =>handleDeleteItem(item)}>
                            <img className="delete-item-btn" src={deleteIcon} alt="Delete" />
                        </button>
                    </div>

                    {buyItem &&(
                        <div className="part-two-transaction">
                        <p className="details">Order #{itemToBuy.orderNumber}</p>
                        <p className="details">Total: KES {itemToBuy.total}</p>
                        <p id="payment">Please select your payment method</p>
                            <br />
                            <input 
                                type="radio" 
                                className="payment-method"
                                name="payment"
                                value="Mpesa"
                                onChange={handlePaymentChange}
                            />
                            Mpesa
                            <br />
                            <br />
                            <input 
                                type="radio" 
                                className="payment-method"
                                name="payment"
                                value="Airtel Money"
                                onChange={handlePaymentChange}
                            />
                            Airtel Money
                            <br />
                            <br />
                            <input 
                                type="radio" 
                                className="payment-method"
                                name="payment"
                                value="T-Cash"
                                onChange={handlePaymentChange}
                            />
                            T-Cash
                            <br />
                            {enterPhoneNumber && (
                                <input 
                                type="number" 
                                name="phone"
                                placeholder="Enter Phone number"
                                className="phone-number"
                                value={phoneNumber.phone}
                                onChange={handlePhoneNummber}
                            />
                            )}
                            <br />
                            <br />
                            <br />
                            {!confirm && (
                                <button
                                className="proceed"
                                onClick={() => processTransaction(item)}
                                >
                                    Proceed
                                </button>
                            )
                            }
                            {confirm &&(
                                <button onClick={() => {
                                    confirmPayment()
                                    handleDeleteItem(item)
                                    }} className="proceed">Confirm
                                </button>
                            )}
                            
                    </div>
                    )

                    }
                </div>
            ))}
            {processingTransaction === 2 && (
                <div className="items-in-cart">
                    <p className="sucess">Transaction Successful! The {itemToBuy.name} will be delivered within {itemToBuy.deliverytime} days.</p>
                    <img className="images" src={itemToBuy.image} alt={itemToBuy.name} />
                    <p className="details">Name: {itemToBuy.name}</p>
                    <p className="details">Cost:  KES {itemToBuy.total}</p>
                    <p className="details">Shop Name: {itemToBuy.shopName}</p>
                    <p className="details">Order: #{itemToBuy.orderNumber}</p>
                    <p className="details">Color: {itemToBuy.color}</p>
                    <p className="details">Size: {itemToBuy.size}</p>
                    <p className="details">Weight: {itemToBuy.weight}</p>
                    
                </div>
            )
            }
        </div>
    );
};

export default Cart;


