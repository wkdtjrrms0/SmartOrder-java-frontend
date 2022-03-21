import React, {useState, useEffect} from 'react';
import './Order.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
 import {useDispatch, useSelector} from 'react-redux'


const Order = () => {
    const [storeName, setStoreName] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [categoryPick, setCategoryPick] = useState([]);
    const {storeid} = useParams();
    const {ispackage} = useParams();
    const {categoryid} = useParams();
    const navigate = useNavigate();
    const [sumPrice, setPrice] = useState(0);
    const cart = useSelector((state) => state);
    const dispatch = useDispatch()

    const activeCategory = (btn) => {
        navigate('/stores/' + storeid + '/ispackage/' + 1 + '/categories/' + btn)
        fetchMenu(btn)
      };
    const controlQuantity = (type, menu_Id, menu_Price) => {
        dispatch({type : type, 
            payload: {
                      menuId : menu_Id,
                      price: menu_Price
            }})
        setPrice(cart.totalPrice);
        console.log(cart);
    };
    const payMent = (btn) => {};

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
        }))}
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

            <div className='CategoryList'>
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
                    <li className="menulist" key={menu.id}>
                    <img className="categoryImg" src={menu.menuimgUrl} alt="제품사진"/>
                    <span className="menuInfo">
                    <p className='menuName'> 
                    {menu.name}
                    </p>
                    <p className='menuPrice'>
                    {menu.price.toLocaleString()}원
                    </p>
                         <div className="quantity buttons_added">             
                    <button className="minus" onClick={() => controlQuantity('-', menu.id, menu.price)}> - </button>
                    <span className ="input-text qty text" defaultValue={0}>
                        {cart.orderMenu.map((ordermenu) => {
                        if(ordermenu.menuId === menu.id)
                            {return ordermenu.quantity}
                    })}
                    </span>
                    <button className="plus" onClick={() => controlQuantity('+', menu.id, menu.price)}> + </button>
                    </div> 
                    </span>
                    </li>
                    </> 
                );
            })}
            </ul>
            <div>
                합계 : {sumPrice} 원 
                <button onClick={() => payMent(sumPrice)}> 결제하기 </button>
            </div>
        </div>
    );
}

export default Order;
