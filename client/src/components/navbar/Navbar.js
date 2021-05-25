import { useState } from 'react';
import {Link} from 'react-router-dom'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import * as ImIcons from 'react-icons/im';
import './Navbar.css';

const Navbar = () => {

    const sidebarItems = [
        {
            title:'Home',
            path:'/',
            icon: <AiIcons.AiFillHome />,
            class_name:'nav-text'
        },
        {
            title:'Customers',
            path:'/customers',
            icon: <ImIcons.ImUserTie />,
            class_name:'nav-text'
        },
        {
            title:'Suppliers',
            path:'/suppliers',
            icon: <RiIcons.RiUserFill />,
            class_name:'nav-text'
        },
        {
            title:'Products',
            path:'/products',
            icon: <FaIcons.FaCartPlus />,
            class_name:'nav-text'
        },
        {
            title:'Products Category',
            path:'/product-category',
            icon: <AiIcons.AiOutlineShoppingCart />,
            class_name:'nav-text'
        },
        {
            title:'Orders',
            path:'/orders',
            icon: <RiIcons.RiFileList3Fill />,
            class_name:'nav-text'
        },
        {
            title:'Order Detail',
            path:'/order-detail',
            icon: <RiIcons.RiFileList3Line />,
            class_name:'nav-text'
        }, 
        {
            title:'Users',
            path:'/users',
            icon: <RiIcons.RiFileList3Fill />,
            class_name:'nav-text'
        }
    ]

    const [sidebar, setSidebar] = useState(false)

    const showSidebar = (e)=>{
        console.log('click', e)
        setSidebar(!sidebar)
    }

    return (
        <div>
            <div className="navbar">
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar}/>
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active': 'nav-menu'}>
                <ul className= 'nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {sidebarItems.map((item, index)=> {
                        return(
                            <li key= {index} className={item.class_name}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
         
        </div>
        
    );
}
 
export default Navbar;