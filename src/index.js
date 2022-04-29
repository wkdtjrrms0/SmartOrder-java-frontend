import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const cart = {
  storeId: null,
  storeLoginId: null,
  isPackage: null,
  totalPrice: 0,
  totalCount: 0,
  countMessage: "",
  orderMenu: [
    {
      menuId: null,
      menuName: "",
      quantity: 0,
      price: 0
    }
  ],
  accessToken: ""
}

function getTotalPrice(arr) {
  var price = 0;
  for (var i = 0; i < arr.length; i++) {
    price += arr[i].price;
  }
  return price;
}

function getTotalCount(arr) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    count += arr[i].quantity;
  }
  return count;
}

function getCountMessage(n) {
  if (n <= 1) { return ""; }
  else { return "외 " + (n - 1) + "개"; }
}

function reducer(state = cart, action) {
  if (action.type === '+') {
    //최초 수량 증가
    if (state.orderMenu[0].menuId === null) {
      state.orderMenu[0].menuId = action.payload.menuId;
      state.orderMenu[0].menuName = action.payload.menuName;
      state.orderMenu[0].quantity++;
      state.orderMenu[0].price = action.payload.price;
      state.totalPrice = getTotalPrice(state.orderMenu);
      state.totalCount = getTotalCount(state.orderMenu);
      state.countMessage = getCountMessage(state.totalCount);
      return state;
    }
    var check = false;
    for (var i = 0; i < state.orderMenu.length; i++) {
      if (state.orderMenu[i].menuId === action.payload.menuId) {
        state.orderMenu[i].quantity++;
        state.orderMenu[i].price = state.orderMenu[i].quantity * action.payload.price;
        check = true;
        break;
      }
    }
    if (check === false) {
      state.orderMenu.push({
        menuId: action.payload.menuId,
        menuName: action.payload.menuName,
        quantity: 1,
        price: action.payload.price
      })
    }
    state.totalPrice = getTotalPrice(state.orderMenu);
    state.totalCount = getTotalCount(state.orderMenu);
    state.countMessage = getCountMessage(state.totalCount);
    return state;
  }
  else if (action.type === '-') {
    if (state.orderMenu[0].menuId === null || state.totalCount === 0) {
      state.countMessage = getCountMessage(state.totalCount);
      return state;
    }
    for (var j = 0; j < state.orderMenu.length; j++) {
      if (state.orderMenu[j].menuId === action.payload.menuId) {
        state.orderMenu[j].quantity--;
        state.orderMenu[j].price = state.orderMenu[j].quantity * action.payload.price;
        if (state.orderMenu[j].quantity <= 0) {
          state.orderMenu.splice(j, 1);
          if (state.orderMenu.length === 0) {
            state.orderMenu.push({
              menuId: null,
              menuName: "",
              quantity: 0,
              price: 0
            })
          }
        }
        break;
      }
    }
    state.totalPrice = getTotalPrice(state.orderMenu);
    state.totalCount = getTotalCount(state.orderMenu);
    state.countMessage = getCountMessage(state.totalCount);
    return state
  }
  else if (action.type === 'StoreInfo') {
    state.storeId = action.payload.storeId;
    state.isPackage = action.payload.isPackage;
    return state;
  }
  else if (action.type === 'setTokenAndStoreId') {
    state.accessToken = action.payload.token
    state.storeLoginId = action.payload.id
    return state;
  }
  else if (action.type === 'setStoreID') {
    state.storeId = action.payload.storeId;
    return state;
  }
  else {
    return state;
  }
}

let store = createStore(reducer)
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
