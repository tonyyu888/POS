import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import ProductTable from './components/products/ProductTable';
import ProductCategoryTable from './components/products/ProductCategoryTable';
import CustomerTable from './components/customers/CustomerTable';
import SupplierTable from './components/suppliers/SupplierTable';
import Orders from './components/orders/Orders';
import OrderDetail from './components/orders/OrderDetail';
import UserLevelTable from './components/users/UserLevelTable';


const App = () => {
  
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          {/* <Route path='/' exact component={Home}/>
          <Route path='/products' component={Products}/>
          <Route path='/products-catogary' component={ProductCategoryTable}/>
          <Route path='/orders' component={Orders}/>
          <Route path='/order-detail' component={OrderDetail}/> */}
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
            <Orders/>
          </Route>
          <Route path='/order-detail'>
            <OrderDetail/>
          </Route>
          <Route path='/user-level'>
            <UserLevelTable/>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;