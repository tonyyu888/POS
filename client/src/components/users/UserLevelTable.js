import React, { useEffect, useState } from 'react';
import moment from "moment";
import './Table.css';
import UserLevelForm from "./UserLevelForm";
import ReactPaginate from 'react-paginate';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

const UserLevelTable = () => {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [addBtnPopupForm, setAddBtnPopupForm]= useState(false)
    const [inEditMode, setInEditMode] = useState({status: false, rowKey: null});
    
    const [level, setLevel] = useState(null);
    const [active, setActive] = useState("true");

    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage; 
    const pageCount = Math.ceil(rows.length /rowsPerPage);

    const changePage = ({selected})=>{
      setPageNumber(selected)
    }

    const getUserLevel = async () => {
        // fetch uses the "proxy" value set in client/package.json
        let response = await fetch('/userLevel');
        let data = await response.json();
        setRows(data);
      };
      
      useEffect(() => {
        getUserLevel();
      }, [addBtnPopupForm]);
    
    const updateUserLevel = (id, newLevel, newActive) => {
      let currentDate = new Date();
      let userLevelToUpdate = {
          level: newLevel,
          active: newActive,
          lastUpdateDate : currentDate
      }

      let updateResponse = fetch(`/userLevel/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLevelToUpdate)
      })
      .then(response => response.json())
      .then(json => {
          // reset inEditMode and unit price state values
          onCancel();
          // fetch the updated data
          getUserLevel();
          console.log("updateResponse = ", updateResponse);
      })    
    }

    const onEdit = (id, currentLevel, currentActive) => {
      setInEditMode({
        status: true,
        rowKey: id
      })    

      setLevel(currentLevel);
      setActive(currentActive);
    }      
    
    const onSave = (id, newLevel, newActive) => {
      updateUserLevel(id, newLevel, newActive);
    }
    
    const onCancel = () => {
      setInEditMode({
        status: false,
        rowKey: null
      })
    }
 
    //callback
    function handleUserLevelFormClick(userLevelFormData) {
        if (userLevelFormData === "Success")  {
          getUserLevel();     
        }
    }

    async function handleDeleteClick(itemID) {
      let deleteResponse = await fetch(`/userLevel/${itemID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (deleteResponse.status === 200) {
        getUserLevel();
      }  
      console.log('Create response is', deleteResponse)      
    }

    const displayRows =rows.slice(rowsVisited, rowsVisited+rowsPerPage).map(row => {
      return (
        <tr key={row.name}>
            <td>{row.name}</td>

            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={level}
                  onChange={(event) => setLevel(event.target.value)}
                />
              )  : (
                row.level
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
                    <button onClick={() => onSave(row._id, level, active)}
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
                      <button value={row.level} onClick={() => onEdit(row._id, row.level, row.active)}
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
          <h2>User Level Maintanence</h2>
          <button className="add-ul" onClick={()=>setAddBtnPopupForm(true)}>New User Level</button>
          <UserLevelForm trigger={addBtnPopupForm} setTrigger={setAddBtnPopupForm} onUserLevelFromClick={handleUserLevelFormClick} />
          <table>
              <tbody>
                <tr><th>Name</th><th>Level</th><th>Active</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
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

export default UserLevelTable;
