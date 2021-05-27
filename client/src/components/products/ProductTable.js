import React, {useEffect, useState} from 'react';
import ProductForm from './ProductForm';
import moment from "moment";
import ReactPaginate from 'react-paginate';
import * as  BsIcons from 'react-icons/bs';
import * as  RiIcons from 'react-icons/ri';
import * as  SiIcons from 'react-icons/si';
import './Table.css';


const ProductTable = () => {
    const [rows, setRows]= useState([]);
    const [inEditMode, setInEditMode] = useState({status:false, rowKey:null})
    const [pageNumber, setPageNumber]= useState(0)
    const [addBtnPopupForm, setAddBtnPopupForm] = useState(false)

    const [description, setDescription] = useState("")
    const [productCategory, setProductCategory] = useState([])
    const [productCategoryList, setProductCategoryList] = useState([])
    const [unitPrice, setUnitPrice] = useState(null)
    const [supplier, setSupplier] = useState([])
    const [supplierList, setSupplierList]= useState([])
    const [active, setActive]= useState('true');
    
    const rowsPerPage = 10;
    const rowsVisited = pageNumber * rowsPerPage;
    const pageCount = Math.ceil(rows.length / rowsPerPage);

  
    const changePage = ({selected}) =>{
        setPageNumber(selected)
    }

    //fetch data and set rows
    const getProducts = async () =>{
        let response= await fetch('/product');
        let data = await response.json();
        console.log("data:", data)
        setRows(data)
    }

    useEffect(()=>{
        getProducts()
    }, [addBtnPopupForm])

    //update a Product
    let updateProduct = (id, newDescription, newProductCategory, newUnitPrice, newSupplier, newActive) =>{
        let currentDate = new Date();
        let productToUpdate = {
            description: newDescription,
            productCategory: newProductCategory,
            unitPrice: newUnitPrice,
            supplier: newSupplier,
            active: newActive,
            lastUpdateDate: currentDate
        }
        let updateResponse = fetch(`/product/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(productToUpdate)
        }).then(response => response.json())
        .then(json => {
            onCancel(); //reset inEditMode  values
            getProducts(); //fetch the updated data
            console.log("updateResponse:", updateResponse)
        })
    }

    const onEdit = (id, currentDescription, currentProductCategory, currentUnitPrice, currentSupplier, currentActive) =>{
        setInEditMode({status: true, rowKey: id})
        
        setDescription(currentDescription)
        setProductCategory(currentProductCategory)
        setUnitPrice(currentUnitPrice)
        setSupplier(currentSupplier)
        setActive(currentActive);
    }

    const onSave = (id, newDescription, newProductCategory, newUnitPrice, newSupplier, newActive) => {
        updateProduct(id, newDescription,newProductCategory, newUnitPrice, newSupplier, newActive)
    }
    
    const onCancel =() =>{
        setInEditMode({status:false, rowKey:null});

        getProducts()
    }

    //delete a row
    const handleDeleteClick = async (itemId)=> {
        let deleteResponse = await fetch(`/product/${itemId}`, {
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json'}
        })
        if(deleteResponse.status === 200){
            getProducts()
        }
        console.log('deleteResponse:',deleteResponse );
    }

    const handleProductFormClick = (productFormData) => {
        if(productFormData === 'success'){
            getProducts()
        }
    }

     //fetch supplierlist 
     const getSupplierList = async () =>{
        let response= await fetch('/supplier');
        let data = await response.json();        
        setSupplierList(data)  
    }

    useEffect(()=>{
        getSupplierList()
    }, [])

       //fetch productCategorylist 
       const getProductCategoryList = async () =>{
        let response= await fetch('/productCategory');
        let data = await response.json();        
        setProductCategoryList(data)  
    }

    useEffect(()=>{
        getProductCategoryList()
    }, [])

    //edit Supplier
    const onSupplierChange = (e, id , index)=> {

        let newSupplier = [...supplier]
        newSupplier[index] = e.target.value
        setSupplier(newSupplier)

        let newRows = [...rows]

        for(let i=0; i<newRows.length; i++){
            if(newRows[i]._id ===id){
                newRows[i].supplier= newSupplier
                break
            }
        }
        setRows(newRows)
    }

    const onSupplierAdd = (id)=>{
        let newRows = [...rows]

        for(let i=0; i<newRows.length; i++){
            if(newRows[i]._id ===id){
                newRows[i].supplier.push({name:""})
                setSupplier(newRows[i].supplier)
                break
            }
        }
        setRows(newRows)
    }

    const onSupplierDelete = (id, index) => {

        let newSupplier = [...supplier];
        newSupplier.splice(index, 1);
        setSupplier(newSupplier);
  
        let newRows = [...rows];
  
        for (let i=0; i< newRows.length; i++) {
          if (newRows[i]._id === id) {
            newRows[i].supplier = newSupplier;
            break;
          }        
        }
   
        setRows(newRows);
      }
  
      //edit productCategory
      const onProductCategoryChange = (e, id, index)=>{
          let newProductCategory = [...productCategory]

          newProductCategory[index]= e.target.value
          setProductCategory(newProductCategory)

          let newRows = [...rows]
          for(let i=0; i<newRows.length; i++){
              if(newRows[i]._id === id){
                  newRows[i].productCategory = newProductCategory
                  break;
              }
          }
          setRows(newRows)
      }

      const onProductCategoryAdd = (id)=>{
        let newRows = [...rows]

        for(let i=0; i<newRows.length; i++){
            if(newRows[i]._id === id){
                newRows[i].productCategory.push({name:""})
                setProductCategory(newRows[i].productCategory)
                break
            }
        }
        setRows(newRows)
      }

      const onProductCategoryDelete = (id, index)=>{
        let newProductCategory = [...productCategory];
        newProductCategory.splice(index, 1);
        setProductCategory(newProductCategory);
  
        let newRows = [...rows];
  
        for (let i=0; i< newRows.length; i++) {
          if (newRows[i]._id === id) {
            newRows[i].productCategory = newProductCategory;
            break;
          }        
        }
   
        setRows(newRows);
      }
      

    const displayRows = rows.slice(rowsVisited, rowsVisited+rowsPerPage).map(row => {
        return(
            <tr key= {row.name}>
                <td>{row.name}</td>
                <td>{
                    inEditMode.status && inEditMode.rowKey === row._id ?(
                    <input value={description} onChange={(e)=> setDescription(e.target.value)} />
                ):(
                    row.description
                )}
                </td>
                <td>
                    <table className="inner-table">
                        <tbody>
                            {row.productCategory.map((pc, index)=>{
                                return(<tr key={index}>
                                    <td>{
                                        inEditMode.status && inEditMode.rowKey === row._id ? (
                                            <select name="_id" value={productCategory[index]._id} onChange={(e) => onProductCategoryChange(e, row._id, index)}>
                                                <option>--Select--</option>
                                                {productCategoryList.map(item=><option key={item.name} value={item._id}>{item.name}</option>)}
                                            </select>
                                        ):(
                                            pc.name
                                        )
                                        }</td>
                                        {
                                            inEditMode.status && inEditMode.rowKey === row._id ? (
                                                <td>
                                                    <button className="clear" onClick={() => onProductCategoryDelete(row._id, index)}><RiIcons.RiDeleteBinFill/></button>
                                                </td>
                                            ): null
                                        }
                                </tr>)
                            })}
                            <tr>{
                                inEditMode.status && inEditMode.rowKey === row._id ? (
                                <td>
                                    <button className="clear" onClick={() => onProductCategoryAdd(row._id) }><SiIcons.SiAddthis/></button>
                                </td>
                                )  : null                
                            }    
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td>{
                    inEditMode.status && inEditMode.rowKey === row._id ?(
                    <input value={unitPrice} onChange= {(e)=> setUnitPrice(e.target.value)} />
                    ):(
                        row.unitPrice
                    )}
                </td>
                <td>
                    <table className="inner-table">
                        <tbody>
                            {row.supplier.map((s, index)=>{
                                    return(<tr key={index}>
                                        <td>{
                                            inEditMode.status && inEditMode.rowKey === row._id ? (
                                                <select name="_id" value={supplier[index]._id} onChange={(e) => onSupplierChange(e, row._id, index)}>
                                                <option >--Select--</option>
                                                {supplierList.map(item=><option key={item.name} value={item._id}>{item.name}</option>)}
                                                </select>
                                            ):(
                                                s.name
                                            )
                                        }</td>
                                        {
                                            inEditMode.status && inEditMode.rowKey === row._id ? (
                                            <td>    
                                                <button className="clear" onClick={() => onSupplierDelete(row._id, index) }><RiIcons.RiDeleteBinFill/></button>  
                                            </td>
                                            ) : null
                                        }                                        
                                        </tr>)
                                })
                            }
                            <tr>{
                                inEditMode.status && inEditMode.rowKey === row._id ? (
                                <td>
                                    <button className="clear" onClick={() => onSupplierAdd(row._id) }><SiIcons.SiAddthis/></button>
                                </td>
                                )  : null                
                            }    
                            </tr>
                        </tbody>
                    </table>   
                </td>
                <td>{
                    inEditMode.status && inEditMode.rowKey === row._id ? (
                        <select>
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    ) : (
                        String(row.active)
                    )}  
                </td>
                <td>{moment(row.dateAdded).format("MM/DD/yyyy hh:mm A")}</td>
                <td>{moment(row.lastUpdateAdded).format("MM/DD/yyyy hh:mm A")}</td>
                <td>
                    {
                       inEditMode.status && inEditMode.rowKey === row._id ? (
                        <React.Fragment>
                            <button onClick = {() => onSave(row._id, description, productCategory, unitPrice, supplier, active)}>Save</button>
                            <button onClick = {() => onCancel()}>Cancel</button>
                        </React.Fragment>
                       ) : (
                           <button value={row.description} onClick={() => onEdit(row._id, row.description, row.productCategory, row.unitPrice, row.supplier, row.active)}><BsIcons.BsPencilSquare /></button>
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
                <h2>Product Maintanence</h2>
                <button className="add-p" onClick={()=>setAddBtnPopupForm(true)}>New Product</button>
                <ProductForm trigger={addBtnPopupForm} setTrigger={setAddBtnPopupForm} onProductFormClick = {handleProductFormClick} />
                <table>
                    <tbody>
                        <tr><th>Name</th><th>Description</th><th>Product Category</th><th>Unit Price</th><th>Supplier</th><th>Active</th><th>Date Added</th><th>Last Update</th><th>Action</th></tr>
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
        
    )
}
 
export default ProductTable;