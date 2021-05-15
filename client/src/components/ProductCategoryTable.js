import React, { useEffect, useState } from 'react';
import moment from "moment";

import './ProductCategoryTable.css';

import ProductCategoryForm from "./ProductCategoryForm";

const ProductCategoryTable = () => {
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState("");
  
    //callback
    function handleProductCategoryFormClick(productCategoryFormDate) {

        if (productCategoryFormDate === "Success")  {
          setStatus(productCategoryFormDate);          
        }
    }

    useEffect(() => {
      const getProductCategories = async () => {
        // fetch uses the "proxy" value set in client/package.json
        console.log('1')
        let response = await fetch('/productCategory');
        console.log('2',response)
        let data = await response.json();
        console.log('3 data=',data)
        setRows(data);
        console.log('4')

        setStatus(undefined);
      };
      getProductCategories();
    }, [status]);
  
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
                          <td>{row.description}</td>
                          <td>{row.active.toString()}</td>
                          <td>{moment(row.dateAdded).format("MM/DD/yyyy hh:mm A")}</td>
                          <td>{moment(row.lastUpdateDate).format("MM/DD/yyyy hh:mm A")}</td>
                          <td>
                            <button>Edit</button> /
                            <button>Delete</button>
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