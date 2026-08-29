import { useEffect, useState } from "react";
import '../src/Style/product.css'
import { useNavigate } from "react-router-dom";

function Product() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        prodID: "",
        prodName: "",
        price: "",
        stock: ""
    });
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
   // const [selectedProduct, setSelectedProduct] = useState(null);
   // const [quantity, setQuantity] = useState(1);
    const navigate =useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user);

    const getProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            //  console.log("TOKEN", token);

            if (!token) {
                console.log("No token -stopping request");
                return;
            }

            const response = await fetch("http://localhost:5000/api/products/",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to get products");
                return;
            }
            setProducts(data.products);
            setForm({
                prodID: "",
                prodName: "",
                price: "",
                stock: ""
            });
        } catch (error) {
            alert(error);
            setMessage("Server error");
        }
    };

    useEffect(() => {
        getProducts();
    }, []);



    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (editId) {
                const response = await fetch(`http://localhost:5000/api/products/${editId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`

                        },
                        body: JSON.stringify({
                            prodID: form.prodID,
                            prodName: form.prodName,
                            price: Number(form.price),
                            stock: Number(form.stock)
                        })
                    });

                const data = await response.json();
                console.log("Update", data);

                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }
                setMessage("Product updated successfully");
                setEditId(null);
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === editId ? {
                            ...product, prodID: form.prodID,
                            prodName: form.prodName,
                            price: form.price,
                            stock: form.stock
                        } : product));
                setForm({
                    prodID: "",
                    prodName: "",
                    price: "",
                    stock: ""
                });
            } else {

                console.log("POST TOKEN", token);

                const response = await fetch("http://localhost:5000/api/products/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(
                            {
                                prodID: form.prodID,
                                prodName: form.prodName,
                                price: Number(form.price),
                                stock: Number(form.stock)
                            })
                    });

                const data = await response.json();
                // console.log(data);
                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }

                setMessage("Product Added Successfully");
                //setProducts(data.products);

                getProducts();
            }
        } catch (error) {
            console.log(error);
            setMessage("Server Error");
        }
    };

    const handleEdit = (product) => {
        setEditId(product._id);

        setForm({
            prodID: product.prodID,
            prodName: product.prodName,
            price: product.price,
            stock: product.stock
        });

    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            setMessage("Product deleted Successfully");

            setProducts((prevProducts) =>
                prevProducts.filter((product) =>
                    product._id !== id)
            );
        }
        catch (error) {
            console.log(error);
            setMessage("Server error", error);
        }
    };

    const handleOrder = (product) =>{
        navigate("/orders")
    }


    // const handleOrderClick = (product) => {
    //     setSelectedProduct(product);
    //     setQuantity(1);
    // };

    // const handleConfirmOrder = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = await fetch("http://localhost:5000/api/orders/", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: JSON.stringify({
    //                 prodID: selectedProduct.prodID,
    //                 quantity: quantity
    //             })
    //         });
    //         alert(response);
    //         console.log(response);

    //         const data = await response.json();

    //         console.log("Order response:", data);

    //         if (!response.ok) {
    //             alert(data.message);
    //             return;
    //         }
            
    //        setProducts((prevProducts)=>prevProducts.map((p)=>p.prodID === selectedProduct.prodID ? {...p,stock:p.stock - quantity}: p));
    //        alert("Order Placed Successfully");
 
    //        setSelectedProduct(null);

    //         setQuantity(1);

    //         if(user.role !== "admin"){ navigate("/myOrders");}else{
    //             navigate("/orders");
    //         }
           

    //     } catch (err) {
    //         console.log("Order error:", err)
    //     }
    // };

    return (
        <div>
            <div className="product-page">
                <h2>Product Management</h2>
                <h3>Logged in as:{user?.name} {user?.role}</h3>

                {user?.role === "admin" && (
                    <form onSubmit={handleSubmit} className="product-form">
                        <input type="text" placeholder="Enter product ID" name="prodID" value={form.prodID} onChange={handleChange} />
                        <input type="text" placeholder="Enter product Name" name="prodName" value={form.prodName} onChange={handleChange} />
                        <input type="number" placeholder="Enter product price" name="price" value={form.price} onChange={handleChange} />
                        <input type="number" placeholder="Enter product Stock" name="stock" value={form.stock} onChange={handleChange} />

                        <button type="submit">{editId === null ? "Add Product" : "Update Product"}</button>
                    </form>)}

                <p className="product-message"> {message} </p>
           
            <hr />
            <div className="product-container">
                <h3>Available Products</h3>
                {products.map((product) =>
                (
                    <div className="product-card" key={product._id}>
                        <h3>{product.prodName}</h3>
                        <h4>{product.prodID}</h4>
                        <p>Price:{product.price}</p>
                        <p>Stock:{product.stock}</p>

                        {/* <button type="submit" style={{ backgroundColor: "navy", color: "white", borderRadius: "15px", borderColor: "navy" }}
                            onClick={() => navigate("/orders",{
                                state:{
                                    selectedProduct:product
                                }
                            })}>Place Order</button> */}

                        <button onClick={()=>handleOrder(product)}>Place Order</button>



                        {user?.role === "admin" && (
                            <div className="product-actions">
                                
                                <button onClick={() => handleEdit(product)} >Edit</button>
                                <button onClick={() => handleDelete(product._id)}>Delete</button>
                            </div>
                        )}



                    </div>

                ))}
                {/* {selectedProduct && (
                    <div className="order-overlay">
                        <div className="order-popup">
                            <h2 className="order-head">Order-Page</h2>
                            <p>Product-ID: {selectedProduct.prodID}</p>
                            <p>Product-Name: {selectedProduct.prodName}</p>
                            <p>Price: {selectedProduct.price}</p>
                            <label>Quantity</label>
                            <span>
                                <input type="number" min="1" max={selectedProduct.stock} value={quantity} placeholder="Enter quantity" 
                              onChange={(e) => { setQuantity(Number(e.target.value)); }} /></span>
                            <h3 style={{color:"goldenrod", textAlign:"center"}}>Amount: {selectedProduct.price * quantity}</h3>

                            <div>
                                <button onClick={handleConfirmOrder}>Confirm Order</button>
                                <button onClick={() => {
                                    setQuantity(1);
                                    setSelectedProduct(null);
                                }}>Cancel</button>
                            </div>
                        </div>
                    </div>)} */}

            </div>
        </div>
         </div>
    );
}
export default Product;
