import React from "react";
import "./AdminLogin.css";

function AdminLogin(props) {
  return (
    <>
      <div className="text-center">
        <main className="form-signin">
          <form>
            <img className="mb-4" src="/CBNU.png" alt="" />

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Id"
              />
              <label htmlFor="floatingInput">Id</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
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
