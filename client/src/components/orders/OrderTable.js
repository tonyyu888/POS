import React, {useEffect, useState} from 'react';
import moment from "moment";

import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import OrderForm from './OrderForm';

import ReactPaginate from 'react-paginate';
import * as  BsIcons from 'react-icons/bs';
import * as  RiIcons from 'react-icons/ri';
import * as  SiIcons from 'react-icons/si';
import './Table.css';

const OrderTable = () => {
    const [rows, setRows]= useState([]);
    const [inEditMode, setInEditMode] = useState({status:false, rowKey:null})
    const [pageNumber, setPageNumber]= useState(0)
    const [addBtnPopupForm, setAddBtnPopupForm] = useState(false)
    
    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [orderDate, setOrderDate] = useState(new Date());
    const [comment, setComment] = useState("");
    const [salesPerson, setSalesPerson] = useState("");
    const [orderStatus, setOrderStatus] = useState("Created");

    const [orderDetail, setOrderDetail] = useState([]);


    const [customerList, setCustomerList]= useState([]);
    const [salesPersonList, setSalesPersonList]= useState([]);
    const [productList, setProductList]= useState([]);

//    const [orderDetailList, setOrderDetailList]= useState([])

    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage;
    const pageCount = Math.ceil(rows.length / rowsPerPage);
  
    const changePage = ({selected}) => {
        setPageNumber(selected)
    }

    //fetch order data and set rows
    const getOrders = async () => {
        let response= await fetch('/order');
        let data = await response.json();
        console.log("data:", data);
        setRows(data);
    }

/*    
    //fetch order detail data and set rows
    const getOrderDetails = async () => {
        let response= await fetch('/orderDetail');
        let data = await response.json();
        console.log("data:", data);
        setOrderDetailList(data);
    }
*/
    //fetch sales person list 
    const getSalesPersonList = async () => {
        let response= await fetch('/user');
        let data = await response.json();
        setSalesPersonList(data);
    }

     //fetch customer list 
     const getCustomerList = async () => {
        let response= await fetch('/customer');
        let data = await response.json();
        setCustomerList(data);
    }

     //fetch product
     const getProductList = async () => {
        let response= await fetch('/product');
        let data = await response.json();
        setProductList(data);
    }    

    //load order details data into order's orderDetail array
/*    
    const loadOrderDetailIntoOrder = () => {

        console.log("### Inside loadOrderDetailIntoOrder()")
        let newRows = [...rows];

        let op = newRows.map( (e, i) => {

            let temp = orderDetailList.find(element => element.orderId === e._id)

            if (temp.orderDetailRecord) {
                e.push({orderDetail: temp.orderDetailRecord})            
            }           
            return e;
        } )

        console.log("op = ", op);
        setRows(op);
    }
*/

    useEffect(() => {
        setTimeout(function(){getOrders()}, 500);
//        getOrders();
    }, [addBtnPopupForm])

    //update a Order
    let updateOrder = (id, newOrderNumber, newCustomer, newOrderDate, newComment, newSalesPerson, newOrderDetail) => {

        let currentDate = new Date();
        let orderToUpdate = {
            orderNumber: newOrderNumber,
            customer: newCustomer,
            orderDate: newOrderDate,
            comment: newComment,
            salesPerson: newSalesPerson,

            ordeDetail: newOrderDetail,

            lastUpdateDate: currentDate
        };
        let updateResponse = fetch(`/order/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(orderToUpdate)
        }).then(response => response.json())
        .then(json => {
            onCancel(); //reset inEditMode  values
            getOrders(); //fetch the updated data
            console.log("updateResponse:", updateResponse);
        })
    }

    const onEdit = (id, currentOrderNumber, currentCustomer, currentOrderDate, currentComment, currentSalesPerson, currentOrderStatus, currentOrderDetail) => {
        setInEditMode({status: true, rowKey: id});
        

        console.log("#143 - currentOrderDetail = ",currentOrderDetail)

        setOrderNumber(currentOrderNumber);

        console.log("#147")

        setCustomer(currentCustomer);

        console.log("#151")

        setOrderDate(currentOrderDate);

        console.log("#155")

        setComment(currentComment);

        console.log("#159")

        setSalesPerson(currentSalesPerson);

        console.log("#163")

        setOrderStatus(currentOrderStatus);

        console.log("#167")

        setOrderDetail(currentOrderDetail);

        console.log("#171")


        getCustomerList();
        getSalesPersonList();
        getProductList();        

        console.log("#178")
    }

    const onSave = (id, newOrderNumber, newCustomer, newOrderDate, newComment, newSalesPerson, newOrderDetail) => {
        updateOrder(id, newOrderNumber, newCustomer, newOrderDate, newComment, newSalesPerson, newOrderDetail)
    }
    
    const onCancel = () => {
        setInEditMode({status:false, rowKey:null});
        getOrders();
    }

    //delete a row
    const handleDeleteClick = async (itemId) => {
        let deleteResponse = await fetch(`/order/${itemId}`, {
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json'}
        })
        if(deleteResponse.status === 200) {
            getOrders();
        }
        console.log('deleteResponse:',deleteResponse );
    }

    const handleOrderFormClick = (orderFormData) => {
        if(orderFormData === 'success') {
            getOrders();
        }
    }


    const onOrderDetailAdd = (id) => {

        let newRows = [...rows];
  
        for (let i=0; i< newRows.length; i++) {
          if (newRows[i]._id === id) {
            newRows[i].orderDetail[0].orderDetailRecord.push({productId: "", quantity: 0.00, price: 0.00 });
            setOrderDetail(newRows[i].orderDetail[0].orderDetailRecord);
            break;
          }        
        }
   
        setRows(newRows);
      }    

    const onOrderDetailChange = (e, id, index) => {


        console.log("e.target.name = ", e.target.name)
        console.log("e.target.value = ", e.target.value)


        let newOrderDetail = [...orderDetail]
        newOrderDetail[index][e.target.name] = e.target.value 
        setOrderDetail(newOrderDetail); 
  
        let newRows = [...rows];
  
        for (let i=0; i< newRows.length; i++) {
          if (newRows[i]._id === id) {
            newRows[i].orderDetail[0].orderDetailRecord[index] = newOrderDetail;
            break;
          }        
        }
   
        setRows(newRows);
      }

      const onOrderDetailDelete = (id, index) => {

        let newOrderDetail = [...orderDetail];
        newOrderDetail.splice(index, 1);
        setOrderDetail(newOrderDetail);
  
        let newRows = [...rows];
  
        for (let i=0; i< newRows.length; i++) {
          if (newRows[i]._id === id) {
            newRows[i].orderDetail[0].orderDetailRecord[index] = newOrderDetail;
            break;
          }        
        }
   
        setRows(newRows);
      }   

    const displayRows = rows.slice(rowsVisited, rowsVisited+rowsPerPage).map(row => {
//    const displayRows = rows.slice(0, 1).map(row => {

            console.log("266")
            console.log("rows = ",  rows)

        return(
            <tr key= {row.orderNumber}>
                <td>{row.orderNumber}</td>
                <td>
                    {
                        inEditMode.status && inEditMode.rowKey === row._id ? (
                            <select value={customer._id} onChange={(e) => setCustomer(e.target.value)}>
                                <option>--Select--</option>
                                {customerList.map(item => <option key={item.name} value={item._id}>{item.name}</option>
                                )} 
                            </select>
                        ):(
                            row.customer.name
                        )
                    }
                </td>
                <td>
                    {
                        inEditMode.status && inEditMode.rowKey === row._id ? (
                        <Datepicker format={"MM/DD/yyyy"} value={moment(orderDate).format("MM/DD/yyyy")} onChange={date => setOrderDate(date)} />
                        ):(                            
                            moment(row.orderDate).format("MM/DD/yyyy")
                        )
                    }
                </td>
                <td>
                    {
                        inEditMode.status && inEditMode.rowKey === row._id ? (
                        <input value={comment} onChange={(e) => setComment(e.target.value)} />
                        ):(
                            row.comment
                        )
                    }
                </td>
                <td>
                    {
                        inEditMode.status && inEditMode.rowKey === row._id ? (
                            <select value={salesPerson._id} onChange={(e) => setSalesPerson(e.target.value)}>
                                <option>--Select--</option>
                                {salesPersonList.map(item => <option key={item.firstName} value={item._id}>{item.firstName + " " + item.lastName}</option>
                                )} 
                            </select>
                        ):(
                            row.salesPerson.firstName + " " + row.salesPerson.lastName
                        )
                    }
                </td>
                <td>{row.orderStatus.name}</td>



                <td>
                    <table>
                        <tbody>               
                        {                              

//                            row.orderDetail.map( (od, indexOd) => {
                            row.orderDetail[0].orderDetailRecord.map( (odi, index) => {

//                              console.log("row.orderDetail[indexOd].orderDetailRecord = ", row.orderDetail[indexOd].orderDetailRecord)
//                              console.log("od = ", od)
//                              console.log("index = ", indexOd)

//                              row.orderDetail.map( (cn, index) => { 
//                                od.orderDetailRecord.map( (odi, index) => {

                                        console.log("odi = ", odi)
                                        console.log("index = ", index)
                                        console.log("odi.productId = ", odi.productId)
                                        console.log("odi.name = ", odi.name)
                                        console.log("odi.quantity = ", odi.quantity)
                                        console.log("odi.price = ", odi.price)
                                        console.log("inEditMode = ", inEditMode)
                                        console.log("orderDetail[index] = ", orderDetail);
                                        console.log("row.orderDetail[0].orderDetailRecord = ", row.orderDetail[0].orderDetailRecord )

                                        return ( <tr key={index}>                          
                                                    <td>{
                                                            inEditMode.status && inEditMode.rowKey === row._id ? (

                                                            <select name="productId" value={orderDetail[index].productId} onChange={(e) => onOrderDetailChange(e, row._id, index)}>
                                                                <option>--Select--</option>
                                                                {productList.map(item => <option key={item.name} value={item._id}>{item.name}</option>
                                                                )} 
                                                            </select>
                                                            ) : (
                                                            odi.productId
                                                            )                         
                                                    }</td>
                                                    <td>{
                                                            inEditMode.status && inEditMode.rowKey === row._id ? (
                                                            <input name="quantity" value={orderDetail[index].quantity}
                                                                onChange={(e) => onOrderDetailChange(e, row._id, index)}
                                                            />
                                                            ) : (
                                                            odi.quantity
                                                            )                         
                                                    }</td>
                                                    <td>{
                                                            inEditMode.status && inEditMode.rowKey === row._id ? (
                                                            <input name="price" value={orderDetail[index].price}
                                                                onChange={(e) => onOrderDetailChange(e, row._id, index)}
                                                            />
                                                            ) : (
                                                            odi.price
                                                            )                         
                                                    }</td>
                                                    {
                                                        inEditMode.status && inEditMode.rowKey === row._id ? (
                                                            <td>
                                                            <button className="clear" onClick={ () => onOrderDetailDelete(row._id, index) }><RiIcons.RiDeleteBinFill/></button>
                                                            </td>
                                                        )  : null  
                                                    }
                                                </tr> )


//                                })



                            })
                        }
                        <tr>
                            {
                                inEditMode.status && inEditMode.rowKey === row._id ? (
                                <td>
                                    <button className="clear" onClick={ () => onOrderDetailAdd(row._id) }><SiIcons.SiAddthis/></button>
                                </td>
                                )  : null                
                            }    
                        </tr>
                        </tbody>          
                    </table>
                </td>





                <td>{moment(row.dateAdded).format("MM/DD/yyyy hh:mm A")}</td>
                <td>{moment(row.lastUpdateAdded).format("MM/DD/yyyy hh:mm A")}</td>
                <td>
                    {
                       inEditMode.status && inEditMode.rowKey === row._id ? (
                        <React.Fragment>
                            <button onClick = {() => onSave(row._id, orderNumber, customer, orderDate, comment, salesPerson, orderStatus, orderDetail)}>Save</button>
                            <button onClick = {() => onCancel()}>Cancel</button>
                        </React.Fragment>
                       ) : (
                           <button value={row.orderNumber} onClick={() => onEdit(row._id, row.orderNumber, row.customer, row.orderDate, row.comment, row.salesPerson, row.orderStatus, row.orderDetail[0].orderDetailRecord)}><BsIcons.BsPencilSquare /></button>
                       )
                    }
                    <button onClick={() => {handleDeleteClick(row._id)}}><RiIcons.RiDeleteBinFill/></button>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <div className="list-table">
                <h2>Orders</h2>
                <button className="add-u" onClick={() => setAddBtnPopupForm(true)}>New Order</button>
                <OrderForm trigger = {addBtnPopupForm} setTrigger = {setAddBtnPopupForm} onOrderFormClick = {handleOrderFormClick} />
                <table>
                    <tbody>
                        <tr><th>Order Number</th><th>Customer</th><th>Order Date</th><th>Comment</th><th>Sales Person</th><th>Order Status</th><th>Order Detail</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
                        {displayRows}
                    </tbody>
                </table>
                <ReactPaginate 
                    previousLabel = {"Prev"}
                    NextLabel = {"Next"}
                    pageCount = {pageCount}
                    onPageChange = {changePage}
                    containerClassName = {"paginationBttns"}
                    previousLinkClassName = {"previousBttn"}
                    nextLinkClassName = {"nextBttn"}
                    disabledClassName = {"paginationDisabled"}
                    activeClassName = {"paginationActive"}
                />   
            </div>
        </div>
        
    );
}
 
export default OrderTable;