import React, { useEffect, useState } from 'react';
import moment from "moment";
import './Table.css';
import ProductCategoryForm from "./ProductCategoryForm";
import ReactPaginate from 'react-paginate';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';

const ProductCategoryTable = () => {
    const [rows, setRows] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [addBtnPopupForm, setAddBtnPopupForm]= useState(false)
    const [inEditMode, setInEditMode] = useState({
      status: false,
      rowKey: null
    });
    const [description, setDescription] = useState("");
    const [active, setActive] = useState("true");

    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage; 
    const pageCount = Math.ceil(rows.length /rowsPerPage);

    const changePage = ({selected})=>{
      setPageNumber(selected)
    }
    
    const updateProductCategory = (id, newDescription, newActive) => {
      let currentDate = new Date();
      let productCategoryToUpdate = {
          description: newDescription,
          active: newActive,
          lastUpdateDate : currentDate
      }

      let updateResponse = fetch(`/productCategory/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productCategoryToUpdate)
      })
      .then(response => response.json())
      .then(json => {
          // reset inEditMode and unit price state values
          onCancel();
          // fetch the updated data
          getProductCategories();
          console.log("updateResponse = ", updateResponse);
      })    
    }

    const onEdit = (id, currentDescription, currentActive) => {
      setInEditMode({
        status: true,
        rowKey: id
      })    

      setDescription(currentDescription);
      setActive(currentActive);
    }      
    
    const onSave = (id, newDescription, newActive) => {
      updateProductCategory(id, newDescription, newActive);
    }
    
    const onCancel = () => {
      setInEditMode({
        status: false,
        rowKey: null
      })
    }
 
    //callback
    function handleProductCategoryFormClick(productCategoryFormData) {
        if (productCategoryFormData === "Success")  {
          getProductCategories();     
        }
    }

    async function handleDeleteClick(itemID) {
      let deleteResponse = await fetch(`/productCategory/${itemID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (deleteResponse.status === 200) {
        getProductCategories();
      }  
      console.log('Create response is', deleteResponse)      
    }

    const getProductCategories = async () => {
      // fetch uses the "proxy" value set in client/package.json
      let response = await fetch('/productCategory');
      let data = await response.json();
      setRows(data);
    };
    
    useEffect(() => {
      getProductCategories();
    }, [addBtnPopupForm]);

    const displayRows =rows.slice(rowsVisited, rowsVisited+rowsPerPage).map(row => {
      return (
        <tr key={row.name}>
            <td>{row.name}</td>

            <td>{
              inEditMode.status && inEditMode.rowKey === row._id ? (
                <input value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              )  : (
                row.description
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
                    <button onClick={() => onSave(row._id, description, active)}
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
                      <span><button value={row.description} onClick={() => onEdit(row._id, row.description, row.active)}
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
        <div className="list-table">
          <h2>Product Category Maintanence</h2>
          <button onClick={()=>setAddBtnPopupForm(true)}>New Product Category</button>
          <ProductCategoryForm trigger={addBtnPopupForm} setTrigger={setAddBtnPopupForm} onProductCategoryFromClick={handleProductCategoryFormClick} />
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

export default ProductCategoryTable
