import React, { useState, useEffect } from "react";
const MERCHANDISE_URL = "http://localhost:3000/merchandise";
const USER_URL = "http://localhost:3000/users";
import "./Shop.css";

const Shop = ({ loggedInUser }) =>{

    const [merchandise, setMerchandise] = useState([]);
    const [loggedInUserData, setLoggedInUserData] = useState([]);
    const [itemsToAdd, setItemsToAdd] = useState({});
    const [error, setError] = useState("");
    const [otherDetails, setOtherDetails] = useState({})

    const fetchMerchandise = async () =>{
        try{
            const response = await fetch(MERCHANDISE_URL);
                if(response.ok){
                    const data = await response.json();
                    setMerchandise(data);
                }

        }catch(err){
            console.log(err)
        }
    }

    
    const fetchData = async () =>{
        try{
            fetchMerchandise();
            const userData = await fetch(`${USER_URL}/${loggedInUser.id}`);
            if (userData.ok){
                const data = await userData.json();
                setOtherDetails(data.otherdetails)
                setLoggedInUserData(data);
            }

        }catch(err){
            console.log(err)
        }
    }


    useEffect(() =>{
        fetchData();

    }, [])

    const userMerchandise = Array.isArray(merchandise) && merchandise.filter(mach => mach.username === loggedInUser.username);

    const handleChange = event =>{
        const {name, value} = event.target;
        setItemsToAdd(prevDetails =>({
            ...prevDetails,
            [name]: value,
        }))
    }

    const handleSubmit = event =>{
        event.preventDefault();

        // const emptyFields = Object.values(itemsToAdd).some(value => value === '');

        if (!itemsToAdd.firstImage ||
            !itemsToAdd.secondImage ||
            !itemsToAdd.thirdImage ||
            !itemsToAdd.name ||
            !itemsToAdd.price ||
            !itemsToAdd.quantity ||
            !itemsToAdd.transport ||
            !itemsToAdd.deliverytime ||
            !itemsToAdd.color ||
            !itemsToAdd.size ||
            !itemsToAdd.weight 
            ) {
            setError("Please fill in all fields.");
            return;

        }else{
            fetchData();
            const newItem = {

                firstName: loggedInUserData.firstName,
                lastName: loggedInUserData.lastName,
                username: loggedInUserData.username,
                type: loggedInUserData.type,
                status: "active",
                shopName: otherDetails[0].shopName,
                location: otherDetails[0].location,
                class: otherDetails[0].class,
                category: otherDetails[0].category,
                images: [itemsToAdd.firstImage, itemsToAdd.secondImage, itemsToAdd.thirdImage],
                name: itemsToAdd.name,
                price: itemsToAdd.price,
                quantity: itemsToAdd.quantity,
                color: itemsToAdd.color,
                size: itemsToAdd.size,
                weight: itemsToAdd.weight,
                transport: itemsToAdd.transport,
                deliverytime: itemsToAdd.deliverytime,
                reviews: []
            }
            alert("Hi")
            updateItem(newItem)
            setError("");
            
        }

        
    }

    const updateItem = async item =>{
        try{
            const response = await fetch(MERCHANDISE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(item)
            })
            if (response.ok){
                fetchMerchandise();
                setItemsToAdd("")
                alert("That went straight!")
            }

        }catch(err){
            console.log(err)
            setError("There was a network error!")
        }
    }

    return (
        <>
        <br />
        <div id="add-item">
            <input 
                className="add-items" 
                type="text" 
                name="firstImage"
                placeholder="Enter url"
                value={itemsToAdd.firstImage}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="text" 
                name="secondImage"
                placeholder="Enter url"
                value={itemsToAdd.secondImage}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="text" 
                name="thirdImage"
                placeholder="Enter url"
                value={itemsToAdd.thirdImage}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="text" 
                name="name"
                placeholder="Enter name"
                value={itemsToAdd.name}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="number" 
                name="price"
                placeholder="Enter price"
                value={itemsToAdd.price}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="number" 
                name="quantity"
                placeholder="Enter quantity"
                value={itemsToAdd.quantity}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="number" 
                name="transport"
                placeholder="Enter cost of transport"
                value={itemsToAdd.transport}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="number" 
                name="deliverytime"
                placeholder="Enter delivery time"
                value={itemsToAdd.deliverytime}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="text" 
                name="color"
                placeholder="Enter color"
                value={itemsToAdd.color}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="text" 
                name="size"
                placeholder="Enter size"
                value={itemsToAdd.size}
                onChange={handleChange}
            />
            <br />
            <input 
                className="add-items" 
                type="text" 
                name="weight"
                placeholder="Enter weight"
                value={itemsToAdd.weight}
                onChange={handleChange}
            />
            <br />
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} action="submit">
                <button id="submit-button" type="submit">Submit</button>
            </form>

        </div>
        <div className="my-items">
            {userMerchandise.map(item =>(
                <div className="each-item" key={item.id}>
                    {item.images.map((image, index) => (
                        <img className="images" key={index} src={image} alt={item.name} />
                    ))}
                    <p className="my-shop">Name: {item.name}</p>
                    <p className="my-shop">Price: {item.price}</p>
                    <p className="my-shop">Quantity: {item.quantity}</p>
                    {item.reviews.map((review, index) => (
                        <div className="review" key={index}>
                            <p className="sender">{review.sender}</p>
                            <p className="text">{review.text}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        </>
    )

}
export default Shop;


