import React, { useEffect, useState } from 'react';
import './ProductCategoryTable.css';

const ProductCategoryTable = () => {
    const [rows, setRows] = useState([]);
  
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
      };
      getProductCategories();
    }, []);
  
    return (
      <div className="productCategory-table">
        <table>
            <tbody>
              <tr><th>Name</th><th>Description</th><th>Active</th><th>Date Added</th><th>Last Update</th></tr>
              {rows.map((row) => {
                  return (
                    <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.description}</td>
                        <td>{row.active.toString()}</td>
                        <td>{row.dateAdded}</td>
                        <td>{row.lastUpdateDate}</td>
                    </tr>
                  )
              })}                
            </tbody>
        </table>
      </div>
    )
  }

export default ProductCategoryTable