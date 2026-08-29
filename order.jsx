import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";


function Order(){

    const {prodID}= useParams();
    const navigate=useNavigate();
  
    const[orders,setOrders]= useState([]);
    const[status,setStatus]=useState("all");

    const user = JSON.parse(localStorage.getItem("user"));
    //const token = localStorage.getItem("token");

    const isAdmin =user?.role==="admin";

    const getOrders = async() => {
        try{
        
            const token = localStorage.getItem("token");
            let url;

            if(isAdmin){
                url="http://localhost:5000/api/orders/all";
            }else{
                url="http://localhost:5000/api/orders/myOrders";
            }

            if(status !== "all"){
                url +=`?status=${status}`;
            }
            const response = await fetch(url,{
                headers:{
                    Authorization:`Bearer ${token}`

                }
            });

            const data =await response.json();

            if(!response.ok){
                alert(data.message);
                return;
            }
            setOrders(data.orders);
        }catch(error){
            console.log("Get Orders Error:",error)

        }
    };

    useEffect(()=>{
        getOrders();
    },[status]);

    const updateStatus = async(orderId,newStatus) =>{
        try{
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`,
                {method:"PUT",
                 headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${token}`
                    },
                    body:JSON.stringify({
                        status:newStatus
                    })
                });

                const data =await response.json();

                if(!response.ok){
                    alert(data.message);
                    return;
                }

                setOrders((prev)=>prev.map((order)=>order.id ===orderId ? data.order :order));
        }catch(error){
            console.log("Update status error: ",error);
        }
    };

    return(
        <div>
            <h1>{isAdmin ? "All Orders" : "My Orders"}</h1>

            <select value={status} onChange={(e)=>setStatus(e.target.value)}>

                <option value="all">All Orders</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Deleiverd</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
            </select>

           {orders.length ===0 ? (<p>No orders found</p>) :(orders.map((order) => (
                <div key={order._id}>
                   {
                    isAdmin && order.user &&(
                        <div>
                        <p><b>User:</b> {order.user.name}</p>
                        <p><b>Email:</b> {order.user.email}</p>
                        </div>
                    )}
                    <h3>{order.prodName}</h3>
                    <p><b>Product ID:</b> {order.prodID}</p>
                    <p><b>Quantity: </b>{order.quantity}</p>
                    <p><b>Amount:</b> {order.amount}</p>
                    <p><b>Status: </b>{order.status}</p>

                    {isAdmin && (<select value={order.status} onChange={(e)=>updateStatus(order.id,e.target.value)}>
                                 <option value="confirmed">Confirmed</option>
                                 <option value="delivered">Deleiverd</option>
                                 <option value="cancelled">Cancelled</option>
                                 <option value="returned">Returned</option>
                                 </select>)}
                </div>
            )))} 
        </div>
    );


}
export default Order;
