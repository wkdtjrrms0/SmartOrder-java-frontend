import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Order.css";
import axios from "axios";

const Order = () => {
  const [storeInfo, setStoreInfo] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [categoryPick, setCategoryPick] = useState([]);
  const { storeid } = useParams();
  const { ispackage } = useParams();
  const { categoryid } = useParams();
  const navigate = useNavigate();
  const [sumPrice, setPrice] = useState(0);
  const cart = useSelector((state) => state);
  const dispatch = useDispatch();
  const activeCategory = (btn) => {
    navigate(
      "/stores/" + storeid + "/ispackage/" + ispackage + "/categories/" + btn
    );
    fetchMenu(btn);
  };
  const controlQuantity = (type, menu_Id, menu_Price, menu_name) => {
    dispatch({
      type: type,
      payload: {
        menuId: menu_Id,
        menuName: menu_name,
        price: menu_Price,
      },
    });
    setPrice(cart.totalPrice);
  };
  const fetchMenu = (categoryid) => {
    const storeAPI = "https://api.smartorder.ml/stores/" + storeid;
    const categoryAPI =
      "https://api.smartorder.ml/stores/" + storeid + "/categories";
    const categoryMenuAPI =
      "https://api.smartorder.ml/stores/" +
      storeid +
      "/categories/" +
      categoryid;
    const getStore = axios.get(storeAPI);
    const getCategory = axios.get(categoryAPI);
    const getCategoryMenu = axios.get(categoryMenuAPI);
    axios.all([getStore, getCategory, getCategoryMenu]).then(
      axios.spread((...allData) => {
        setStoreInfo(allData[0].data[0]);
        setCategoryName(allData[1].data);
        setCategoryPick(allData[2].data);
      })
    );
  };
  const payMent = async () => {
    dispatch({
      type: "StoreInfo",
      payload: {
        storeId: parseInt(storeid),
        isPackage: parseInt(ispackage),
      },
    });
    const OrderRequestAPI =
      "https://api.smartorder.ml/stores/" + cart.storeId + "/orders";
    const axiosConfig = {
      headers: { "Content-Type": "application/json" },
    };
    const getMerchantUid = await axios.post(
      OrderRequestAPI,
      JSON.stringify(cart),
      axiosConfig
    );
    const data = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: getMerchantUid.data,
      amount: cart.totalPrice,
      name: cart.orderMenu[0].menuName + " " + cart.countMessage,
      buyer_name: "테스트",
      buyer_tel: "",
      buyer_email: "username@example.com",
      m_redirect_url:
        "https://www.smartorder.ml/stores/" +
        storeInfo.id +
        "/payments/complete",
    }; /* 결제 데이터 {PG사, 결제수단, 주문번호, 결제금액, 주문명, 고객이름, 고객전화번호, 고객이메일, 모바일리다이렉트url} */
    console.log(data);
    const IMP = window.IMP; /* 1. IMP객체 초기화 */
    IMP.init(storeInfo.impCode); /* 2. 가맹점 식별코드로 IMP객체 초기화 */
    IMP.request_pay(data, callback); /* 3. 결제창 호출 */
  };
  useEffect(() => {
    fetchMenu(categoryid);
  }, []);

  function callback(response) {
    const { success, merchant_uid, error_msg } = response;
    if (success) {
      navigate("/payments/complete");
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  } /* 콜백 함수(모바일에선 콜백함수가 호출되지 않고 m_redirect_url로 리다이렉트 됨) */

  return (
    <div className="Order">
      <div className="black-nav-order">주문 대행 서비스</div>
      <div className="nine-order">
        <h1>
          {storeInfo.name}
          <span>오늘도 좋은하루 되세요 :)</span>
        </h1>
      </div>
      <div className="CategoryList">
        {categoryName.map((category) => {
          return (
            <React.Fragment key={category.id}>
              <button
                className="buttonCategory"
                onClick={() => activeCategory(category.id)}
              >
                {category.name}
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <ul className="CategoryMenu">
        {categoryPick.map((menu) => {
          return (
            <React.Fragment key={menu.id}>
              <li className="menulist" key={menu.id}>
                <img
                  className="categoryImg"
                  src={menu.menuimgUrl}
                  alt="제품사진"
                />
                <span className="menuInfo">
                  <p className="menuName">{menu.name}</p>
                  <p className="menuPrice">{menu.price.toLocaleString()}원</p>
                  <div className="quantity buttons_added">
                    <button
                      className="minus"
                      onClick={() =>
                        controlQuantity("-", menu.id, menu.price, menu.name)
                      }
                    >
                      {" "}
                      -{" "}
                    </button>
                    <span className="input-text qty text" defaultValue={0}>
                      {cart.orderMenu.map((ordermenu) => {
                        if (ordermenu.menuId === menu.id) {
                          return ordermenu.quantity;
                        } else {
                          return null;
                        }
                      })}
                    </span>
                    <button
                      className="plus"
                      onClick={() =>
                        controlQuantity("+", menu.id, menu.price, menu.name)
                      }
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>
                </span>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
      <div className="fixed">
        <div className="payMenu">
          {cart.orderMenu[0].menuName} {cart.countMessage}
        </div>
        <div className="payAmount">
          결제예정금액 : {sumPrice.toLocaleString()} 원
        </div>
        <button className="paymentButton" onClick={payMent}>
          {" "}
          결제하기{" "}
        </button>
      </div>
    </div>
  );
};

export default Order;
