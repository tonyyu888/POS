import { useEffect, useState } from 'react';
import MailBox from './MailBox'
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import {HiClipboardList} from 'react-icons/hi';
import {FaUserFriends} from 'react-icons/fa';
import {RiUserStarFill} from 'react-icons/ri';
import './Home.css'

const LOCAL_STORAGE_KEY = "react-todo-list-todos";

const Home = () => {
    const [todos, setTodos]= useState([])
    const [customerCount, setCustomerCount] = useState(0)
    const [orderCount, setOrderCount] = useState(0)
    const [bestGuy, setBestGuy] = useState('')

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
        
        // console.log("date",new Date(data[0].dateAdded).getMonth()+1)//5
        // console.log("thismonth", thisMonth)//5

        let count= 0
        for (let i=0; i<data.length; i++){
            if((new Date(data[i].dateAdded).getMonth()+1) === thisMonth){
              count++  
            }
        }
        setCustomerCount(count)
    }
    getCustomer()
   }, [])
      
     useEffect(()=>{
        const getOrders = async () => {
            let response= await fetch('/order');
            let data = await response.json();

                let today= new Date();
                let thisMonth = today.getMonth() +1
                
                // console.log("month of data",new Date(data[0].dateAdded).getMonth()+1)//5
                // console.log("thismonth", thisMonth)//6
        
                //get order count
                let Ocount=0
                for (let i=0; i<data.length; i++){
                    if((new Date(data[i].dateAdded).getMonth()+1) === thisMonth){
                       Ocount++
                    }
                }
                setOrderCount(Ocount)

                let Pcount = []
                for (let i=0; i<data.length; i++){
                    if((new Date(data[i].dateAdded).getMonth()+1) === thisMonth){
                        //thisMonthArr.push(data[i])
                        let objIndex = Pcount.findIndex((e) => e.person === data[i].salesPerson._id)

                        if (objIndex !== -1) {
                            Pcount[objIndex].count = Pcount[objIndex].count + 1
                        }
                        else {
                            Pcount.push({person:data[i].salesPerson._id, topPerson: data[i].salesPerson.firstName + " " + data[i].salesPerson.lastName, count:1});
                        }

                    } 
                }
                let topGuy = Pcount.reduce((p, c) => p.count > c.count ? p.topPerson : c.topPerson,0);
                setBestGuy(topGuy)
        }
        getOrders()
    }, [])

    return (
        <main>
            <div className="home-container">
                 <div className="home-title">
                     <div className="home-greeting">
                        <h1>Hello User</h1>
                        <p>Welcome to ftpPOS dashboard</p>
                     </div>
                 </div>
                <div className="home-cards">
                    <div className="card logo">
                        <div className="logo-image">logo</div>  
                    </div>
                    <div className="card card3">
                        <div className="card-inner">
                            <div className="labeling">
                                <p className="icons"><HiClipboardList/></p>
                                <p className="smallcard-p">New Orders</p>
                            </div>
                            <div className="counters">
                                <div className="count">{orderCount}</div>
                                <div className="small-text">this month</div>
                            </div>
                        </div>
                    </div>
                    <div className="card card3">
                        <div className="card-inner">
                            <div className="labeling">
                                <p className="icons"><FaUserFriends/></p>
                                <p className="smallcard-p">New Customers</p>
                            </div>
                            <div className="counters">
                                <div className="count">{customerCount}</div>
                                <div className="small-text">this month</div>
                            </div>
                        </div>
                    </div>
                    <div className="card card3">
                        <div className="card-inner">
                            <div className="labeling">
                                <p className="icons"><RiUserStarFill/></p>
                                <p className="smallcard-p">Top Salesman</p>
                            </div>
                            <div className="counters">
                                <div className="count">{bestGuy}</div>
                                <div className="small-text">this month</div>
                            </div>
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