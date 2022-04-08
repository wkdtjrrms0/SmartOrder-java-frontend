import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import './OrderRequest.css';
import axios from 'axios';
import queryString from "query-string";

const OrderRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cart = useSelector((state) => state);

    const query = queryString.parse(window.location.search);
    const fetchOrderRequest = async () => {
        try {
          //응답 성공 
          setError(null);
          setLoading(true);
          const response = await axios.post('https://api.smartorder.ml/stores/' + cart.storeId + '/orders',
              JSON.stringify(cart)
          );
          console.log(response);
        } catch (e) {
          //응답 실패
          setError(e);
        }
        setLoading(false);
      };
      useEffect(() => {
        // fetchOrderRequest();
    }, []);
    if (loading) return <div>로딩중..</div>;
    //if (error) return <div>에러가 발생했습니다</div>;
    return (
        <div>
            <button onClick={fetchOrderRequest}>test 버튼</button><br/>
            {query.imp_uid}
            
            {query.imp_success}
            주문이 완료되었습니다.<br/>
            주문번호: {query.merchant_uid.split('_')[1]}<br/>
            주문메뉴: {cart.orderMenu[0].menuName + ' ' + cart.countMessage}<br/>
            결제금액: {cart.totalPrice.toLocaleString()}원
        </div>
    );
}

export default OrderRequest;