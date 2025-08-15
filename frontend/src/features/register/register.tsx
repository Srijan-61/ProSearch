import { useState } from "react";
import "./register.css";
import { registerApi } from "../../shared/config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerApi(form);
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Registration failed");
      toast.error(`${err}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-card">
        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-title">Register</label>
          <input
            type="text"
            name="username"
            value={form.username}
            placeholder="Username"
            onChange={handleChange}
            required
          />
          {/* <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          /> */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            className="register-form-button"
            type="submit"
            disabled={loading}
          >
            Submit
          </button>
        </form>
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

export default Register;
