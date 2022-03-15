import React, { useState, useEffect } from 'react';
import './Store.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Store = () => {
    const navigate = useNavigate();
    const eatingRestaurant = () => {
        navigate('/stores/' + storeid + '/ispackage/' + 0 + '/categories/' + 1);
    };
    const eatingOutside = () => {
        navigate('/stores/' + storeid + '/ispackage/' + 1 + '/categories/' + 1);
    };
    const [stores, setStores] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {storeid} = useParams();

    const fetchStores = async () => {
        try {
            // 요청이 시작 할 때에는 error 와 users 를 초기화하고
            setError(null);
            setStores(null);
            // loading 상태를 true 로 바꿉니다.
            setLoading(true);
            const response = await axios.get(
                'https://api.smartorder.ml/stores/' + storeid
            );
            setStores(response.data); // 데이터는 response.data 안에 들어있습니다.
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStores();
    },[]);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!stores) return null;

    return (
        <div className="Store">
            
            <div className="black-nav">주문 대행 서비스</div>
            
            <div>
            {stores.map((store) => {
                return (
                    <>
                    <div className="nine">
                        <h1>{store.name}<span>오늘도 좋은하루 되세요 :)</span></h1>
                        </div>
                    <img key={store.id} src={store.logoimgUrl} alt="식당로고사진" />
                    </> 
                );
            })}
            </div>
            <button className="button-50" onClick={eatingRestaurant}>매장주문</button>
            <button className="button-50" onClick={eatingOutside}>포장주문</button>
        </div>
    );
};
export default Store;