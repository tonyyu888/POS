import { useState } from "react"

const ProductCategoryForm = ({onProductCategoryFromClick}) => {
    let [name, setName] = useState()
    let [description, setDescription] = useState()
    let [active, setActive] = useState()

    let [createError, setCreateError] = useState()

    async function onCreateClicked(e) {
         let currentDate = new Date();

        let productCategoryToCreate = {
            name, 
            description,
            active,
            dateAdded : currentDate,
            lastUpdateDate : currentDate
        }
        console.log('Creating Product Category with', productCategoryToCreate )
        try {
            let createResponse = await fetch('/productCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productCategoryToCreate)
            })

            if (createResponse.status === 200) {
                onProductCategoryFromClick("Success");
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

    let createProductCategoryDataInvalid = !name || (name.trim().length === 0)

    return (
        <div>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" value={name} onChange={(event) => onInputChange(event,setName)}/>
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input id="description" value={description} onChange={(event) => onInputChange(event,setDescription)}/>
            </div>
            <div>
                <label htmlFor="active">Active</label>
                <input id="active" value={active} onChange={(event) => onInputChange(event,setActive)}/>
            </div>
            <button disabled={ createProductCategoryDataInvalid } onClick={ onCreateClicked }>Create Product Category</button>
            { createError && <div>{createError}</div> }            
        </div>
    )
}

export default ProductCategoryForm