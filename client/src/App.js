import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import ProductTable from './components/products/ProductTable';
import ProductCategoryTable from './components/products/ProductCategoryTable';
import CustomerTable from './components/customers/CustomerTable';
import SupplierTable from './components/suppliers/SupplierTable';
import OrderTable from './components/orders/OrderTable';
import UserLevelTable from './components/users/UserLevelTable';
import UserTable from './components/users/UserTable';
import OrderStatusTable from './components/orders/OrderStatusTable';


const App = () => {
  
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Home/>            
          </Route>
          <Route path='/customers'>
            <CustomerTable/>
          </Route>
          <Route path='/suppliers'>
            <SupplierTable/>
          </Route>
          <Route path='/products'>
            <ProductTable/>
          </Route>
          <Route path='/product-category'>
            <ProductCategoryTable/>
          </Route>
          <Route path='/orders'>
            <OrderTable/>
          </Route>
          <Route path='/order-status'>
            <OrderStatusTable/>
          </Route>
          <Route path='/user-level'>
            <UserLevelTable/>
          </Route>
          <Route path='/users'>
            <UserTable/>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;