import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Product from './Product';
import RegisterPage from './RegisterPage';
import Login from './Login';
import Order from './Order'


function App() {
  
 
  return (
  <BrowserRouter><Routes>
    <Route path="/" element={<Login/>}/>

    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/products" element={<Product/>} />
    <Route path="/orders" element={<Order/>}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App
