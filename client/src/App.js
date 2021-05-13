import './App.css';
import ProductCategoryTable from './components/ProductCategoryTable'
import ProductCategoryForm from './components/ProductCategoryForm'

const App = () => {
  return (
    <div>
      <div className="title-bar">
        <h1>Superhero Registry</h1>
      </div>
      <ProductCategoryTable />
    </div>
  );
};

export default App;

