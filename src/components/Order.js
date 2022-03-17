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
    const [sumPrice, setPrice] = useState(0);
    const [menuQuantity, setMenuQuantity] = useState([]);


    const activeCategory = (btn) => {
        navigate('/stores/' + storeid + '/ispackage/' + 1 + '/categories/' + btn)
        fetchMenu(btn)
      };

    const addMenu = (btn, id) => {
        setPrice(sumPrice + btn)

        var newQuantity = [...menuQuantity];
        newQuantity[id] = menuQuantity[id]++;
        setMenuQuantity(newQuantity);
    };
    const deleteMenu = (btn, id) => {

        if(menuQuantity[id] - 1 >= 0){
        var newQuantity = [...menuQuantity];
        newQuantity[id] = menuQuantity[id]--;
        setMenuQuantity(newQuantity);
        }

        if(sumPrice - btn <= 0){
            setPrice(0)
        }
        else{
        setPrice(sumPrice - btn)
        }
    };

    const controlmenuQuantity = (id, quantity) => {
        var newQuantity = [...menuQuantity];
        newQuantity[id] = menuQuantity[id] + quantity;
        setMenuQuantity(newQuantity);
        return newQuantity[id];
    };

    const payMent = (btn) => {
        
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
                    <li className="menulist" key={menu.id}>
                    
                    <img className="categoryImg" src={menu.menuimgUrl} alt="제품사진"/>
                    <span className="menuInfo">
                    <p className='menuName'> 
                    {menu.name}
                    </p>
                    <p className='menuPrice'>
                    {menu.price.toLocaleString()}원
                    </p>
                                        
                    <button className="quantityButton" onClick={() => addMenu(menu.price, menu.id)}> + </button>
                    &nbsp;수량작업중&nbsp;
                    {/* <p>{controlmenuQuantity(menu.id,0) }</p> */}
                    <button className="quantityButton" onClick={() => deleteMenu(menu.price, menu.id)}> - </button>
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
