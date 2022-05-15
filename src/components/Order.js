import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Order.css";
import axios from "axios";
import { firebaseApp } from "./firebase";

const Order = () => {
  const [storeInfo, setStoreInfo] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [categoryPick, setCategoryPick] = useState([]);
  const [fcmToken, setFcmToken] = useState(null);
  const [deniedPermission, setDeniedPermission] = useState(false);
  const { storeid } = useParams();
  const { ispackage } = useParams();
  const { categoryid } = useParams();
  const navigate = useNavigate();
  const [sumPrice, setPrice] = useState(0);
  const cart = useSelector((state) => state);
  const dispatch = useDispatch();

  const fcm = () => {
    const firebaseMessaging = firebaseApp.messaging();
    if (!window.Notification) { //알림호환 브라우저 체크
        console.log("이 브라우저는 알림기능을 지원하지 않습니다.(ex. Safari on iOS)");
        setDeniedPermission(true);
    } 
    else if (window.Notification.permission === 'granted'){ //이미 권한이 있는경우
        firebaseMessaging.getToken() // 등록 토큰 받기
        .then(function (token) {
            console.log("이미 권한이 있는 경우", token); //토큰 출력
            setFcmToken(token);
        }).catch(function (error) {
            console.log("FCM Error : ", error);
        });
    }
    else if (window.Notification.permission !== 'denied'){ //최초실행(거절이 아닌경우)
        window.Notification.requestPermission().then(() => {
            return firebaseMessaging.getToken(); // 등록 토큰 받기
        }).then(function (token) {
            console.log("최초실행", token);  //토큰 출력
            setFcmToken(token);
        }).catch(function (error) {
            console.log("FCM Error : ", error);
            setDeniedPermission(true);
        });
    }
    else if (window.Notification.permission === 'denied'){ //알림권한이 거절인 경우
        setDeniedPermission(true);
        console.log("알림권한이 차단되어 있습니다. 사이트설정에서 알림권한을 허용하여 주문알림을 받아보세요!")
    }
}

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
    let ftk = null;
    if(cart.fcmToken !== null || fcmToken !== null || deniedPermission === true){
      if(cart.fcmToken !== null){ftk = cart.fcmToken} //초기화면의 토큰 사용
      else if(fcmToken !== null){ftk = fcmToken} //메뉴화면의 토큰 사용
      dispatch({
        type: "StoreInfo",
        payload: {
          storeId: parseInt(storeid),
          isPackage: parseInt(ispackage),
          fcmToken: ftk
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
  }
  else{
      alert("알림토큰을 수신중입니다. 원활한 주문을 위해 잠시후 다시 진행해 주세요.")
  }     
  };
  useEffect(() => {
    fcm();
    fetchMenu(categoryid);
  }, []);

  function callback(response) {
    const { success, error_msg } = response;
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
