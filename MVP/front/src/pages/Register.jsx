import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import api from "../api";

const roleOptions = [
  { value: "gledalac", label: "Slušalac (Gledalac)" },
  { value: "autor", label: "Podkast Kreator" },
];

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
    role: "gledalac",
  });

  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmedPassword)
      return alert("Unete lozinke nisu jednake!");

    setLoading(true);
    setError("");

    console.log(formData);
    try {
      const res = await api.post("/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log(res);
      if (res.data.success === false) {
        return setError(
          "Greška pri registraciji: " + JSON.stringify(res.data.data)
        );
      }

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.data.role);
      localStorage.setItem("username", res.data.data.username);

      navigate("/podcasts");
    } catch (err) {
      if (err.response?.status === 422) {
        const poruke = err.response.data.errors;
        const prvaGreska = Object.values(poruke)[0][0];
        setError(prvaGreska);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Pridruži se Podcast<span className="text-indigo-600">Hub-u</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Kreiraj svoj nalog besplatno.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 ">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <FormInput
            label="Korisničko ime"
            name="username"
            type="text"
            value={formData.username}
            placeholder="Username..."
            onChange={handleChange}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            placeholder="Email..."
            onChange={handleChange}
          />

          <FormInput
            label="Lozinka"
            name="password"
            type="password"
            value={formData.password}
            placeholder="••••••••"
            onChange={handleChange}
          />

          <FormInput
            label="Ponovi Lozinku"
            name="confirmedPassword"
            type="password"
            value={formData.confirmedPassword}
            placeholder="••••••••"
            onChange={handleChange}
          />

          <FormSelect
            label="Koja je tvoja uloga?"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
            placeholder="Izaberi ulogu"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-200 mt-4"
          >
            {loading ? "Registracija..." : "Zapocni avanturu"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Već imaš nalog?{" "}
          <Link
            to="/"
            className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors"
          >
            Prijavi se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
