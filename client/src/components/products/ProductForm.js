import { useState , useEffect} from "react"
import './Form.css';
import * as  AiIcons from 'react-icons/ai';
import * as  SiIcons from 'react-icons/si';
import * as  RiIcons from 'react-icons/ri';

const ProductForm = (props) => {
    let [name, setName] = useState()
    let [description, setDescription] = useState("")
    let [productCategory, setProductCategory] = useState([])
    let [productCategoryList, setProductCategoryList]= useState([])
    let [unitPrice, setUnitPrice] = useState()
    let [supplier, setSupplier] = useState([])
    let [supplierList, setSupplierList]= useState([])
    let [active, setActive] = useState("true")
    let [createError, setCreateError] = useState("")
   
    
     //fetch productCategory 
     const getProductCategoryList = async () =>{
        let response= await fetch('/productCategory');
        let data = await response.json();        
        setProductCategoryList(data)  
    }

    useEffect(()=>{
        getProductCategoryList()
    }, [])

     //fetch supplier 
     const getSupplierList = async () =>{
        let response= await fetch('/supplier');
        let data = await response.json();        
        setSupplierList(data)  
    }

    useEffect(()=>{
        getSupplierList()
    }, [])

    async function onCreateClicked() {
        let currentDate = new Date();
        let productToCreate = {
            name, 
            description,
            productCategory,
            unitPrice,
            supplier,
            active,
            dateAdded : currentDate,
            lastUpdateDate : currentDate
        }
        console.log('Creating a Product:', productToCreate )
        try {
            
            let createResponse = await fetch('/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productToCreate)
                
            })
            console.log('Creating a Product:', productToCreate )

            if (createResponse.status === 200) {
                props.onProductFormClick("Success");

                //temporary    
                setName("");
                setDescription("");
                setProductCategory([])
                setUnitPrice(null)
                setSupplier([])
                setActive("true");
                
            }
            console.log('Create response is:', createResponse)
            if (createResponse.status !== 200) {
                let errorMessage = await createResponse.text()
                console.log('We had an error.  it was: ', errorMessage)
                setCreateError(errorMessage)
            }
            else {
                setCreateError(undefined)
            }
        }
        catch (error) {
            console.error('Fetch failed to reach the server:', error)
        }
    }

    const onInputChange = (event, setFunction) => {
        console.log('event: ', event)
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value);   
    };

    //edit supplier
    const onSupplierChange = (e, i)=>{
        let newSupplier = [...supplier]
        console.log("e.target:", e.target)
        newSupplier[i][e.target.name]= e.target.value
        console.log("e.target.value:", e.target.value)
        console.log("newSupplier:", newSupplier)
        
        setSupplier(newSupplier)
    }

    const onSupplierAdd = () =>{
        let newSupplier = [...supplier]
        newSupplier.push({name:""})
        setSupplier(newSupplier)
    }

    const onSupplierDelete = (index) => {
        let newSupplier = [...supplier]
        newSupplier.splice(index, 1)
        setSupplier(newSupplier)
    }

    //edit product category
    const onProductCategoryChange = (e, i)=> {
        let newProductCategory= [...productCategory]
        newProductCategory[i][e.target.name]=e.target.value
        setProductCategory(newProductCategory)
    }

    const onProductCategoryAdd = ()=> {
        let newProductCategory = [...productCategory]
        newProductCategory.push({name:""})
        setProductCategory(newProductCategory)
        console.log('add productCategory:' , productCategory)

    }

    const onProductCategoryDelete =(index)=>{
        let newProductCategory = [...productCategory]
        newProductCategory.splice(index, 1)
        setProductCategory(newProductCategory)
    }

    const onClickAdd = ()=>{
        onCreateClicked();
        props.setTrigger(false);   
    }

    let createProductDataInvalid = !name || (name.trim().length === 0)

    return (props.trigger)? (
        <div className="createform">
            <div className="popup-in">
                <h4>Add a New Product</h4>
                <button className="closebtn" onClick={()=>props.setTrigger(false)}><AiIcons.AiOutlineClose/></button>
                
                <div>
                <label htmlFor="name">Name:</label>
                <input id="name" value={name} onChange={(event) => onInputChange(event,setName)}/>
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <input id="description" value={description} onChange={(event) => onInputChange(event,setDescription)}/>
            </div>
            <div>
            <label htmlFor="productcategory">Product Category:</label>
            <table>
                <tbody>
                    {
                        productCategory.map((pc, index)=>{
                            return (<tr key={index}>
                                <td>{
                                    <select name="_id" value={pc._id} onChange={(event)=> onProductCategoryChange(event, index)}>
                                        <option>--Select</option>
                                        {productCategoryList.map(item =><option key={item.name} value={item._id}>{item.name}</option>)}
                                    </select>
                                    }
                                </td>
                                {
                                <td>
                                    <button className="clear"
                                    onClick ={()=> onProductCategoryDelete(index)}><RiIcons.RiDeleteBinFill/></button>
                                </td>
                                }
                            </tr>)
                        })
                    }
                    <tr>
                        <td>
                            <button onClick={onProductCategoryAdd}><SiIcons.SiAddthis/></button>
                        </td>
                    </tr>
                </tbody>
            </table>   
            </div>

            <div>
            <label htmlFor="unitprice">Unit Price:</label>
            <input id="unitprice" value={unitPrice} placeholder="Enter in Numbers" onChange={(event)=> onInputChange(event,setUnitPrice)}/>
            </div>
           
            <div>
            <label htmlFor="supplier">Supplier:</label> 
            <table>
                <tbody>
                    {
                        supplier.map((s, index) =>{
                            return (<tr key={index}>
                                <td>{
                                        <select  name="_id" value={s._id} onChange={(event) => onSupplierChange(event, index)}>
                                        <option>--Select--</option>
                                        {supplierList.map(item=><option key={item.name} value={item._id}>{item.name}</option>)}
                                        </select>
                                    }
                                </td>
                                {
                                    <td>
                                        <button className="clear"
                                        onClick ={()=> onSupplierDelete(index)} ><RiIcons.RiDeleteBinFill/></button>
                                    </td>
                                }
                            </tr>)
                        })
                    }
                     <tr>
                         <td>
                             <button onClick= {onSupplierAdd}><SiIcons.SiAddthis/></button>
                         </td>
                    </tr>   
                </tbody>
            </table>
            </div>

            <div>
                <label htmlFor="active">Active:</label>                
                <select value={active} onChange={(event) => onInputChange(event, setActive)}>
                <option value="true">true</option>
                <option value="false">false</option>
                </select>
            </div>
            <br/>            
            <button disabled={ createProductDataInvalid } onClick={ onClickAdd } >Add Product</button>
            { createError && <div>{createError}</div> }  
            </div>          
        </div>
    ): "";
}
 
export default ProductForm;