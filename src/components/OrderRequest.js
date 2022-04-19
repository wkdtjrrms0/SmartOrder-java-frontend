import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderRequest.css";
import axios from "axios";
import queryString from "query-string";

const OrderRequest = () => {
  const [resultMessage, setResultMessage] = useState("");
  const [orderMenu, setOrderMenu] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { storeid } = useParams();
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/stores/" + storeid);
  };
  const query = queryString.parse(window.location.search);
  const checkForgeryVerificationAPI =
    "https://api.smartorder.ml/stores/" +
    storeid +
    "/payments/complete?imp_uid=" +
    query.imp_uid +
    "&merchant_uid=" +
    query.merchant_uid;
  const orderResultAPI =
    "https://api.smartorder.ml/stores/" +
    storeid +
    "/orders/result?merchant_uid=" +
    query.merchant_uid;

  const result1 = async () => {
    const getCheckForgeryVerificationMessage = await axios.get(
      checkForgeryVerificationAPI
    );
    setResultMessage(getCheckForgeryVerificationMessage.data);
    console.log(getCheckForgeryVerificationMessage);
    result2();
  };

  const result2 = async () => {
    const getOrderResult = await axios.get(orderResultAPI);
    setTotalPrice(getOrderResult.data.totalPrice);
    setOrderMenu(getOrderResult.data.orderMenu);
    console.log(getOrderResult);
  };

  useEffect(() => {
    result1();
  }, []);

  return (
    <div>
    <div className="nav-order">주문 내역</div>
      <div className="result-main">{resultMessage.split('_')[0]}</div>
      <p className="result-main">주문번호 : {resultMessage.split('_')[1]}</p>
          <br/>
          <div className="receiptDiv">
         <table className="receipt">
            <thead>
              <tr>
              <th className="menuName">상품명</th><th className="quantity">수량</th><th className="price">금액</th>
              </tr>
            </thead>
            <tbody>
            {orderMenu.map((ordermenu) => {
            return (
                <React.Fragment key={ordermenu.menuId}>
                  <tr>
	                  <td className="menuName">{ordermenu.menuName}</td>
	                  <td className="quantity">{ordermenu.quantity}개</td>
                    <td className="price">{ordermenu.price.toLocaleString()}원</td>
	                </tr>
                </React.Fragment>
            );
          })}
          </tbody>
          </table>
          <p className="amount">결제금액 : {totalPrice.toLocaleString()}원</p><br/>
          <button className="btn btn-dark" style ={{
    margin:"auto",
    width: "150px",
    position:"relative",
    left: "50%",
    transform:"translateX(-50%)"
}}type="button" onClick={goHome}>
            <h2>홈으로</h2>
        </button>
          </div>
        
    
</div>
  );
};

export default OrderRequest;
