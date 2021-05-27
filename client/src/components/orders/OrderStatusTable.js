import React, { useEffect, useState } from 'react';
import moment from "moment";
import './Table.css';
import OrderStatusForm from "./OrderStatusForm";
import ReactPaginate from 'react-paginate';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

const OrderStatus = () => {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [addBtnPopupForm, setAddBtnPopupForm]= useState(false)
    const [inEditMode, setInEditMode] = useState({status: false, rowKey: null});
    
    const [name,setName] = useState(null);
    const [description,setDescription] = useState(null);
    const [active, setActive] = useState("true");

    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage; 
    const pageCount = Math.ceil(rows.length /rowsPerPage);

    const changePage = ({selected})=>{
      setPageNumber(selected)
    }

    const getOrderStatus = async () => {
        let response = await fetch('/orderStatus');
        let data = await response.json();
        setRows(data);
      };
      
      useEffect(() => {
        getOrderStatus();
      }, [addBtnPopupForm]);
    
    const updateOrderStatus = (id, newName, newDescription, newActive) => {
      let currentDate = new Date();

      let orderStatusToUpdate = {
          name: newName,
          description: newDescription,
          active: newActive,
          lastUpdateDate : currentDate
      }

      let updateResponse = fetch(`/orderStatus/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderStatusToUpdate)
      })
      .then(response => response.json())
      .then(json => {
          onCancel();
          getOrderStatus();
          console.log("updateResponse = ", updateResponse);
      })    
    }

    const onEdit = (id, currentName, currentDescription, currentActive) => {
      setInEditMode({
        status: true,
        rowKey: id
      })    

      setName(currentName);
      setDescription(currentDescription);
      setActive(currentActive);
    }      
    
    const onSave = (id, newName, newDescription, newActive) => {
      updateOrderStatus(id, newName, newDescription, newActive);
    }
    
    const onCancel = () => {
      setInEditMode({
        status: false,
        rowKey: null
      })
    }
 
    //callback
    function handleOrderStatusFormClick(orderStatusFormData) {
        if (orderStatusFormData === "Success")  {
          getOrderStatus();     
        }
    }

    async function handleDeleteClick(itemID) {
      let deleteResponse = await fetch(`/orderStatus/${itemID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (deleteResponse.status === 200) {
        getOrderStatus();
      }  
    }

    const displayRows =rows.slice(rowsVisited, rowsVisited+rowsPerPage).map(row => {
      return (
        <tr key={row.name}>
            <td>{row.name}</td>
            <td>
                {
                inEditMode.status && inEditMode.rowKey === row._id ? (
                    <input value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    />
                ) : (row.description)                         
                }
            </td>
            <td>
                {
                inEditMode.status && inEditMode.rowKey === row._id ? (
                    <select value={active} onChange={(event) => setActive(event.target.value)}>
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                ) : (String(row.active))                         
                }
            </td>
            <td>{moment(row.dateAdded).format("MM/DD/yyyy hh:mm A")}</td>
            <td>{moment(row.lastUpdateDate).format("MM/DD/yyyy hh:mm A")}</td>
            <td>
              {
                inEditMode.status && inEditMode.rowKey === row._id ? (
                  <React.Fragment>
                    <button onClick={() => onSave(row._id, name, description, active)}>Save</button>
                    <button onClick={() => onCancel()}>Cancel</button>
                  </React.Fragment>
                ) : (<button value={row.name} onClick={() => onEdit(row._id, row.name, row.description, row.active)}><BsIcons.BsPencilSquare /></button>)       
              }                                       
              <button onClick={() => {handleDeleteClick(row._id)}} ><RiIcons.RiDeleteBinFill/></button>
            </td>
        </tr>
      )
    })
  
    return (
      <div>
        <div className="list-table">
          <h2>Order Status Maintanence</h2>
          <button className="add-ul" onClick={()=>setAddBtnPopupForm(true)}>New Order Status</button>
          <OrderStatusForm trigger={addBtnPopupForm} setTrigger={setAddBtnPopupForm} onOrderStatusFormClick={handleOrderStatusFormClick} />
          <table>
              <tbody>
                <tr><th>Name</th><th>Description</th><th>Active</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
                {displayRows}                
              </tbody>
          </table>
          <ReactPaginate
            previousLabel= {"Prev"} 
            nextLabel= {"Next"}
            pageCount= {pageCount}
            onPageChange = {changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName = {"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName= {"paginationActive"}
          />       
        </div>
      </div>
    )
}

export default OrderStatus;
