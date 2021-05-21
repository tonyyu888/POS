import { useState , useEffect} from "react"
import './ProductForm.css';

const ProductForm = (props) => {
    let [name, setName] = useState()
    let [description, setDescription] = useState("")
    let [productCategory, setProductCategory] = useState([])
    let [productCategoryNameList, setProductCategoryNameList]= useState([])
    let [unitPrice, setUnitPrice] = useState(null)
    // let [supplier, setSupplier] = useState([])
    let [active, setActive] = useState("true")
    let [createError, setCreateError] = useState("")

    async function onCreateClicked() {
        let currentDate = new Date();
        let productToCreate = {
            name, 
            description,
            productCategory,
            unitPrice,
            // supplier,
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

            if (createResponse.status === 200) {
                props.onProductFormClick("Success");

                //temporary    
                setName("");
                setDescription("");
                //setProductCategory([])
                setUnitPrice(null)
                //setSupplier("")
                setActive("true");
            }

            // the server didn't like the data for some reason
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
            // the server cannot be reached
            console.error('Fetch failed to reach the server:', error)
        }
    }

    const onInputChange = (event, setFunction) => {
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value);
       
    };

     //fetch productCategory names
     const getProductCategoryNames = async () =>{
        let response= await fetch('/productCategory');
        let data = await response.json();        
        // let nameArray = data.map(item => item.name)
        //console.log("names:", nameArray)
        setProductCategoryNameList(data)  
    }

    useEffect(()=>{
        getProductCategoryNames()
    }, [])

    const onClickAdd = ()=>{
        onCreateClicked();
        props.setTrigger(false);
    }

    let createProductDataInvalid = !name || (name.trim().length === 0)

    return (props.trigger)? (
        <div className="createform">
            <div className="popup-in">
                <h4>Add a New Product</h4>
                <button className="closebtn" onClick={()=>props.setTrigger(false)}> close </button>
                {props.children}
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
                <select value={productCategory} onChange={(event) => onInputChange(event, setProductCategory)}>
                  {productCategoryNameList.map(item=><option value={item._id}>{item.name}</option>
                )} 
                </select>
            </div>
            <div>
            <label htmlFor="unitprice">Unit Price:</label>
            <input id="unitprice" value={unitPrice} onChange={(event)=> onInputChange(event,setUnitPrice)}/>
            </div>
            {/* <div>
            <label htmlFor="supplier">Supplier:</label> 
                <select value={supplier} onChange={(event) => onInputChange(event, setSupplier)}>
                supplier.map(())
                <option value="">{}</option>
                </select>
            </div> */}
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