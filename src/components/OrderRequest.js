import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderRequest.css';
import axios from 'axios';
import queryString from "query-string";

const OrderRequest = () => {
  const [resultMessage, setResultMessage] = useState("");
  const [orderMenu, setOrderMenu] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { storeid } = useParams();
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/stores/' + storeid)
};
  const query = queryString.parse(window.location.search);
  const checkForgeryVerificationAPI = 'https://api.smartorder.ml/stores/' + storeid + '/payments/complete?imp_uid=' + query.imp_uid + '&merchant_uid=' + query.merchant_uid;
  const orderResultAPI = 'https://api.smartorder.ml/stores/' + storeid + '/orders/result?merchant_uid=' + query.merchant_uid;

  const result1 = async () => {
    const getCheckForgeryVerificationMessage = await axios.get(checkForgeryVerificationAPI)
    setResultMessage(getCheckForgeryVerificationMessage.data)
    console.log(getCheckForgeryVerificationMessage)
    result2();
  }

  const result2 = async () => {
    const getOrderResult = await axios.get(orderResultAPI)
    setTotalPrice(getOrderResult.data.totalPrice);
    setOrderMenu(getOrderResult.data.orderMenu)
    console.log(getOrderResult)
  };

  useEffect(() => {
    result1();
  }, []);

  return (
    <div>
      {resultMessage.split('_')[0]}<br />
      주문번호: {resultMessage.split('_')[1]}<br />
      주문내역<br />
      <ul>
        {orderMenu.map((ordermenu) => {
          return (
            <React.Fragment key={ordermenu.menuId}>
              <li className="menulist" key={ordermenu.menuId}>
                <span className="menuInfo">
                  <p className='menuName'>{ordermenu.menuName}</p>
                  <p className='menuPrice'>{ordermenu.quantity}개</p>
                  <p className='menuPrice'>{ordermenu.price}원</p>
                </span>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
      결제금액: {totalPrice.toLocaleString()}원<br/>
      <button type='button' onClick={goHome}>홈으로</button>
    </div>
  );
}

export default OrderRequest;