import React, { useEffect, useState } from "react";
import "./Orders.css";

const USER_URL = "http://localhost:3000/users";

const Orders = ({ loggedInUser }) =>{

    const [userData, setUserData] = useState([]);
    const [userError, setUserError] = useState("");

    useEffect(() =>{
        const fetchUserData = async () =>{
            try{
                const response = await fetch(`${USER_URL}/${loggedInUser.id}`)
                if (response.ok){
                    const data = await response.json();
                    setUserData(data.pastorders);
                }else{
                    setUserError("User not found!")
                }

            }catch(err){
                console.log(err)
                setUserError("There was a network error fetching your data!")
            }
        }
        fetchUserData()
    }, [])

    // const orders = Array.isArray(userData);

    return (
        <div>
            {userData.map((user,index) =>(
                <div key={index}>
                    <img className="images" src={user.image} alt={user.name} />
                    <p className="details">Name: {user.name}</p>
                    <p className="details">Cost:  KES {user.total}</p>
                    <p className="details">Shop Name: {user.shopName}</p>
                    <p className="details">Order: #{user.orderNumber}</p>
                    <p className="details">Color: {user.color}</p>
                    <p className="details">Size: {user.size}</p>
                    <p className="details">Weight: {user.weight}</p>
                </div>
            ))

            }
        </div>
    )

}

export default Orders