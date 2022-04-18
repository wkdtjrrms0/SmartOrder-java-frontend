import React,{ useState, useEffect } from "react";
import "./BootstrapTemplate/sb-admin-2.css";
import "./Admin.css";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Admin(props) {
  const { storeid } = useParams();
  const [test, setTest] = useState([]);
  const [test2, setTest2] = useState({
    "id": 0,
    "merchantUid": "",
    "storeId": 0,
    "isPackage": 0,
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
  const orderSuccessButton = async() => {
    const response = await axios.post(
      'https://api.smartorder.ml/' + storeid + '/orders/' + test2.merchantUid +'/complete'
      );
      setTest2({
        "id": 0,
        "merchantUid": "",
        "storeId": 0,
        "isPackage": 0,
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
    const response = await axios.post(
      'https://api.smartorder.ml/' + storeid + '/orders/' + test2.merchantUid +'/cancel'
      );
      setTest2({
        "id": 0,
        "merchantUid": "",
        "storeId": 0,
        "isPackage": 0,
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
    try {
      setInterval(async () => {
        let res = await axios.get('https://api.smartorder.ml/stores/' + storeid + '/orders');
        console.log(res.data);
        setTest(res.data);
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
                  <li className="nav-item dropdown no-arrow">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#1"
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small"> Douglas McGee </span>
                      <img className="img-profile rounded-circle" src="/undraw_profile.svg" alt=""/>
                    </a>
                    {/* <!-- Dropdown - User Information --> */}
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a
                        className="dropdown-item"
                        href="#1"
                        data-toggle="modal"
                        data-target="#logoutModal"
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
              {/* <!-- End of Topbar --> */}

              {/* <!-- Begin Page Content --> */}
              <div className="container-fluid">
                {/* <!-- Content Row --> */}
                <div className="row">
                  <div className="col-sm-3">
                    <div className="card shadow">
                      <h3 className="card-header">주문번호 : {test2.merchantUid.split("-")[2]}</h3>
                      <div className="card-body" style={{height: "60vh"}}>
                        <h5 className="card-title">주문메뉴</h5>
                        <hr/>
                        <p className="card-text">
                                  {test2.orderMenu.map((ordermenu) => {
                                  return(
                                    <React.Fragment key={ordermenu.menuId}>
                                      {ordermenu.menuName} {ordermenu.quantity}개 {ordermenu.price.toLocaleString()}원<br/>
                                    </React.Fragment>
                                    )
                                  })}
                        </p>
                        <hr/>
                        결제금액: {test2.totalPrice.toLocaleString()}원
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
                      {test.map((order) => (
                        <Col key={order.id}>
                          <button key={order.id} style={{border: "none"}} onClick = {()=>setTest2(order)}>
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

        {/* <!-- Logout Modal--> */}
        <div
          className="modal fade"
          id="logoutModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Ready to Leave?
                </h5>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                Select "Logout" below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <a className="btn btn-primary" href="login.html">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>

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
