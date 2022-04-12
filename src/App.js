import React from 'react';
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import Store from './components/Store';
import Order from './components/Order';
import OrderRequest from './components/OrderRequest';
import Admin from './components/Admin';
import NotFound from './components/NotFound';
import AdminLogin from './components/AdminLogin';
  
function App() {

  return (  
    <BrowserRouter>
      <Routes>
        {/* pc개발용 기본페이지 리다이렉트. 향후 삭제 예정 */}
        <Route path="/" element={<Navigate replace to="/adminlogin"/>} />
        <Route path = "/stores/:storeid" element = {<Store/>} />
        <Route path = "/stores/:storeid/ispackage/:ispackage/categories/:categoryid" element = {<Order/>} />
        <Route path = "/stores/:storeid/payments/complete" element = {<OrderRequest/>} />
        <Route path = "/adminlogin" element = {<AdminLogin/>} />
        <Route path = "/stores/:storeid/admin" element = {<Admin/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
