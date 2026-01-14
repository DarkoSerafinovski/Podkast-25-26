import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import api from "../api";
import UserCard from "../components/UserCard";
import FormInput from "../components/FormInput";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      const filteredUsers = res.data.data.filter(
        (user) => user.uloga !== "administrator"
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Greska pri ucitavanju korisnika:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Da li ste sigurni da zelite da obrisete ovog korisnika?")
    ) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        alert("Greska prilikom brisanja korisnika.");
      }
    }
  };

  const displayedUsers = users.filter(
    (u) =>
      u.korisnicko_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
              Upravljanje korisnicima
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Pregled i administracija autora i gledalaca podkasta.
            </p>
          </div>

          <FormInput
            placeholder="Pretrazi po imenu ili emailu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative md:w-80"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedUsers.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {!loading && displayedUsers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">
              Nema pronađenih korisnika.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
