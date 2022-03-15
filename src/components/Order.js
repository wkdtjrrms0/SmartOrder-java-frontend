import React, {useState, useEffect} from 'react';
import './Order.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Order = () => {
    const [storeName, setStoreName] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [categoryPick, setCategoryPick] = useState([]);
    const {storeid} = useParams();
    const {ispackage} = useParams();
    const {categoryid} = useParams();
    const navigate = useNavigate();

    const activeCategory = (btn) => {
        navigate('/stores/' + storeid + '/ispackage/' + 1 + '/categories/' + btn)
        fetchMenu(btn)
      };



    const fetchMenu = (categoryid) => {
        const storeAPI = 'https://api.smartorder.ml/stores/' + storeid;
        const categoryAPI = 'https://api.smartorder.ml/stores/' + storeid + '/categories';
        const categoryMenuAPI = 'https://api.smartorder.ml/stores/' + storeid + '/categories/' + categoryid;
    
        const getStore = axios.get(storeAPI)
        const getCategory = axios.get(categoryAPI)
        const getCategoryMenu = axios.get(categoryMenuAPI)

    axios.all([getStore,getCategory, getCategoryMenu]).then(
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
        })
    )
    }
    useEffect(() => {
        fetchMenu(categoryid)
    }, [])




    return (
        <div className="Order">
            <div className="black-nav">
                주문 대행 서비스
            </div>
            <div className="nine">
                        <h1>{storeName.name}<span>오늘도 좋은하루 되세요 :)</span></h1>
                        </div>

            <div>
            {categoryName.map((category) => {
                return (
                    <>
                    <button
                        className="buttonCategory"
                        onClick={() => activeCategory(category.id)}>
                        {category.name}
                    </button>
                    </> 
                );
            })}
            </div>

            <ul className='CategoryMenu'>
            {categoryPick.map((menu) => {
                return (
                    <>                  
                    <li className="Menu" key={menu.id}>
                    <img className="categoryImg" src="/images/test.png" alt="ck"/>
                    {menu.name} ({menu.price}원) <button> 담기 </button>
                    </li>
                    </> 
                );
            })}
            </ul>
        </div>
    );
}

export default Order;
