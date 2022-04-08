import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import './Order.css';
import axios from 'axios';

const Order = () => {
    const [storeName, setStoreName] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [categoryPick, setCategoryPick] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { storeid } = useParams();
    const { ispackage } = useParams();
    const { categoryid } = useParams();
    const navigate = useNavigate();
    const [sumPrice, setPrice] = useState(0);
    const cart = useSelector((state) => state);
    const dispatch = useDispatch()
    const activeCategory = (btn) => {
        navigate('/stores/' + storeid + '/ispackage/' + ispackage + '/categories/' + btn)
        fetchMenu(btn)
    };
    const controlQuantity = (type, menu_Id, menu_Price, menu_name) => {
        dispatch({
            type: type,
            payload: {
                menuId: menu_Id,
                menuName: menu_name,
                price: menu_Price
            }
        })
        setPrice(cart.totalPrice);
        console.log(cart);
    };
    const fetchMenu = (categoryid) => {
        const storeAPI = 'http://localhost:8080/stores/' + storeid;
        const categoryAPI = 'http://localhost:8080/stores/' + storeid + '/categories';
        const categoryMenuAPI = 'http://localhost:8080/stores/' + storeid + '/categories/' + categoryid;
        const getStore = axios.get(storeAPI)
        const getCategory = axios.get(categoryAPI)
        const getCategoryMenu = axios.get(categoryMenuAPI)
        axios.all([getStore, getCategory, getCategoryMenu]).then(
            axios.spread((...allData) => {
                const storeInfo = allData[0].data[0];
                const allCategory = allData[1].data;
                const allCategoryMenu = allData[2].data;
                setStoreName(storeInfo)
                setCategoryName(allCategory)
                setCategoryPick(allCategoryMenu)
                console.log(storeInfo)
                console.log(allCategory)
                console.log(allCategoryMenu)
            }))
    }
    const fetchOrderRequest = async () => {
        const axiosConfig = {
            headers:{
                "Content-Type": "application/json"
            }
        }
        try {
          //응답 성공 
          setError(null);
          setLoading(true);
          const response = await axios.post('http://localhost:8080/stores/' + cart.storeId + '/orders',
              JSON.stringify(cart),
              axiosConfig
          );
          console.log(response);
        } catch (e) {
          //응답 실패
          setError(e);
        }
        setLoading(false);
      };

    useEffect(() => {
        fetchMenu(categoryid)
    }, [])

    function payMent() {
        fetchOrderRequest();
        const userCode = storeName.impCode;
    
        /* 2. 결제 데이터 정의하기 */
        const data = {
          pg: 'html5_inicis',                           // PG사
          pay_method: 'card',                           // 결제수단
          merchant_uid: storeName.id + '_' + (parseInt(storeName.merchantUid.split('_')[1]) + 1),   // 주문번호(상점고유번호_가장 마지막 주문번호에서 1을 더함)
          amount: cart.totalPrice,                      // 결제금액
          name: cart.orderMenu[0].menuName + ' ' + cart.countMessage,  // 주문명
          buyer_name: '상점1',                           // 구매자 이름
          buyer_tel: '',                     // 구매자 전화번호
          buyer_email: 'username@example.com',               // 구매자 이메일
           m_redirect_url: 'http://localhost:3000/payments/complete' 
             /*아임포트js sdk 버전을 1.1.8에선 해당속성이 필수이나, 1.1.7로 내려 리디렉션 방식대신 콜백방식 사용
           * 결제정보 유지를 위해
           *  */ 

             
          
        };
    
        if (isReactNative()) {
          /* 5. 리액트 네이티브 환경에 대응하기 */
          const params = {
            userCode,                                   // 가맹점 식별코드
            data,                                       // 결제 데이터
            type: 'payment',                            // 결제와 본인인증 구분을 위한 필드
          };
          const paramsToString = JSON.stringify(params);
          window.ReactNativeWebView.postMessage(paramsToString);
        } else {
          /* 1. 가맹점 식별하기 */
          const { IMP } = window;
          IMP.init(userCode);
          /* 4. 결제 창 호출하기 */
          IMP.request_pay(data, callback);
        }
      }
    
      /* 3. 콜백 함수 정의하기 */
      function callback(response) {
        const {
          success,
          merchant_uid,
          error_msg,
          
        } = response;
    
        if (success) {
            navigate('/payments/complete');
        } else {
          alert(`결제 실패: ${error_msg}`);
        }
      }
    
      function isReactNative() {
        /*
          리액트 네이티브 환경인지 여부를 판단해
          리액트 네이티브의 경우 IMP.payment()를 호출하는 대신
          iamport-react-native 모듈로 post message를 보낸다
    
          아래 예시는 모든 모바일 환경을 리액트 네이티브로 인식한 것으로
          실제로는 user agent에 값을 추가해 정확히 판단해야 한다
        */
        //if (ua.mobile) return true;
        return false;
      }

    return (
        <div className="Order">
            <div className="black-nav-order">
                주문 대행 서비스
            </div>
            <div className="nine-order">
                <h1>{storeName.name}<span>오늘도 좋은하루 되세요 :)</span></h1>
            </div>
            <div className='CategoryList'>
                {categoryName.map((category) => {
                    return (
                        <React.Fragment key={category.id}>
                            <button
                                className="buttonCategory"
                                onClick={() => activeCategory(category.id)}>
                                {category.name}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
            <ul className='CategoryMenu'>
                {categoryPick.map((menu) => {
                    return (
                        <React.Fragment key={menu.id}>
                            <li className="menulist" key={menu.id}>
                                <img className="categoryImg" src={menu.menuimgUrl} alt="제품사진" />
                                <span className="menuInfo">
                                    <p className='menuName'>{menu.name}</p>
                                    <p className='menuPrice'>{menu.price.toLocaleString()}원</p>
                                    <div className="quantity buttons_added">
                                        <button className="minus" onClick={() => controlQuantity('-', menu.id, menu.price, menu.name)}> - </button>
                                        <span className="input-text qty text" defaultValue={0}>
                                            {cart.orderMenu.map((ordermenu) => {
                                                if (ordermenu.menuId === menu.id) { return ordermenu.quantity }
                                                else { return null }
                                            })}
                                        </span>
                                        <button className="plus" onClick={() => controlQuantity('+', menu.id, menu.price, menu.name)}> + </button>
                                    </div>
                                </span>
                            </li>
                        </React.Fragment>
                    );
                })}
            </ul>
            <div className="fixed">
                <div className="payMenu">{cart.orderMenu[0].menuName} {cart.countMessage}</div>
                <div className="payAmount">결제예정금액 : {sumPrice.toLocaleString()} 원</div>
                <button className="paymentButton" onClick={() => payMent()}> 결제하기 </button>
            </div>
        </div>
    );
}

export default Order;
