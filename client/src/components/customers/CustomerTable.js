import React, { useEffect, useState } from 'react';
import moment from "moment";
import './table.css';
import CustomerForm from "./CustomerForm";
import ReactPaginate from 'react-paginate';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';
import * as SiIcons from 'react-icons/si';

const Customer = () => {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [addBtnPopupForm, setAddBtnPopupForm] = useState(false)
    const [inEditMode, setInEditMode] = useState({
      status: false,
      rowKey: null
    });

    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [contactNumber, setContactNumber] = useState([])
    const [contactPerson, setContactPerson] = useState([])
    const [emailAddress, setEmailAddress] = useState("");
    const [gstRate, setGstRate] = useState("")
    const [pstRate, setPstRate] = useState("")

    const [active, setActive] = useState("true");

    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage; 
    const pageCount = Math.ceil(rows.length /rowsPerPage);

    const changePage = ({selected})=>{
      setPageNumber(selected)
    }
    
    const updateCustomer = (id, newAddress1, newAddress2, newCity, newProvince, newPostalCode, newContactNumber, newContactPerson, newEmailAddress, newGstRate, newPstRate, newActive) => {
      let currentDate = new Date();
      let customerToUpdate = {
          address1: newAddress1,
          address2: newAddress2,
          city: newCity,
          province: newProvince,
          postalCode: newPostalCode,
          contactNumber: newContactNumber,
          contactPerson: newContactPerson,
          emailAddress: newEmailAddress,
          gstRate:newGstRate,
          pstRate:newPstRate,
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

    const onEdit = (id, currentAddress1, currentAddress2, currentCity, currentProvince, currentPostalCode, currentContactNumber, currentContactPerson, currentEmailAddress, currentGstRate, currentPstRate, currentActive) => {
      setInEditMode({
        status: true,
        rowKey: id
      })    

      setAddress1(currentAddress1);
      setAddress2(currentAddress2);
      setCity(currentCity);
      setProvince(currentProvince);
      setPostalCode(currentPostalCode); 
      setContactNumber(currentContactNumber);
      setContactPerson(currentContactPerson);           
      setEmailAddress(currentEmailAddress);
      setGstRate(currentGstRate);
      setPstRate(currentPstRate);
      setActive(currentActive);
    }      
    
    const onSave = (id, newAddress1, newAddress2, newCity, newProvince, newPostalCode, newContactNumber, newContactPerson, newEmailAddress, newGstRate, newPstRate, newActive) => {
      updateCustomer(id, newAddress1, newAddress2, newCity, newProvince, newPostalCode, newContactNumber, newContactPerson, newEmailAddress, newGstRate, newPstRate, newActive);
    }
    
    const onCancel = () => {
      setInEditMode({
        status: false,
        rowKey: null
      })
      getCustomer();
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
    }, [addBtnPopupForm]);

    const onContactNumberChange = (e, id, index) => {

      let newContactNumber = [...contactNumber]
      newContactNumber[index][e.target.name] = e.target.value 
      setContactNumber(newContactNumber); 

      let newRows = [...rows];

      for (let i=0; i< newRows.length; i++) {
        if (newRows[i]._id === id) {
          newRows[i].contactNumber = newContactNumber;
          break;
        }        
      }
 
      setRows(newRows);
    }

    const onContactPersonChange = (e, id, index) => {

      let newContactPerson = [...contactPerson]
      newContactPerson[index][e.target.name] = e.target.value 
      setContactPerson(newContactPerson); 

      let newRows = [...rows];

      for (let i=0; i< newRows.length; i++) {        
        if (newRows[i]._id === id) {
          newRows[i].contactPerson = newContactPerson;
          break;
        }        
      }

      setRows(newRows);
    }

    const onContactNumberAdd = (id) => {

      let newRows = [...rows];

      for (let i=0; i< newRows.length; i++) {
        if (newRows[i]._id === id) {
          newRows[i].contactNumber.push({name: "", phoneNumber: ""});
          setContactNumber(newRows[i].contactNumber);
          break;
        }        
      }
 
      setRows(newRows);
    }

    const onContactNumberDelete = (id, index) => {

      let newContactNumber = [...contactNumber];
      newContactNumber.splice(index, 1);
      setContactNumber(newContactNumber);

      let newRows = [...rows];

      for (let i=0; i< newRows.length; i++) {
        if (newRows[i]._id === id) {
          newRows[i].contactNumber = newContactNumber;
          break;
        }        
      }
 
      setRows(newRows);
    }

    const onContactPersonDelete = (id, index) => {

      let newContactPerson = [...contactPerson];
      newContactPerson.splice(index, 1);
      setContactPerson(newContactPerson);

      let newRows = [...rows];

      for (let i=0; i< newRows.length; i++) {
        if (newRows[i]._id === id) {
          newRows[i].contactPerson = newContactPerson;
          break;
        }        
      }
 
      setRows(newRows);
    }

    const onContactPersonAdd = (id) => {

      let newRows = [...rows];

      for (let i=0; i< newRows.length; i++) {

        if (newRows[i]._id === id) {
          newRows[i].contactPerson.push({firstName: "", lastName: ""});
          setContactPerson(newRows[i].contactPerson);
          break;
        }        
      }
 
      setRows(newRows);
    }

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


            <td>
              <table>
                <tbody>               
                  {               
                    row.contactNumber.map( (cn, index) => { 
                      return ( <tr key={index}>                          
                                  <td>{
                                        inEditMode.status && inEditMode.rowKey === row._id ? (
                                          <input name="name" value={contactNumber[index].name}
                                            onChange={(e) => onContactNumberChange(e, row._id, index)}
                                          />
                                        ) : (
                                          cn.name
                                        )                         
                                  }</td>
                                  <td>{
                                        inEditMode.status && inEditMode.rowKey === row._id ? (
                                          <input name="phoneNumber" value={contactNumber[index].phoneNumber}
                                            onChange={(e) => onContactNumberChange(e, row._id, index)}
                                          />
                                        ) : (
                                          cn.phoneNumber
                                        )                         
                                  }</td>
                                  {                              
                                    inEditMode.status && inEditMode.rowKey === row._id ? (
                                      <td>
                                        <button className="clear" onClick={ () => onContactNumberDelete(row._id, index) }><RiIcons.RiDeleteBinFill/></button>
                                      </td>
                                      )  : null  
                                  }                           
                              </tr> )
                    })
                  }
                  <tr>
                      {
                        inEditMode.status && inEditMode.rowKey === row._id ? (
                          <td>
                            <button className="clear" onClick={ () => onContactNumberAdd(row._id) }><SiIcons.SiAddthis/></button>
                          </td>
                        )  : null                
                      }                    
                  </tr>
                </tbody>          
              </table>
            </td>
            
            <td>
              <table>
                <tbody>              
                  {
                    row.contactPerson.map( (cp, index) => { 
                      return ( <tr key={index}>                          
                                <td>{
                                      inEditMode.status && inEditMode.rowKey === row._id ? (
                                        <input name="firstName" value={contactPerson[index].firstName}
                                          onChange={(e) => onContactPersonChange(e, row._id, index) }
                                        />                                 
                                      ) : (
                                        cp.firstName
                                      )                         
                                }
                                </td>
                                <td>{
                                      inEditMode.status && inEditMode.rowKey === row._id ? (
                                        <input name="lastName" value={contactPerson[index].lastName}
                                          onChange={ (e) => onContactPersonChange(e, row._id, index) }
                                        />
                                      ) : (
                                        cp.lastName
                                      )                         
                                }</td>
                                {
                                  inEditMode.status && inEditMode.rowKey === row._id ? (
                                    <td>
                                      <button className="clear" onClick={ () => onContactPersonDelete(row._id, index) }><RiIcons.RiDeleteBinFill/></button>
                                    </td>    
                                    )  : null
                                }      
                              </tr>
                              )
                    })
                  }
                  <tr>                    
                      {
                        inEditMode.status && inEditMode.rowKey === row._id ? (
                          <td>
                            <button className="clear" onClick={ () => onContactPersonAdd(row._id) }><SiIcons.SiAddthis/></button>
                          </td>
                        )  : null
                      }
                  </tr>
                </tbody>
              </table>
            </td>

            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                />
              )  : (
                row.emailAddress
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={gstRate}
                  onChange={(event) => setGstRate(event.target.value)}
                />
              )  : (
                row.gstRate
              )                         
            }</td>
            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={pstRate}
                  onChange={(event) => setPstRate(event.target.value)}
                />
              )  : (
                row.pstRate
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
                    <button onClick={() => onSave(row._id, address1, address2, city, province, postalCode,  contactNumber, contactPerson, emailAddress, gstRate, pstRate, active)}
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
                      <button value={row.address1} onClick={() => onEdit(row._id, row.address1, row.address2, row.city, row.province, row.postalCode,  row.contactNumber, row.contactPerson, row.emailAddress, row.gstRate, row.pstRate, row.active)}
                      >
                        <BsIcons.BsPencilSquare />
                      </button>                              
                )       
              }                          
              
              <button onClick={() => {handleDeleteClick(row._id)}} ><RiIcons.RiDeleteBinFill/></button>
            </td>
        </tr>
      )
    })
  
    return (
      <div>
        <div className="list-table">
          <h2>Customer Maintanence</h2>
          <button onClick={()=>setAddBtnPopupForm(true)}>New Customer</button>
          <CustomerForm trigger={addBtnPopupForm} setTrigger={setAddBtnPopupForm} onCustomerFormClick={handleCustomerFormClick} />
          <table>
              <tbody>
                <tr><th>Name</th><th>Address1</th><th>Address2</th><th>City</th><th>Province</th><th>Postal Code</th><th>Contact Number</th><th>Contact Person</th><th>Email Address</th><th>GST Rate</th><th>PST Rate</th><th>Active</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
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

export default Customer
