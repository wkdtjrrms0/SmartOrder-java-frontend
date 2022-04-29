import React,{ useState } from "react";
import "./AdminLogin.css";
import swal from 'sweetalert';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin(props) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
    const handleSubmit = (e) => {
      e.preventDefault();
      let response = axios.post('https://api.smartorder.ml/login', JSON.stringify({
        username,
        password
      }),{headers: {
          'Content-Type': 'application/json'
        }}
      )
      console.log(response)
      response.then(
        function(value) { 
          console.log("성공")
        swal("Success", "로그인 성공", "success", {
          buttons: false,
          timer: 2000,
        })
        .then((val) => {
          localStorage.setItem('accessToken', value.data.accessToken);
          // localStorage.setItem('user', JSON.stringify(response['user']));
          dispatch({
            type: "setTokenAndStoreId",
            payload: {
              token: value.data.accessToken,
              id: username
            },
          });
          navigate("/admin");
        });},
        function(error) { 
          console.log("실패")
          swal("Failed", "ID/PW를 확인하세요", "error");
         }
      )
    }

  return (
    <>
      <div className="text-center">
        <main className="form-signin">
          <form onSubmit={handleSubmit}>
            <img className="mb-4" src="/CBNU.png" alt="" />

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Id"
                onChange={e => setUserName(e.target.value)}
              />
              <label htmlFor="floatingInput">Id</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Sign in
            </button>
            <p className="mt-5 mb-3 text-muted">&copy; 2021–2022</p>
          </form>
        </main>
      </div>
    </>
  );
}

export default AdminLogin;
