import { useState, type ChangeEvent, type FormEvent } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { login } from "../../shared/config/api";
import type { AxiosResponse, AxiosError } from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(formData)
      .then((res: AxiosResponse) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        navigate("/home");
      })
      .catch((error: AxiosError) => {
        const message =
          (error.response?.data as { message?: string })?.message ??
          "Server Error";
        alert(message);
      })
      .finally(() => {
        console.log("Okay");
      });
  };
  return (
    <div className="login-container">
      <div className="login-form-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-title"> Login</label>
          <input
            name="username"
            onChange={handleChange}
            value={formData.username}
            placeholder="Username"
            type="text"
          />
          <input
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
            type="password"
          />
          <button className="login-form-button" type="submit">
           Login
          </button>
          <div className="login-register-link">
            Don't have an account?{" "}
            <span
              className="login-register-link-text"
              onClick={() => navigate("/register")}
            >
              Register here.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
