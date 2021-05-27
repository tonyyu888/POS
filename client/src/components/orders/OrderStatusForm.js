import { useState } from "react"
import './Form.css';
import * as AiIcons from 'react-icons/ai';

const OrderStatusForm = (props) => {
    let [name, setName] = useState("")
    let [description, setDescription] = useState("")
    let [active, setActive] = useState("true")
    let [createError, setCreateError] = useState("")

    async function onCreateClicked(e) {
        let currentDate = new Date();

        let orderStatusToCreate = {
            name, 
            description,
            active,
            dateAdded : currentDate,
            lastUpdateDate : currentDate
        }
        try {
            let createResponse = await fetch('/orderStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderStatusToCreate)
            })

            if (createResponse.status === 200) {                
                props.onOrderStatusFormClick("Success");
                setName("");
                setDescription("");
                setActive("true");
            }

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
            console.error('Fetch failed to reach the server, error: ', error)
        }
    }

    const onClickAdd=()=>{
        onCreateClicked();
        props.setTrigger(false);
    }

    const onInputChange = (event, setFunction) => {
        setFunction(event.target.value);
    };

    let createOrderStatusDataInvalid = !name || (name.trim().length === 0)

    return (props.trigger)? (
        <div className='createform'>
            <div className="popup-in">
                <h4>Add a Order Status record</h4>
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
                    <label htmlFor="active">Active:</label>                
                    <select value={active} onChange={(event) => onInputChange(event, setActive)}>
                    <option value="true">true</option>
                    <option value="false">false</option>
                    </select>
                </div>
                <br/>            
                <button disabled={ createOrderStatusDataInvalid } onClick={ onClickAdd }>Add Order Status</button>
                { createError && <div>{createError}</div> }            
            </div>
        </div>
    ): "";
}

export default OrderStatusForm