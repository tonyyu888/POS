import React, { useEffect, useState } from 'react';
import moment from "moment";
import './ProductCategoryTable.css';
import ProductCategoryForm from "./ProductCategoryForm";

const ProductCategoryTable = () => {
    const [rows, setRows] = useState([]);
    const [inEditMode, setInEditMode] = useState({
      status: false,
      rowKey: null
    });

    const [description, setDescription] = useState("");
    const [active, setActive] = useState("true");
    
    const updateProductCategory = ({id, newDescription, newActive}) => {
      let currentDate = new Date();
      let productCategoryToUpdate = {
          description,
          active,
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

//    const onEdit = ({id, currentDescription, currentActive}) => {
    const onEdit = (id, currentDescription, currentActive) => {
      setInEditMode({
        status: true,
        rowKey: id
      })    

      setDescription(currentDescription);
      setActive(currentActive);
    }      
    
    const onSave = ({id, newDescription, newActive}) => {
      updateProductCategory({id, newDescription, newActive});
    }
    
    const onCancel = () => {
      setInEditMode({
        status: false,
        rowKey: null
      })
    }
 
    //callback
    function handleProductCategoryFormClick(productCategoryFormDate) {
        if (productCategoryFormDate === "Success")  {
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
    }, []);
  
    return (
      <div>
        <div className="productCategory-table">
          <h2>Product Category Maintanence</h2>
          <table>
              <tbody>
                <tr><th>Name</th><th>Description</th><th>Active</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
                {rows.map((row) => {
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
                                  <button onClick={() => onSave({id: row._id, newDescription: description, newActive: active})}
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
                                    <button value={row.description} onClick={() => onEdit(row._id, row.description, row.active)}
                                    >
                                      Edit
                                    </button>                                
                              )       
                            }                          
                            /
                            <button onClick={() => {handleDeleteClick(row._id)}} >Delete</button>
                          </td>
                      </tr>
                    )
                })}                
              </tbody>
          </table>
        </div>
        <div className="productCategoryForm">
                <ProductCategoryForm onProductCategoryFromClick={handleProductCategoryFormClick} />
        </div>
      </div>
    )
}

export default ProductCategoryTable