import React, {useEffect, useState} from 'react';
import ProductForm from './ProductForm';
import moment from "moment";
import ReactPaginate from 'react-paginate';
import * as  BsIcons from 'react-icons/bs';
import * as  RiIcons from 'react-icons/ri';
import './ProductTable.css';


const ProductTable = () => {
    const [rows, setRows]= useState([]);
    const [inEditMode, setInEditMode] = useState({status:false, rowKey:null})
    const [description, setDescription] = useState("")
    const [unitPrice, setUnitPrice] = useState(null)
    const [active, setActive]= useState('true');
    //const [suppliier, setSupplier] = useState()
    const [pageNumber, setPageNumber]= useState(0)
    const [addBtnPopupForm, setAddBtnPopupForm] = useState(false)

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
    let updateProduct = (id, newDescription, newUnitPrice, newActive) =>{
        let currentDate = new Date();
        let productToUpdate = {
            description: newDescription,
            unitPrice: newUnitPrice,
            // supplier: newSupplier,
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
            oncancel(); //reset inEditMode  values
            getProducts(); //fetch the updated data
            console.log("updateResponse:", updateResponse)
        })
    }

    const onEdit = (id, currentDescription, currentUnitPrice, currentActive) =>{
        setInEditMode({status: true, rowKey: id})
        setDescription(currentDescription)
        // add a click event for product catagory to take it to it's main page
        setUnitPrice(currentUnitPrice)
        //setSupplier(currentSupplier)
        setActive(currentActive);

    }

    const onSave = (id, newDescription, newUnitPrice, newActive) => {
        updateProduct(id, newDescription, newUnitPrice, newActive)
        //updateProduct(id, newDescription, newUnitPrice, newSupplier, newActive)
    }

    const onCancel =() =>{
        setInEditMode({status:false, rowKey:null});
    }

    //delete a row
    const handleDeleteClick = async (itemId)=> {
        let deleteResponse = await fetch(`/product/${itemId}`, {
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(deleteResponse.status === 200){
            getProducts()
        }
        console.log('deleteResponse:',deleteResponse );
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
                    <p>{row.productCategory.name} </p>
                </td>
                <td>{
                    inEditMode.status && inEditMode.rowKey === row._id ?(
                    <input value={unitPrice} onChange= {(e)=> setUnitPrice(e.target.value)} />
                    ):(
                        row.unitPrice
                    )}
                </td>
                <td>
                    <p>{row.supplier.name}</p>
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
                            <button onClick = {() => onSave(row._id, description,unitPrice, active)}>Save</button>
                            <button onClick = {() => onCancel()}>Cancel</button>
                        </React.Fragment>
                       ) : (
                           <span><button value={row.description} onClick={() => onEdit(row._id, row.description,row.unitPrice, row.active)}><BsIcons.BsPencilSquare /></button></span>
                       )
                    }
                    <span className='slash'>/</span>
                    <button onClick={() => {handleDeleteClick(row._id)}}><RiIcons.RiDeleteBinFill/></button>
                </td> 
            </tr>
        )
    })

    const handleProductFormClick = (productForm) => {
        if(productForm === 'success'){
            getProducts()
        }
    }


    return (
        <div>
            <div className="product-table">
                <h2>Products</h2>
                <button className="product-form" onClick={()=>setAddBtnPopupForm(true)}>New Product</button>
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
            {/* <div className="productForm">
                <ProductForm onProductFormClick = {handleProductFormClick} />
            </div> */}
        </div>
        
    );
}
 
export default ProductTable;