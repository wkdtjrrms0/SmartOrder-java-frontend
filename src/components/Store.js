import React, { useState, useEffect } from 'react';
import './Store.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux'

const Store = () => {
    const [stores, setStores] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { storeid } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const eatingRestaurant = () => {
        dispatch({
            type: "StoreInfo",
            payload: {
                storeId: parseInt(storeid),
                isPackage: 0
            }
        });
        navigate('/stores/' + storeid + '/ispackage/' + 0 + '/categories/' + 0);
    }; /* 매장주문 버튼 */

    const eatingOutside = () => {
        dispatch({
            type: "StoreInfo",
            payload: {
                storeId: parseInt(storeid),
                isPackage: 1
            }
        });
        navigate('/stores/' + storeid + '/ispackage/' + 1 + '/categories/' + 0);
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