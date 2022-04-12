import React from "react";
import "./BootstrapTemplate/sb-admin-2.css";

const NotFound = () => {
  return (
    <>
      <body id="page-top">
        <div id="wrapper">
          <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
              <div class="container-fluid">
                <div class="text-center">
                  <div class="error mx-auto" data-text="404">
                    404
                  </div>
                  <p class="lead text-gray-800 mb-5">Page Not Found</p>
                </div>
              </div>
            </div>
            <footer class="sticky-footer bg-white">
              <div class="container my-auto">
                <div class="copyright text-center my-auto">
                  <span>Copyright &copy; smartorder.ml 2022</span>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up"></i>
        </a>
        <script src="vendor/jquery/jquery.min.js"></script>
        <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
        <script src="js/sb-admin-2.min.js"></script>
      </body>
    </>
  );
};

export default NotFound;
