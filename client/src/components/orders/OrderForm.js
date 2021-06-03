import { useState , useEffect} from "react"

import moment from "moment";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './Form.css';
import * as  AiIcons from 'react-icons/ai';
import * as  SiIcons from 'react-icons/si';
import * as  RiIcons from 'react-icons/ri';

const OrderForm = (props) => {
    let [orderNumber, setOrderNumber] = useState("");
    let [customer, setCustomer] = useState("");
    let [orderDate, setOrderDate] = useState(new Date());
    let [comment, setComment] = useState("");
    let [salesPerson, setSalesPerson] = useState("");    
    const orderStatus = "60a2867e9fc7acc82853b427"; //hardcoded for now

    let [customerList, setCustomerList]= useState([]);
    let [salesPersonList, setSalesPersonList]= useState([]);
    let [productList, setProductList]= useState([]);
    let [orderDetail, setOrderDetail] = useState([]);
    let [createError, setCreateError] = useState("");

     //fetch customer
     const getCustomerList = async () =>{
        let response= await fetch('/customer');
        let data = await response.json();
        setCustomerList(data)
     }
      
     //fetch sales person
     const getSalesPersonList = async () => {
        let response= await fetch('/user');
        let data = await response.json();
        setSalesPersonList(data);
    }

     //fetch product
     const getProductList = async () => {
        let response= await fetch('/product');
        let data = await response.json();
        setProductList(data);
    }

    function getOrderNumber() {
        //Generate order number value    
        let tempDate = new Date();
        let sequenceNumber = Math.floor(100 + Math.random() * 900);
        let newOrderNumber = (tempDate.getMonth() + 1).toString().padStart(2, "0") + '' + tempDate.getDate() + '' + tempDate.getFullYear() +  '-' + sequenceNumber.toString().padStart(3, "0");
        setOrderNumber(newOrderNumber);
    }

    useEffect( () => {
        getOrderNumber();
        getCustomerList();
        getSalesPersonList();
        getProductList();
    }, []);

    async function onCreateClicked() {

        let currentDate = new Date();
        let orderToCreate = {
            orderNumber,
            customer, 
            orderDate,
            comment,
            salesPerson,
            orderStatus,
            orderDetail,
            dateAdded : currentDate,
            lastUpdateDate : currentDate
        }

        console.log('Creating a Order:', orderToCreate )
        
        try {
            let createOrderResponse = await fetch('/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderToCreate)                
            })

            console.log('Creating a order:', orderToCreate )

            if (createOrderResponse.status === 200) {
                props.onOrderFormClick("Success");

                getOrderNumber("");
                setCustomer("");
                setOrderDate(new Date());
                setComment("");
                setSalesPerson("");
                setOrderDetail([]);
            }

            // the server didn't like the data for some reason
            console.log('Create response is:', createOrderResponse)
            if (createOrderResponse.status !== 200) {
                let errorMessage = await createOrderResponse.text()
                console.log('We had an error.  it was: ', errorMessage)
                setCreateError(errorMessage)
            }
            else {
                setCreateError(undefined)
            }
        }
        catch (error) {
            // the server cannot be reached
            console.error('Fetch failed to reach the server:', error);
        }
    }

    const onInputChange = (event, setFunction) => {
        console.log('event: ', event)
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value);   
    };

    const onOrderDetailDelete = (index) => {
        let newOrderDetail = [...orderDetail];
        newOrderDetail.splice(index, 1);
        setOrderDetail(newOrderDetail);
    }

    const onOrderDetailChange = (e, i) => {
        let newOrderDetail = [...orderDetail]
        newOrderDetail[i][e.target.name] = e.target.value 
        setOrderDetail(newOrderDetail);
    }  

    const onOrderDetailAdd = () =>{
        let newOrderDetail = [...orderDetail]
        newOrderDetail.push({product: "", quantity: "", price: ""})
        setOrderDetail(newOrderDetail)
    }

    const onClickAdd = () => {
        onCreateClicked();
        props.setTrigger(false);   
    }

    let createOrderDataInvalid = !orderNumber || (orderNumber.trim().length === 0)

    return (props.trigger)? (
        <div className="createform">
            <div className="popup-in">
                <h4>Add a New Order</h4>
                <button className="closebtn" onClick={()=>props.setTrigger(false)}><AiIcons.AiOutlineClose/></button>
                {props.children}
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="orderDate">Order Date:</label> 
                                    <Datepicker format={"MM/DD/yyyy"} value={moment(orderDate).format("MM/DD/yyyy")} onChange={date => setOrderDate(date)} />
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="customer">Customer:</label> 
                                    <select value={customer} onChange={(event) => onInputChange(event, setCustomer)}>
                                        <option>--Select--</option>
                                            {customerList.map(item=> <option key={item.name} value={item._id}>{item.name}</option>
                                        )} 
                                    </select>
                                </td>
                                <td>
                                    <label htmlFor="salesPerson">Sales Person:</label> 
                                    <select value={salesPerson._id} onChange={(event) => onInputChange(event, setSalesPerson)}>
                                        <option>--Select--</option>
                                            {salesPersonList.map(item=> <option key={item.firstName} value={item._id}>{item.firstName + " "+ item.lastName}</option>
                                        )} 
                                    </select>
                                </td>    
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="comment">Comment:</label>
                                    <input id="comment" value={comment} onChange={(event) => onInputChange(event, setComment)}/>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="2">
                                    {/* <div className="row">
                                        <div className="col2"> */}
                                            <label htmlFor="orderDetail">Order Detail:</label>
                                                <table width="100%">
                                                    <tbody>
                                                        <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Action</th></tr>                                                
                                                        {
                                                            orderDetail.map( (od, index) => {
                                                                return ( <tr key = {index}>
                                                                            <td width="60%">{
                                                                                    <select name="product" value={od._id} onChange={(e) => onOrderDetailChange(e, index)}>
                                                                                    <option>--Select--</option>
                                                                                        {productList.map(item=> <option key={item.name} value={item._id}>{item.name}</option>
                                                                                    )} 
                                                                                </select>
                                                                            }</td>
                                                                            <td>{
                                                                                    <input name="quantity" value={od.quantity} onChange={ (e) => onOrderDetailChange(e, index) }
                                                                                />
                                                                            }</td>
                                                                            <td>{
                                                                                    <input name="price" value={od.price} onChange={ (e) => onOrderDetailChange(e, index) }
                                                                            />
                                                                            }</td>
                                                                            {
                                                                            <td>
                                                                                <button className="clear" onClick={ () => onOrderDetailDelete(index) }><RiIcons.RiDeleteBinFill/></button>
                                                                            </td>
                                                                            }
                                                                        </tr> )
                                                            })
                                                        }
                                                        <tr>
                                                            <td>
                                                                <button onClick={ onOrderDetailAdd }><SiIcons.SiAddthis/></button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                        {/* </div>
                                    </div> */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br/>            
                <button disabled={ createOrderDataInvalid } onClick={ onClickAdd } >Add Order</button>
                { createError && <div>{createError}</div> }  
            </div>          
        </div>
    ): "";
}
 
export default OrderForm;