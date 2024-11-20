import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRequired = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>Lütfen giriş yapınız</h1>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Giriş Yap
      </button>
    </div>
  );
};

export default LoginRequired;

