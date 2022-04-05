import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import './OrderRequest.css';
import axios from 'axios';

const OrderRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cart = useSelector((state) => state);

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
        fetchOrderRequest();
    }, []);
    if (loading) return <div>로딩중..</div>;
    //if (error) return <div>에러가 발생했습니다</div>;
    return (
        <div>
            <button onClick={fetchOrderRequest}>매장주문</button>
            test 페이지
        </div>
    );
}

export default OrderRequest;