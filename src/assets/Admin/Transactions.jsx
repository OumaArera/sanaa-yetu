import React, { useState, useEffect } from "react";
import "./Transactions.css"

import block from "../Images/block.svg"

const MERCHANDISE_URL = "http://localhost:3000/merchandise";
const SALES_URL = "http://localhost:3000/sales";

const Transactions = () =>{

    const [merchandise, setMerchandise] = useState([]);
    const [sales, setSales] = useState([]);
    const [error, setError] = useState("");

    const fetchMerchandise = async () =>{
        try{
            const response = await fetch(MERCHANDISE_URL);
            if(response.ok){
                const data = await response.json();
                setMerchandise(data)
            }else{
                setError("404, Not found");
            }

        }catch(err){
            console.log(err)
            setError("There was a network error!");
        }
    }

    const fetchSales = async () =>{
        try{
            const response = await fetch(SALES_URL);
            if(response.ok){
                const data = await response.json();
                setSales(data)
            }else{
                setError("404, Not found");
                setTimeout(() =>{
                    setError("")
                }, 4000)
            }

        }catch(err){
            console.log(err)
            setError("There was a network error!");
            setTimeout(() =>{
                setError("")
            }, 4000)
        }
    }
    

    useEffect(() =>{
        fetchMerchandise();
        fetchSales();
    }, [])

    const handleChangeStatus = async item =>{

        const changedStatus = {
            ...item,
            status: "blocked",
        }

        const confirmation = confirm("This will change the status of this item permanently?");

        if(confirmation){
            try{
                const response = await fetch(`${MERCHANDISE_URL}/${item.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(changedStatus)
                })
                if (response.ok){
                    fetchMerchandise();
                }
    
            }catch(err){
                console.log(err)
                setError("404, Not found!")
                setTimeout(() =>{
                    setError("")
                }, 4000)
            }
        }else{
            return;
        }

        
    }

    return (
        <div id="transactions-card">
            <table className="transactions">
                <th className="transactions">Images</th>
                <th className="transactions">Item Name</th>
                <th className="transactions">Item Class</th>
                <th className="transactions">Item Category</th>
                <th className="transactions">Item Price</th>
                <th className="transactions">Transport Cost</th>
                <th className="transactions">Seller Name</th>
                <th className="transactions">Seller Email</th>
                <th className="transactions">Shop Name</th>
                <th className="transactions">Shop Location</th>
                <th className="transactions">Delivery Time</th>
                <th className="transactions">Color</th>
                <th className="transactions">Size</th>
                <th className="transactions">Weight</th>
                <th className="transactions">Status</th>
                <th className="transactions-action">Action</th>
                <tbody>
                    {Array.isArray(merchandise) && merchandise.map((item, index) =>(
                        <tr key={index}>
                            <td className="transactions">
                                <img className="item-image" src={item.images[0]} alt={item.name} />
                            </td>
                            <td className="transactions">{item.name}</td>
                            <td className="transactions">{item.class}</td>
                            <td className="transactions">{item.category}</td>
                            <td className="transactions">{item.price}</td>
                            <td className="transactions">{item.transport}</td>
                            <td className="transactions">{item.firstName} {item.lastName}</td>
                            <td className="transactions">{item.username}</td>
                            <td className="transactions">{item.shopName}</td>
                            <td className="transactions">{item.location}</td>
                            <td className="transactions">{item.deliverytime}</td>
                            <td className="transactions">{item.color}</td>
                            <td className="transactions">{item.size}</td>
                            <td className="transactions">{item.weight}</td>
                            <td className="transactions">{item.status}</td>
                            <td className="transactions-action">
                                {error && <p className="error">{error}</p>}
                                <button className="block-btn" onClick={() => handleChangeStatus(item)}>
                                    <img className="image-btn" src={block} alt="Block" />
                                </button>
                            </td>
                        </tr>
                    ))
                    
                    }
                </tbody>
            </table>
        </div>
    )

}

export default Transactions;


