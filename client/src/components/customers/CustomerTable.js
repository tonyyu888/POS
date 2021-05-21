// const Customers = () => {
//     return (
//         <div className="customers">
//             <h2>Customers</h2>
//         </div>
//     );
// }
 
// export default Customers;
import React, { useEffect, useState } from 'react';
import moment from "moment";
import './CustomerTable.css';
import CustomerForm from "./CustomerForm";
import ReactPaginate from 'react-paginate';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

const Customer = () => {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [inEditMode, setInEditMode] = useState({
      status: false,
      rowKey: null
    });
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [active, setActive] = useState("true");

    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage; 
    const pageCount = Math.ceil(rows.length /rowsPerPage);

    const changePage = ({selected})=>{
      setPageNumber(selected)
    }
    
    const updateCustomer = (id, newAddress1, newAddress2, newCity, newProvince, newPostalCode, newActive) => {
      let currentDate = new Date();
      let customerToUpdate = {
          address1: newAddress1,
          address2: newAddress2,
          city: newCity,
          province: newProvince,
          postalCode: newPostalCode,
          active: newActive,
          lastUpdateDate : currentDate
      }

      let updateResponse = fetch(`/customer/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerToUpdate)
      })
      .then(response => response.json())
      .then(json => {
          // reset inEditMode and unit price state values
          onCancel();
          // fetch the updated data
          getCustomer();
          console.log("updateResponse = ", updateResponse);
      })    
    }

    const onEdit = (id, currentAddress1, currentAddress2, currentCity, currentProvince, currentPostalCode, currentActive) => {
      setInEditMode({
        status: true,
        rowKey: id
      })    

      setAddress1(currentAddress1);
      setAddress2(currentAddress2);
      setCity(currentCity);
      setProvince(currentProvince);
      setPostalCode(currentPostalCode);
      setActive(currentActive);
    }      
    
    const onSave = (id, newAddress1, newAddress2, newCity, newProvince, newPostalCode, newActive) => {
      updateCustomer(id, newAddress1, newAddress2, newCity, newProvince, newPostalCode, newActive);
    }
    
    const onCancel = () => {
      setInEditMode({
        status: false,
        rowKey: null
      })
    }
 
    //callback
    function handleCustomerFormClick(customerFormDate) {
        if (customerFormDate === "Success")  {
          getCustomer();     
        }
    }

    async function handleDeleteClick(itemID) {
      let deleteResponse = await fetch(`/customer/${itemID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (deleteResponse.status === 200) {
        getCustomer();
      }  
      console.log('Create response is', deleteResponse)      
    }

    const getCustomer = async () => {
      // fetch uses the "proxy" value set in client/package.json
      let response = await fetch('/customer');
      let data = await response.json();
      setRows(data);
    };
    
    useEffect(() => {
      getCustomer();
    }, []);

    const displayRows =rows.slice(rowsVisited, rowsVisited+rowsPerPage).map(row => {
      return (
        <tr key={row.name}>
            <td>{row.name}</td>

            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={address1}
                  onChange={(event) => setAddress1(event.target.value)}
                />
              )  : (
                row.address1
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={address2}
                  onChange={(event) => setAddress2(event.target.value)}
                />
              )  : (
                row.address2
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              )  : (
                row.city
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={province}
                  onChange={(event) => setProvince(event.target.value)}
                />
              )  : (
                row.province
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                />
              )  : (
                row.postalCode
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (

                <select value={active} onChange={(event) => setActive(event.target.value)}>
                <option value="true">true</option>
                <option value="false">false</option>
                </select>

              )  : (
                String(row.active)
              )                         
            }</td>
            <td>{moment(row.dateAdded).format("MM/DD/yyyy hh:mm A")}</td>
            <td>{moment(row.lastUpdateDate).format("MM/DD/yyyy hh:mm A")}</td>
            <td>
              {
                inEditMode.status && inEditMode.rowKey === row._id ? (
                  <React.Fragment>
                    <button onClick={() => onSave(row._id, address1, address2, city, province, postalCode, active)}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => onCancel()}
                    >
                      Cancel
                    </button>
                  </React.Fragment>
                ) : (
                      <span><button value={row.address1} onClick={() => onEdit(row._id, row.address1, row.address2, row.city, row.province, row.postalCode, row.active)}
                      >
                        <BsIcons.BsPencilSquare />
                      </button></span>                                
                )       
              }                          
              <span className="slash">/</span>
              <button onClick={() => {handleDeleteClick(row._id)}} ><RiIcons.RiDeleteBinFill/></button>
            </td>
        </tr>
      )
    })
  
    return (
      <div>
        <div className="customer-table">
          <h2>Customer Maintanence</h2>
          <table>
              <tbody>
                <tr><th>Name</th><th>Address1</th><th>Address1</th><th>Address2</th><th>City</th><th>Province</th><th>Postal Code</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
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
        <div className="customerForm">
                <CustomerForm onCustomerFormClick={handleCustomerFormClick} />
        </div>
      </div>
    )
}

export default Customer
