import React, { useState, useEffect } from "react";
import "./Report.css"

const USERS_URL = "http://localhost:3000/users";

const Report = ({ loggedInUser }) =>{
    const [salesReport, setSalesReport] = useState([]);

    useEffect(() =>{
        const fetchSalesData = async () =>{
            try{
                const response = await fetch(`${USERS_URL}/${loggedInUser.id}`);
                if (response.ok){
                    const data = await response.json();
                    setSalesReport(data.sales);
                }

            }catch(err){
                console.log(err)
            }
        }
        fetchSalesData();
    })

    return (
        <div id="report-table">
        <table id="table">
    
            <th className="transaction">Date</th>
            <th className="transaction">Order No.</th>
            <th className="transaction">Price</th>
            <th className="transaction">Transport</th>
            <th className="transaction">Buyer</th>
            <th className="transaction">Buyer Phone No.</th>
            <th className="transaction">Buyer Email</th>
            <th className="transaction">Item Name</th>
            <th className="transaction">Total</th>
            
            <tbody>
                {salesReport.map((transaction, index) =>(
                    <tr key={index}>
                        <td className="transaction">{transaction.date}</td>
                        <td className="transaction">{transaction.orderNumber}</td>
                        <td className="transaction">{transaction.price}</td>
                        <td className="transaction">{transaction.transport}</td>
                        <td className="transaction">{transaction.firstName} {transaction.lastName}</td>
                        <td className="transaction">{transaction.phone}</td>
                        <td className="transaction">{transaction.buyer}</td>
                        <td className="transaction">{transaction.name}</td>
                        <td className="transaction">{transaction.total}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )

}

export default Report