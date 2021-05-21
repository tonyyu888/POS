import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Customers from './components/customers/Customers';
import SupplierTable from './components/suppliers/SupplierTable';
import Products from './components/products/Products';
import ProductCategoryTable from './components/products/ProductCategoryTable';
import Orders from './components/orders/Orders';
import OrderDetail from './components/orders/OrderDetail';

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
            <Customers/>
          </Route>
          <Route path='/suppliers'>
            <SupplierTable/>
          </Route>
          <Route path='/products'>
            <Products/>
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
        </Switch>
      </Router>
      {/* <div className="title-bar">
        <h1>Product Category Maintenance</h1>
      </div>
      <ProductCategoryTable /> */}
    </>
  );
};

export default App;