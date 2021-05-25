import { useState } from "react"
import './Form.css';
import * as AiIcons from 'react-icons/ai';

const UserLevelForm = (props) => {
    let [name, setName] = useState()
    let [level, setLevel] = useState()
    let [active, setActive] = useState("true")
    let [createError, setCreateError] = useState("")

    async function onCreateClicked(e) {
        let currentDate = new Date();

        let userLevelToCreate = {
            name, 
            level,
            active,
            dateAdded : currentDate,
            lastUpdateDate : currentDate
        }
        console.log('Creating User Level with', userLevelToCreate )
        try {
            let createResponse = await fetch('/userLevel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userLevelToCreate)
            })

            if (createResponse.status === 200) {
                props.onUserLevelFromClick("Success");

                //temporary    
                setName("");
                setLevel(null);
                setActive("true");
            }

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

    const onClickAdd=()=>{
        onCreateClicked();
        props.setTrigger(false);
    }


    const onInputChange = (event, setFunction) => {
        console.log('Changing input to be ', event.target.value)
        setFunction(event.target.value);
    };

    let createUserLevelDataInvalid = !name || (name.trim().length === 0)

    return (props.trigger)? (
        <div className='createform'>
            <div className="popup-in">
                <h4>Add a New Product Category</h4>
                <button className="closebtn" onClick={()=>props.setTrigger(false)}><AiIcons.AiOutlineClose/></button>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input id="name" value={name} onChange={(event) => onInputChange(event,setName)}/>
                </div>
                <div>
                    <label htmlFor="level">Level:</label>
                    <input id="level" value={level} onChange={(event) => onInputChange(event,setLevel)}/>
                </div>
                <div>
                    <label htmlFor="active">Active:</label>                
                    <select value={active} onChange={(event) => onInputChange(event, setActive)}>
                    <option value="true">true</option>
                    <option value="false">false</option>
                    </select>
                </div>
                <br/>            
                <button disabled={ createUserLevelDataInvalid } onClick={ onClickAdd }>Add User Level</button>
                { createError && <div>{createError}</div> }            
            </div>
        </div>
    ): "";
}

export default UserLevelForm