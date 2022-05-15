import React, { useState, useEffect } from 'react';
import './Store.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { firebaseApp } from "./firebase";

const Store = () => {
    const [stores, setStores] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fcmToken, setFcmToken] = useState(null);
    const [deniedPermission, setDeniedPermission] = useState(false);
    const { storeid } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const fcm = () => {
        const firebaseMessaging = firebaseApp.messaging();
        if (!window.Notification) { //알림호환 브라우저 체크
            alert("이 브라우저는 알림기능을 지원하지 않습니다.(ex. Safari on iOS)");
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
            alert("알림권한이 차단되어 있습니다. 사이트설정에서 알림권한을 허용하여 주문알림을 받아보세요!")
        }
    }

    const eatingRestaurant = () => {
        if(fcmToken !== null || deniedPermission === true){
            dispatch({
                type: "StoreInfo",
                payload: {
                    storeId: parseInt(storeid),
                    isPackage: 0,
                    fcmToken: fcmToken
                }
            });
            navigate('/stores/' + storeid + '/ispackage/' + 0 + '/categories/' + 0);
        }
        else{
            alert("알림토큰을 수신중입니다. 원활한 주문을 위해 잠시후 다시 진행해 주세요.")
        }
    }; /* 매장주문 버튼 */

    const eatingOutside = () => {
        if(fcmToken !== null || deniedPermission === true){
            dispatch({
                type: "StoreInfo",
                payload: {
                    storeId: parseInt(storeid),
                    isPackage: 1,
                    fcmToken: fcmToken
                }
            });
            navigate('/stores/' + storeid + '/ispackage/' + 1 + '/categories/' + 0);
        }
        else{
            alert("알림토큰을 수신중입니다. 원활한 주문을 위해 잠시후 다시 진행해 주세요.")
        }
    }; /* 포장주문 버튼 */

    const fetchStores = async () => {
        try {
            setError(null);
            setStores(null);
            setLoading(true);
            const response = await axios.get(
                'https://api.smartorder.ml/stores/' + storeid
            );
            setStores(response.data);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    }; /* 매장정보 API 호출 */

    useEffect(() => {
        fcm();
        fetchStores();
    }, []);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!stores) return null;
    return (
        <div className="Store">
            <div className="black-nav">주문 대행 서비스</div>
            <div>
                {stores.map((store) => {
                    return (
                        <React.Fragment key={store.id}>
                            <div className="nine">
                                <h1>{store.name}<span>오늘도 좋은하루 되세요 :)</span></h1>
                            </div>
                            <img key={store.id} src={store.logoimgUrl} alt="식당로고사진" />
                        </React.Fragment>
                    );
                })}
            </div>
            <button className="button-50" onClick={eatingRestaurant}>매장주문</button>
            <button className="button-50" onClick={eatingOutside}>포장주문</button>
        </div>
    );
};
export default Store;