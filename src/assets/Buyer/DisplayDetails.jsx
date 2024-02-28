import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./DisplayDetails.css";

const sellersUrl = "http://localhost:3000/merchandise";
const userUrl = "http://localhost:3000/users";

const DisplayDetails = ({ user }) => {
 
    const [merchandise, setMerchandise] = useState([]);
    const [fetchError, setFetchError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [errorItem, setErrorItem] = useState(null)
    const [addedItemIds, setAddedItemIds] = useState([]);
    const [addReviews, setAddReviews] = useState("")
    const [seeReviews, setSeeReviews] = useState({});
    const [error, setError] = useState("")

    const dataToDispaly = merchandise.filter(item => item.status !==  "blocked" && parseInt(item.quantity) >= 1)


    useEffect(() => {
        setSearchTerm(""); 
      }, []);

      const filteredData = dataToDispaly.filter(item => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        const itemClass = item.class ? item.class.toLowerCase() : "";
        const itemCategory = item.category ? item.category.toLowerCase() : "";
        
        return (
            itemName.includes(searchTerm.toLowerCase()) ||
            itemClass.includes(searchTerm.toLowerCase()) ||
            itemCategory.includes(searchTerm.toLowerCase())
        );
    });

    /*
    - Fetches the data in the server and updates state
    */ 
    
    const fetchData = async () => {
        try {
            const response = await fetch(sellersUrl);
            if (response.ok) {
                const sellersData = await response.json();
                setMerchandise(sellersData);
            } else {
                setFetchError("There was an error fetching goods");
            }
        } catch (err) {
            console.log(err);
            setFetchError("Crazy");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddToCart = async item => {
        try {
            // Fetch user data from the server using the userId prop
            const response = await fetch(`${userUrl}/${user.id}`);
            if (!response.ok) {
                setError("Failed to fetch user data");
                return; // Return early if there's an error fetching user data
            }
            const userData = await response.json();

            // Check if the item already exists in the user's cart
            const isItemAlreadyInCart = userData.incart.some(cartItem => 
                cartItem.seller === item.username &&
                cartItem.name === item.name &&
                cartItem.shopName === item.shopName &&
                cartItem.color === item.color &&
                cartItem.size === item.size &&
                cartItem.weight === item.weight &&
                cartItem.transport === item.transport &&
                cartItem.deliverytime === item.deliverytime &&
                cartItem.class === item.class &&
                cartItem.category === item.category &&
                cartItem.location === item.location
                );
            if (isItemAlreadyInCart) {
                setErrorItem(item); // Set the item with error
                setError("This item is already in your cart");
                setTimeout(() => {
                    setError("");
                    setErrorItem(null); // Reset error item after 2 seconds
                }, 2000);
                return;
            }

            // Generate a unique id for the itemTo add
            // const itemId = uuidv4();
            // Create timeStamp when the item is added to cart.
            const currentTime = new Date().toISOString();

            const itemToAdd = {
                
                id: item.id,
                timeStamp: currentTime,
                username: user.username,
                seller: item.username,
                images: item.images,
                name : item.name,
                price: item.price,
                shopName: item.shopName,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                weight: item.weight,
                transport: item.transport,
                deliverytime: item.deliverytime,
                class: item.class,
                category: item.category,
                location: item.location,
                messages: []

            }
    
            // Update incart attribute with the new item
            const updatedUserData = {
                ...userData,
                incart: [...userData.incart, itemToAdd]
            };
    
            // Make a PATCH request to update the user data on the server using the userId prop
            const patchResponse = await fetch(`${userUrl}/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedUserData)
            });
    
            if (!patchResponse.ok) {
                setError("Failed to update user data");
                return; // Return early if there's an error updating user data
            }
            setAddedItemIds(prevIds => [...prevIds, item.id]);
            setTimeout(() =>{
                setAddedItemIds("")
            }, 2000);
        } catch (error) {
            console.error(error);
            setError("There was an error adding your item.");
        }
    };

    const handleAddReview = event =>{
        const {name, value} = event.target;
        setAddReviews(prevRev =>({
            ...prevRev,
            [name]: value,
        }))
    }

    const handleSendReview = async (item) =>{
        // event.preventDefault();
        try{
            const review = {
                sender: user.username,
                review: addReviews.review,
                time: new Date().toString(),
                id: uuidv4()
            }
            const reviews = {
                ...item,
                reviews: [...item.reviews, review ]
            }
            const response = await fetch(`${sellersUrl}/${item.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(reviews)
            })
            if (response.ok){
                fetchData();
                setAddReviews({
                    review: ""
                })
            }

        }catch(err){
            console.log
        }
    }

    const handleSeeReviews = itemId =>{
        setSeeReviews(prevVisibleReviews => ({
            ...prevVisibleReviews,
            [itemId]: !prevVisibleReviews[itemId]
        }));
    }
    
    return (
        <>
            <div className="display-card" >
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search item by name, category, description"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                {fetchError && <p id="error">{fetchError}</p>}
                <div id="search">
                {filteredData.map(item => (
                    <div className="display" key={item.id}>
                        {item.images.map((image, index) => (
                            <img className="images" key={index} src={image} alt={item.name} />
                        ))}
                        <div>
                            <p>{item.name}</p>
                            <p>Price: {item.price}</p>
                            <p>
                                {item.shopName}, {item.location}
                            </p>
                        </div>
                        {errorItem && errorItem.id === item.id && <p style={{color: "red"}}>{error}</p>}
                        {addedItemIds.includes(item.id) && <p style={{color: "green"}}>Added to your cart</p>}
                        <button className="reviews-btn" onClick={() => handleSeeReviews(item.id)}>Reviews</button>
                        <br />
                        {seeReviews[item.id] && (
                            <div>
                                <textarea 
                                    className="reviews"
                                    type="text" 
                                    name="review"
                                    placeholder="Review..."
                                    value={addReviews.review}
                                    onChange={handleAddReview}
                                />
                                <button className="send-button" onClick={() => handleSendReview(item)}>Send</button>
                                {item.reviews.map((review, index) =>(
                                    <div className="review" key={index}>
                                        <p className="sender">{review.sender}</p>
                                        <p className="reviewed-review">{review.review}</p>
                                        <p className="time">{review.time}</p>
                                    </div>
                                ))
                                }
                            </div>
                        )

                        }
                        
                        <br />
                        <button onClick={() => handleAddToCart(item)} id="add-to-cart">Add to cart</button>
                    </div>
                ))}
                </div>
            </div>
        </>
    );
};

export default DisplayDetails;

