import { RiDeleteBinFill} from 'react-icons/ri';
import './Home.css'

function Todo({ todo, toggleComplete, removeTodo }) {
    function handleCheckboxClick() {
      toggleComplete(todo.id);
    }
  
    function handleRemoveClick() {
      removeTodo(todo.id);
    }

    return (
        <div className="todo" style={{display:"flex "}}>
            <input type="checkbox" onClick={handleCheckboxClick}/>
            <li 
            style={{
                textDecoration: todo.completed ? "line-through red"  : null
            }}>
                {todo.task}</li>
        
            <button onClick={handleRemoveClick}><RiDeleteBinFill/></button>
        </div>
       
    )
}
 
export default Todo;