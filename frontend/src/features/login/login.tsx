import { useNavigate } from "react-router-dom";
import "./login.css";
import { login } from "../../shared/config/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useState } from "react";

type LoginFormInputs = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const res = await login(data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      toast.success("Login successful");
      navigate("/home");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="login-title">Login</label>

          <input
            placeholder="Username"
            autoComplete="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}

          <input
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}

          <button
            className="login-form-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="login-register-link">
            Don’t have an account?{" "}
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
