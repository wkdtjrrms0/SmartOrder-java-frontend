import React,{ useState, useEffect } from "react";
import "./BootstrapTemplate/sb-admin-2.css";
import "./Admin.css";
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function Admin(props) {
  const [show, setShow] = useState(false);
  const [isTokenShow, setIsTokenShow] = useState({margin:"auto", display:"none"});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogout = () => {
    window.location.assign('https://www.smartorder.ml/adminlogin');
  }
  const cart = useSelector((state) => state);
  const dispatch = useDispatch();
  const [orderList, setOrderList] = useState([]);
  const [pick, setPick] = useState({
    "id": 0,
    "merchantUid": "",
    "storeId": 0,
    "isPackage": -1,
    "totalPrice": 0,
    "totalCount": 0,
    "orderMenu": [
      {
        "menuId": 0,
        "menuName": "",
        "quantity": 0,
        "price": 0
      }
    ]
  });
  const isPackageF = (n) => {
    if(n === 0) {
      return "매장주문"
    } else if (n === 1){
      return "포장주문"
    } else {
      return ""
    }
  }
  const orderSuccessButton = async() => {
    await axios.post(
      'https://api.smartorder.ml/stores/' + cart.storeId + '/orders/' + pick.merchantUid +'/complete'
      );
      setPick({
        "id": 0,
        "merchantUid": "",
        "storeId": 0,
        "isPackage": -1,
        "totalPrice": 0,
        "totalCount": 0,
        "orderMenu": [
          {
            "menuId": 0,
            "menuName": "",
            "quantity": 0,
            "price": 0
          }
        ]
      });
  }

  const orderCancelButton = async() => {
    await axios.post(
      'https://api.smartorder.ml/stores/' + cart.storeId + '/orders/' + pick.merchantUid +'/cancel'
      );
      setPick({
        "id": 0,
        "merchantUid": "",
        "storeId": 0,
        "isPackage": -1,
        "totalPrice": 0,
        "totalCount": 0,
        "orderMenu": [
          {
            "menuId": 0,
            "menuName": "",
            "quantity": 0,
            "price": 0
          }
        ]
      });
  }
    const componentDidMount = async() => {
      if(cart.accessToken !== ""){
        setIsTokenShow({margin:"auto"});
      }
    try {
      setInterval(async () => {
        let res = await axios.get('https://api.smartorder.ml/stores/' + cart.storeId + '/orders',{
          headers: {
            Authorization: `Bearer ${cart.accessToken}`
        }
        });
        setOrderList(res.data);
        if(res.data.length !== 0){
          dispatch({
            type: "setStoreID",
            payload: {
              storeId: res.data[0].storeId,
            },
          });
        }
      }, 3000);
    } catch(e) {
      console.log(e);
    }
}
useEffect(() => {
  componentDidMount();
}, []);










  return (
    <>
      <div id="page-top">
        {/* <!-- Page Wrapper --> */}
        <div id="wrapper">
          {/* <!-- Content Wrapper --> */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* <!-- Main Content --> */}
            <div id="content" style={{height:"100vh"}}>
              {/* <!-- Topbar --> */}
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* <!-- Topbar Navbar --> */}
                <ul className="navbar-nav ml-auto">
{/* <!-- Nav Item - User Information --> */}
<div className="nav-item dropdown no-arrow">
                    <div variant="success" className="nav-link dropdown-toggle">
                      <img className="img-profile rounded-circle" src="/undraw_profile.svg" alt=""/>
                      &nbsp;&nbsp;
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small"> {cart.storeLoginId}님, 환영합니다! </span>
                    </div>
                  </div>
                
                <Button variant="dark" style ={isTokenShow} onClick={handleShow} size="sm">로그아웃</Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>로그아웃</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          "예" 버튼을 클릭하면 로그아웃 됩니다. 로그아웃 하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            아니오
          </Button>
          <Button variant="primary" style ={{width:"70px"}} onClick={handleLogout}>예</Button>
        </Modal.Footer>
      </Modal>
                  
                </ul>
              </nav>
              {/* <!-- End of Topbar --> */}

              {/* <!-- Begin Page Content --> */}
              <div className="container-fluid">
                {/* <!-- Content Row --> */}
                <div className="row">
                  <div className="col-sm-3">
                    <div className="card shadow">
                      <h3 className="card-header">주문번호: {pick.merchantUid.split("-")[2]}</h3>
                      <div className="card-body" style={{height: "60vh"}}>
                        <h5 className="card-title">식사유형: ({isPackageF(pick.isPackage)})</h5>
                        <hr/>
                        <p className="card-text">
                                  {pick.orderMenu.map((ordermenu) => {
                                  return(
                                    <React.Fragment key={ordermenu.menuId}>
                                      {ordermenu.menuName} {ordermenu.quantity}개 {ordermenu.price.toLocaleString()}원<br/>
                                    </React.Fragment>
                                    )
                                  })}
                        </p>
                        <hr/>
                        결제금액: {pick.totalPrice.toLocaleString()}원
                      </div>
                    </div>
                    <div style={{display: "inline-block", width: "100%", height: "60px", position: "relative", top: "10px", margin:"0 0 30px 0"}}>
                      <button id="orderCancel"className="btn btn-dark" style={{float: "left",width: "26%",height: "100%", fontWeight:"bold"}} onClick={orderCancelButton}>
                          주문 취소
                      </button>
                      <button id="orderSuccess" className="btn btn-dark" style={{float: "right",width: "70%",height: "100%", fontWeight:"bold"}} onClick={orderSuccessButton}>
                          주문 완료
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-9">
                    <Row xs={2} sm={2} md={3} lg={4} xl={5} xxl={6} className="g-4">
                      {orderList.map((order) => (
                        <Col key={order.id}>
                          <button key={order.id} style={{border: "none"}} onClick = {()=>setPick(order)}>
                            <Card border="light" style={{ width: "170px"}} className="card shadow h-100">
                              <Card.Header>주문번호 : {order.merchantUid.split("-")[2]}</Card.Header>
                              <Card.Body className="cardbody">
                                <Card.Text className="cardtext">
                                {order.orderMenu.map((ordermenu) => {
                                  return(
                                    <React.Fragment key={ordermenu.menuId}>
                                      {ordermenu.menuName} {ordermenu.quantity}개 <br/>
                                    </React.Fragment>
                                    )
                                  })}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </button>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </div>
              {/* <!-- /.container-fluid --> */}
            </div>
            {/* <!-- End of Main Content --> */}
          </div>
          {/* <!-- End of Content Wrapper --> */}
        </div>
        {/* <!-- End of Page Wrapper --> */}

        

        {/* <!-- Bootstrap core JavaScript--> */}
        <script src="./BootstrapTemplate/jquery.min.js"></script>
        <script src="./BootstrapTemplate/bootstrap.bundle.min.js"></script>

        {/* <!-- Core plugin JavaScript--> */}
        <script src="./BootstrapTemplate/jquery.easing.min.js"></script>

        {/* <!-- Custom scripts for all pages--> */}
        <script src="./BootstrapTemplate/sb-admin-2.min.js"></script>

        {/* <!-- Page level plugins --> */}
        <script src="./BootstrapTemplate/Chart.min.js"></script>

        {/* <!-- Page level custom scripts --> */}
        <script src="./BootstrapTemplate/chart-area-demo.js"></script>
        <script src="./BootstrapTemplate/chart-pie-demo.js"></script>
      </div>
    </>
  );
}

export default Admin;
