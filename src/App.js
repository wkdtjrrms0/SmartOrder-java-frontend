import React from 'react';
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import Store from './components/Store';
import Order from './components/Order';
import Package from './components/Package';
import Backet from './components/Backet';
  
function App() {

  return (  
    <BrowserRouter>
      <Routes>
        {/* pc개발용 기본페이지 리다이렉트. 향후 삭제 예정 */}
        <Route path="/" element={<Navigate replace to="/stores/2"/>} />
        <Route path = "/stores/:storeid" element = {<Store/>} />
        <Route path = "/stores/:storeid/ispackage/:ispackage/categories/:categoryid" element = {<Order/>} />
        <Route path = "/Package" element = {<Package/>} />
        <Route path = "/Backet" element = {<Backet/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
