import { useNavigate } from "react-router-dom";
import "./login.css";
import { login } from "../../shared/config/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data); // Call login API
      localStorage.setItem("token", res.data.token); // Save token
      localStorage.setItem("currentUser", JSON.stringify(res.data.user)); // Save user info
      toast.success("Login successful"); // Success toast
      navigate("/home"); // Redirect to home page
    } catch (error: any) {
      toast.error("Login failed"); // Error toast
    }
  };

  // Show toast for validation errors
  const showErrorToast = (field: string, message: string) => {
    toast.error(`${field}: ${message}`);
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit, (validationErrors) => {
            // Trigger toast for each validation error
            Object.keys(validationErrors).forEach((key) => {
              const error = validationErrors[key];
              showErrorToast(key, error.message as string);
            });
          })}
        >
          <label className="login-title"> Login</label>

          <input
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
          />

          <input
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
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
