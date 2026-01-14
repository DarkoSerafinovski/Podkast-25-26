import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      if (res.data.success === false) {
        return setError("Pogresni podaci.");
      }

      console.log(res.data);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.data.username);

      navigate("podcasts");
    } catch (err) {
      console.error(err);
      setError("Neispravni kredencijali ili greska sa serverom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Podcast<span className="text-indigo-600">Hub</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Tvoje priče.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-black uppercase tracking-widest text-red-600 border border-red-100">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-bold">
              !
            </span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <FormInput
              label="Email"
              type="email"
              value={email}
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <FormInput
              label="Lozinka"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-200 mt-4"
          >
            {loading ? "Sacekajte" : "Prijavi se"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Novi ste ovde?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors"
          >
            Napravi nalog
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
