import { useEffect, useState } from "react";
import {SiAddthis} from 'react-icons/si';
import { v4 as uuidv4 } from 'uuid';
import './Home.css'

const TodoForm = ({addTodo}) => {
    const [todo, setTodo] = useState({
        id: "",
        task: "",
        completed: false
      });

    const handleInputChange = (e)=> {
        setTodo({ ...todo, task: e.target.value})
    }

   const handleSubmit = ()=> {
        //e.preventDefault()
        if(todo.task.trim()){ //get rid of whitespace in the string
            addTodo({...todo, id: uuidv4() })
            setTodo({ ...todo, tesk:""})
            console.log('todo:', todo)
        }
    }

    return (
        <div className="todo-form">
            <h1>TodoList</h1>
            <form onSubmit={handleSubmit}>
                <input name="task" type="text" value={todo.task} onChange={handleInputChange} placeholder="Add a Todo"/>
                <button type="submit"><SiAddthis/></button>
            </form>  
        </div>  
    );     
}
 
export default TodoForm;