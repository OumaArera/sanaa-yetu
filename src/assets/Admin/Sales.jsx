import React, {useState, useEffect} from "react";
import "./Sales.css";

const SALES_URL = "http://localhost:3000/sales";

const Sales = () =>{

    const [sales, setSales] = useState([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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
        fetchSales()
    }, [])

    const handleApprovePayment = async item =>{

        const approvePayment = {
            ...item,
            paymentStatus: "Approved",
        }

        const confirmation = confirm("Approve payment?")

        if (confirmation){
            try{
                const response = await fetch(`${SALES_URL}/${item.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify(approvePayment)
                })

                if (response.ok){
                    fetchSales();
                }else{

                }

            }catch(err){
                console.log(err)
            }
        }
    }

    useEffect(() => {
        setSearchTerm(""); 
      }, []);

      const filteredData = sales.filter(item => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        const itemClass = item.class ? item.class.toLowerCase() : "";
        const itemCategory = item.category ? item.category.toLowerCase() : "";
        const itemDate = item.date ? item.date.toLowerCase() : "";
        const itemShopName = item.shopName ? item.shopName.toLowerCase() : "";
        const itemOrderNumber = item.orderNumber ? item.orderNumber.toLowerCase() : "";
        const itemPaymentStatus = item.paymentStatus ? item.paymentStatus.toLowerCase() : "";
        
        return (
            itemName.includes(searchTerm.toLowerCase()) ||
            itemClass.includes(searchTerm.toLowerCase()) ||
            itemCategory.includes(searchTerm.toLowerCase()) ||
            itemDate.includes(searchTerm.toLowerCase()) ||
            itemShopName.includes(searchTerm.toLowerCase()) ||
            itemOrderNumber.includes(searchTerm.toLowerCase()) ||
            itemPaymentStatus.includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div id="sales-card">
            <input 
                type="text" 
                className="search"
                placeholder="Search transaction"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
            />
            <table className="sales-table">
                <th className="sales">Date</th>
                <th className="sales">Seller Email</th>
                <th className="sales">Shop Name</th>
                <th className="sales">Item Name</th>
                <th className="sales">Item Class</th>
                <th className="sales">Item Category</th>
                <th className="sales">Color</th>
                <th className="sales">Size</th>
                <th className="sales">Weight</th>
                <th className="sales">Delivery Time</th>
                <th className="sales">Buyer Name</th>
                <th className="sales">Buyer Phone</th>
                <th className="sales">Payment Method</th>
                <th className="sales">Order No.</th>
                <th className="sales">Item Price</th>
                <th className="sales">Transport Cost</th>
                <th className="sales">TOTAL</th>
                <th className="sales">Payment Status</th>
                <th className="sales">Action</th>
                <tbody>
                    {Array.isArray(filteredData) && filteredData.map((item, index) =>(
                        <tr key={index}>
                            <td id="date-item" className="sales">{item.date}</td>
                            <td className="sales">{item.seller}</td>
                            <td className="sales">{item.shopName}</td>
                            <td className="sales">{item.name}</td>
                            <td className="sales">{item.class}</td>
                            <td className="sales">{item.category}</td>
                            <td className="sales">{item.color}</td>
                            <td className="sales">{item.size}</td>
                            <td className="sales">{item.weight}</td>
                            <td className="sales">{item.deliverytime}</td>
                            <td className="sales">{item.firstName} {item.lastName}</td>
                            <td className="sales">{item.phone}</td>
                            <td className="sales">{item.payment}</td>
                            <td className="sales">{item.orderNumber}</td>
                            <td className="sales">{item.price}</td>
                            <td className="sales">{item.transport}</td>
                            <td className="sales">{item.total}</td>
                            <td style={{color: item.paymentStatus === "unpaid" ? "#dc3545" : "#228B22"}} className="sales">{item.paymentStatus}</td>
                            <td className="sales-action">
                                {error && <p className="error">{error}</p>}
                                <button className="block-btn" onClick={() => handleApprovePayment(item)}>
                                    Approve
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

export default Sales;

