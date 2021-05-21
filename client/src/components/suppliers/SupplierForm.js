import { useState } from "react"
import './SupplierForm.css';

const SupplierForm = ({onSupplierFromClick}) => {
    let [name, setName] = useState();
    let [address1, setAddress1] = useState("");
    let [address2, setAddress2] = useState("");   
    let [city, setCity] = useState("");
    let [province, setProvince] = useState("");
    let [postalCode, setPostalCode] = useState("");
    let [contactNumber, setContactNumber] = useState([]);
    let [contactPerson, setContactPerson] = useState([]);
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

    let createSupplierDataInvalid = !name || (name.trim().length === 0)

    return (
        <div className='create-form'>
            <h4>Add a New Supplier</h4>
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
            <div>
                <label htmlFor="city">City:</label>
                <input id="city" value={city} onChange={(event) => onInputChange(event,setCity)}/>
            </div>
            <div>
                <label htmlFor="province">Province:</label>
                <input id="province" value={province} onChange={(event) => onInputChange(event,setProvince)}/>
            </div>
            <div>
                <label htmlFor="postalCode">Postal Code:</label>
                <input id="postalCode" value={postalCode} onChange={(event) => onInputChange(event,setPostalCode)}/>
            </div>
            <div>
                <label htmlFor="active">Active:</label>                
                <select value={active} onChange={(event) => onInputChange(event, setActive)}>
                <option value="true">true</option>
                <option value="false">false</option>
                </select>
            </div>
            <br/>            
            <button disabled={ createSupplierDataInvalid } onClick={ onCreateClicked }>Add Supplier</button>
            { createError && <div>{createError}</div> }            
        </div>
    )
}

export default SupplierForm