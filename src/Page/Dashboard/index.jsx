import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Dashboard</h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info" role="alert">
                <i className="fa-solid fa-circle-info"></i>
                <span className="ms-2">Welcome to your Dashboard!</span>
              </div>

              {user && (
                <div className="mb-4">
                  <h5>Your Profile</h5>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Name:</strong> {user.fname} {user.lname}
                    </li>
                    <li>
                      <strong>Email:</strong> {user.email}
                    </li>
                    {user.phone && (
                      <li>
                        <strong>Phone:</strong> {user.phone}
                      </li>
                    )}
                    {user.role && (
                      <li>
                        <strong>Role:</strong> {user.role}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <h5>Quick Actions</h5>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <span className="ms-2">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
