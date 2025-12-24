import React, { useState, useEffect } from "react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
}

interface ContactsProps {
  token: string;
}

export default function Contacts({ token }: ContactsProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const API_BASE = "https://galhotrservice.com";

  const fetchContacts = async () => {
    const res = await fetch(`${API_BASE}/api/contact/get`);
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id: string) => {
    await fetch(`${API_BASE}/api/contact/${id}`, {
      method: "DELETE",
    });
    fetchContacts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Contacts</h2>
          <span className="text-sm text-gray-500">
            Total: {contacts.length}
          </span>
        </div>

        {/* EMPTY STATE */}
        {contacts.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow">
            No contacts found
          </div>
        )}

        {/* CONTACT LIST */}
        <div className="grid gap-6">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {c.name}
                  </h3>
                  <p className="text-sm text-blue-600">{c.email}</p>
                </div>

                <button
                  onClick={() => deleteContact(c._id)}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>

              {/* MESSAGE */}
              <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
                {c.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
