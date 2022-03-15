import React, { useState, useEffect } from 'react';
import './page.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Package() {
    const navigate = useNavigate();
    const Backet = () => {
        navigate('/Backet');
    };
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            // 요청이 시작 할 때에는 error 와 users 를 초기화하고
            setError(null);
            setUsers(null);
            // loading 상태를 true 로 바꿉니다.
            setLoading(true);
            const response = await axios.get(
                'https://api.smartorder.ml/stores/2/categories/1'
            );
            setUsers(response.data); // 데이터는 response.data 안에 들어있습니다.
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!users) return null;

    return (
        <div className="Order">
            <div className="black-nav">wna</div>
            <h3> 애꿍이 치킨</h3>
            <div className="mainbox">
                {users.map((food) => {
                    return (
                        <div className="food" key={food.id}>
                            <img alt="ck" className="photo" src="/images/test.png" />
                            <div className="food-sty"> {food.name} </div>
                            <div>
                                
                                ({food.price}원)<button> 담기 </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div>
                <button onClick={Backet}>장바구니 </button>
            </div>
        </div>
    );
}

export default Package;
