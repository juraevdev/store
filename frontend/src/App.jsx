import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductCatalog from './components/ProductCatalog';
import AdminDashboard from './components/Admin';
import LoginForm from './components/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProductCatalog/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/login' element={<LoginForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}