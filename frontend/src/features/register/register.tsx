import { useNavigate } from "react-router-dom";
import "./register.css";
import { registerApi } from "../../shared/config/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useState } from "react";

// Define the types for form inputs
type RegisterFormInputs = {
  username: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // useForm hook for handling form validation and data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  // Function that runs when form is submitted
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setLoading(true); // show loading state
      await registerApi(data); // call API to register user
      toast.success("Registration successful! Please login.");
      navigate("/"); // go to login page
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false); // remove loading state
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-card">
        {/* handleSubmit will validate before running onSubmit */}
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="register-title">Register</label>

          {/* Username input */}
          <input
            placeholder="Username"
            autoComplete="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}

          {/* Password input */}
          <input
            placeholder="Password"
            type="password"
            autoComplete="new-password"
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

          {/* Submit button */}
          <button
            className="register-form-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Link to go back to login */}
        <div className="register-login-link">
          Already have an account?{" "}
          <span
            className="register-login-link-text"
            onClick={() => navigate("/")}
          >
            Login here.
          </span>
        </div>
      </div>
    </div>
  );
}
