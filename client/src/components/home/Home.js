import { useEffect, useState } from 'react';
import MailBox from './MailBox'
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import './Home.css'

const LOCAL_STORAGE_KEY = "react-todo-list-todos";

const Home = () => {
    const [todos, setTodos]= useState([])
    const [customerCount, setCustomerCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)

    //populate todos when app initially renders
    useEffect(()=>{
        const storageTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storageTodos) {
      setTodos(storageTodos);
    }
  }, []);

    //everytime todos array changes, store that new data inside local storage
    useEffect(()=>{
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);
    
    const addTodo = (todo)=>{
        setTodos([todo, ...todos])
    }

    const toggleComplete =(id) =>{
        setTodos(todos.map(todo =>{
            if(todo.id === id){
                return { 
                    ...todo, 
                    completed: !todo.completed
                }
            }
            return todo;
        }))
    }
    
    const removeTodo =(id)=>{
        setTodos(todos.filter(todo=>todo.id !== id))
    }

   useEffect(()=>{
      //get customer count
      const getCustomer = async () => {
        let response = await fetch('/customer');
        let data = await response.json();

        let today= new Date();
        let thisMonth = today.getMonth() +1
        
        console.log("date",new Date(data[0].dateAdded).getMonth()+1)//5
        console.log("thismonth", thisMonth)//5

        let count= 0
        for (let i=0; i<data.length; i++){
            if((new Date(data[i].dateAdded).getMonth()+1) === thisMonth){
              count++  
            }
        }
        setCustomerCount(count)
        console.log("customer count:",customerCount)
    }
    getCustomer()
   }, [])
      
     useEffect(()=>{
        const getOrders = async () => {
            let response= await fetch('/order');
            let data = await response.json();

                let today= new Date();
                let thisMonth = today.getMonth() +1
                
                console.log("date",new Date(data[0].dateAdded).getMonth()+1)//5
                console.log("thismonth", thisMonth)//5
        
                //get order count
                let count=0
                for (let i=0; i<data.length; i++){
                    if((new Date(data[i].dateAdded).getMonth()+1) === thisMonth){
                       count++
                    }
                }
                setOrderCount(count)
                console.log("order count:",orderCount)
        }
        getOrders()
    }, [])

    return (
        <main>
            <div className="home-container">
                 <div className="home-title">
                     <div className="home-greeting">
                        <h1>Hello User</h1>
                        <p>Welcome to the dashboard</p>
                     </div>
                 </div>
                <div className="home-cards">
                    <div className="card card1">
                        <div className="card-inner">
                            <p className="smallcard-p">logo</p>  
                        </div>
                    </div>
                    <div className="card card2">
                        <div className="card-inner">
                            <p className="smallcard-p">New Orders</p>
                            <span className="count">{orderCount}</span>  
                        </div>
                    </div>
                    <div className="card card3">
                        <div className="card-inner">
                            <p className="smallcard-p">New Customers</p>
                            <span className="count">{customerCount}</span>  
                        </div>
                    </div>
                    <div className="card card4">
                        <div className="card-inner">
                            <p className="smallcard-p">Top Salesman</p>
                            <span className="count">name</span>  
                        </div>
                    </div>
                </div>


                <div className="big-cards">
                    <div className="big-card-left">
                        <div>
                            <TodoForm addTodo={addTodo}/>
                            <TodoList todos={todos} toggleComplete={toggleComplete} removeTodo={removeTodo}/>
                        </div>
                    </div>
                    <div className="big-card-right">
                        <div>
                            <MailBox />
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
 
export default Home;