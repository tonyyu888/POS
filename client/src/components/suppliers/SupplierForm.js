import { useState } from "react"
import './SupplierForm.css';
import * as  AiIcons from 'react-icons/ai';
import * as  SiIcons from 'react-icons/si';
import * as  RiIcons from 'react-icons/ri';

const SupplierForm = ({onSupplierFromClick, trigger, setTrigger}) => {
    let [name, setName] = useState();
    let [address1, setAddress1] = useState("");
    let [address2, setAddress2] = useState("");   
    let [city, setCity] = useState("");
    let [province, setProvince] = useState("");
    let [postalCode, setPostalCode] = useState("");
    let [contactNumber, setContactNumber] = useState([]);
    let [contactPerson, setContactPerson] = useState([]);
    let [emailAddress, setEmailAddress] = useState("");
    let [active, setActive] = useState("true");
    let [createError, setCreateError] = useState("");

    async function onCreateClicked(e) {
        let currentDate = new Date();

        let supplierToCreate = {
            name,
            address1,
            address2,
            city,
            province,
            postalCode,
            contactNumber,
            contactPerson,
            emailAddress,
            active,
            dateAdded : currentDate,
            lastUpdateDate : currentDate
        }
        console.log('Creating Supplier with', supplierToCreate )

        try {
            let createResponse = await fetch('/supplier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(supplierToCreate)
            })

            if (createResponse.status === 200) {
                onSupplierFromClick("Success");

                //temporary    
                setName("");
                setAddress1("");
                setAddress2("");
                setCity("");
                setProvince("");
                setPostalCode("");
                setContactNumber([]);
                setContactPerson([]);
                setEmailAddress("");
                setActive("true");
            }

            // the server didn't like the data for some reason
            console.log('Create response is', createResponse)
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
            console.error('Fetch failed to reach the server.')
        }
    }

    const onInputChange = (event, setFunction) => {
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value);
    };

    const onContactNumberChange = (e, i) => {
        let newContactNumber = [...contactNumber]
        newContactNumber[i][e.target.name] = e.target.value 
        setContactNumber(newContactNumber); 
      }  
  
    const onContactNumberAdd = () =>  {      
        let newContactNumber = [...contactNumber]
        newContactNumber.push({name: "",  phoneNumber: ""})
        setContactNumber(newContactNumber);
    }

    const onContactNumberDelete = (index) => {
        let newContactNumber = [...contactNumber];
        newContactNumber.splice(index, 1);
        setContactNumber(newContactNumber);
    }

    const onContactPersonChange = (e, i) => {
        let newContactPerson = [...contactPerson]
        newContactPerson[i][e.target.name] = e.target.value 
        setContactPerson(newContactPerson); 
      }  
    
    const onContactPersonAdd = () =>  {      
        let newContactPerson = [...contactPerson]
        newContactPerson.push({firstName: "", lastName: ""})
        setContactPerson(newContactPerson);
    }

    const onContactPersonDelete = (index) => {
        let newContactPerson = [...contactPerson];
        newContactPerson.splice(index, 1);
        setContactPerson(newContactPerson);
    }

    const onClickAdd = ()=>{
        onCreateClicked();
        setTrigger(false);   
    }

    let createSupplierDataInvalid = !name || (name.trim().length === 0)

    return (trigger)?(
        <div className='createform'>
            <div className="popup-in">
                {console.log("Contact number state", contactNumber)}

                <h4>Add a New Supplier</h4>
                <button className="closebtn" onClick={()=>setTrigger(false)}><AiIcons.AiOutlineClose/></button>

                <div>
                    <label htmlFor="name">Name:</label>
                    <input id="name" value={name} onChange={(event) => onInputChange(event,setName)}/>
                </div>
                <div>
                    <label htmlFor="address1">Address 1:</label>
                    <input id="address1" value={address1} onChange={(event) => onInputChange(event,setAddress1)}/>
                </div>
                <div>
                    <label htmlFor="address2">Address 2:</label>
                    <input id="address2" value={address2} onChange={(event) => onInputChange(event,setAddress2)}/>
                </div>
                <div className="row">
                    <div className="col3">
                        <label htmlFor="city">City:</label>
                        <input id="city" value={city} onChange={(event) => onInputChange(event,setCity)}/>
                    </div>
                    <div className="col3">
                        <label htmlFor="province">Province:</label>
                        <input id="province" value={province} onChange={(event) => onInputChange(event,setProvince)}/>
                    </div>
                    <div className="col3">
                        <label htmlFor="postalCode">Postal Code:</label>
                        <input id="postalCode" value={postalCode} onChange={(event) => onInputChange(event,setPostalCode)}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col2">
                        <label htmlFor="contactNumber">Contact Number:</label>
                            <table>                      
                                <tbody>
                                    {
                                        contactNumber.map( (cn, index) => { 
                                            return ( <tr key={index}>                          
                                                        <td>{
                                                            <input name="name" value={cn.name} placeholder="Type"
                                                            onChange={ (e) => onContactNumberChange(e, index) }
                                                            />
                                                        }</td>
                                                        <td>{
                                                            <input name="phoneNumber" value={cn.phoneNumber} placeholder="Phone #"
                                                            onChange={ (e) => onContactNumberChange(e, index) }
                                                            />
                                                        }</td>
                                                        {   
                                                        <td>                            
                                                            <button className="clear" onClick={ () => onContactNumberDelete(index) }><RiIcons.RiDeleteBinFill/></button>
                                                        </td>
                                                        }            
                                                    </tr> )
                                        })
                                    }
                                    <tr>                                
                                        <td>
                                        <button onClick={ onContactNumberAdd }><SiIcons.SiAddthis/></button>
                                        </td>
                                    </tr>
                                </tbody>    
                            </table>            
                        </div>                   
                        <div className="col2">
                        <label htmlFor="contactPerson">Contact Person:</label>
                            <table>                      
                                <tbody>
                                    {
                                        contactPerson.map( (cn, index) => { 
                                            return ( <tr key={index}>                          
                                                        <td>{
                                                            <input name="firstName" value={cn.firstName} placeholder="First Name"
                                                            onChange={ (e) => onContactPersonChange(e, index) }
                                                            />
                                                        }</td>
                                                        <td>{
                                                            <input name="lastName" value={cn.lastName} placeholder="Last Name"
                                                            onChange={ (e) => onContactPersonChange(e, index) }
                                                            />
                                                        }</td>
                                                        {   
                                                        <td>                            
                                                            <button className="clear" onClick={ () => onContactPersonDelete(index) }><RiIcons.RiDeleteBinFill/></button>
                                                        </td>
                                                        }            
                                                    </tr> )
                                        })
                                    }
                                    <tr>                                
                                        <td>
                                        <button onClick={ onContactPersonAdd }><SiIcons.SiAddthis/></button>
                                        </td>
                                    </tr>
                                </tbody>    
                            </table>            
                        </div>            
                    </div> 

                <div>
                    <label htmlFor="emailAddress">Email Address:</label>
                    <input id="emailAddress" value={emailAddress} onChange={(event) => onInputChange(event,setEmailAddress)}/>
                </div>
                <div>
                    <label htmlFor="active">Active:</label>                
                    <select value={active} onChange={(event) => onInputChange(event, setActive)}>
                    <option value="true">true</option>
                    <option value="false">false</option>
                    </select>
                </div>
                <br/>            
                <button disabled={ createSupplierDataInvalid } onClick={onClickAdd }>Add Supplier</button>
                { createError && <div>{createError}</div> }            
            </div>
        </div>
    ):"";
}

export default SupplierForm