import { useState } from "react";

export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useCurrent, setUseCurrent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const [savedAddresses, setSavedAddresses] = useState([]);

  const emptyForm = {
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  /* ================= GPS ================= */

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          const data = await res.json();

          setFormData({
            name: "",
            phone: "",
            pincode: data.address.postcode || "",
            address: data.display_name || "",
            city: data.address.city || data.address.town || "",
            state: data.address.state || ""
          });

          setShowForm(true);
          setUseCurrent(true);
          setSelectedAddress(null);
        } catch {
          alert("Unable to fetch address");
        }
      },
      () => alert("Location permission denied")
    );
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.pincode ||
      !formData.address ||
      !formData.city ||
      !formData.state
    )
      return setError("All fields are required");

    if (formData.phone.length !== 10)
      return setError("Phone must be 10 digits");

    if (formData.pincode.length !== 6)
      return setError("Pincode must be 6 digits");

    setError("");

    if (editId) {
      setSavedAddresses(
        savedAddresses.map((a) =>
          a.id === editId ? { ...formData, id: editId } : a
        )
      );
      setSelectedAddress(editId);
    } else {
      const newId = Date.now();
      setSavedAddresses([...savedAddresses, { ...formData, id: newId }]);
      setSelectedAddress(newId);
    }

    setUseCurrent(false);
    setShowForm(false);
    setEditId(null);
    setFormData(emptyForm);
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSavedAddresses(savedAddresses.filter((a) => a.id !== id));
    if (selectedAddress === id) setSelectedAddress(null);
  };

  return (
  <div className="max-w-5xl mx-auto p-6">

    <h2 className="text-2xl font-bold mb-6">Select Delivery Address</h2>

    {/* CURRENT LOCATION */}
    <div className="bg-white rounded-2xl shadow-lg p-5 flex gap-4 mb-6 hover:-translate-y-0.5 transition-all">

      <input type="radio" checked={useCurrent} onChange={getCurrentLocation} />

      <div>
        <p className="font-bold">Use Current Location</p>
        <p className="text-sm text-gray-500">Auto detect your address using GPS</p>
      </div>

    </div>

    {/* SAVED ADDRESSES */}
    <div className="grid md:grid-cols-2 gap-6">

      {savedAddresses.map((addr, i) => (
        <div
          key={addr.id}
          className={`bg-white rounded-3xl p-6 shadow-lg transition-all hover:-translate-y-0.5 border-2 ${
            selectedAddress === addr.id ? "border-emerald-600" : "border-transparent"
          }`}
        >

          {i === 0 && (
            <span className="absolute right-4 top-4 bg-emerald-600 text-white text-xs px-3 py-1 rounded-lg">
              Default
            </span>
          )}

          <div className="flex gap-4">

            <input
              type="radio"
              checked={!useCurrent && selectedAddress === addr.id}
              onChange={() => {
                setUseCurrent(false);
                setSelectedAddress(addr.id);
              }}
            />

            <div>
              <p className="font-bold">{addr.name}</p>
              <p className="text-sm text-gray-500">{addr.address}, {addr.city}</p>
              <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
            </div>

          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t text-sm font-bold">
            <button onClick={() => handleEdit(addr)} className="text-emerald-600 hover:underline">Edit</button>
            <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:underline">Delete</button>
          </div>

        </div>
      ))}

    </div>

    <button
      className="mt-8 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
      onClick={() => setShowForm(true)}
    >
      + Add New Address
    </button>

    {/* FORM */}
    {showForm && (
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-lg p-8 mt-10 space-y-5 animate-in fade-in"
      >

        <div className="grid md:grid-cols-2 gap-4">

          {["name","phone","pincode","city","state"].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
              className={`border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none ${
                error && !formData[field] ? "border-red-500" : ""
              }`}
            />
          ))}

        </div>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Full Address"
          rows="3"
          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none ${
            error && !formData.address ? "border-red-500" : ""
          }`}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
        >
          {editId ? "Update Address" : "Save Address"}
        </button>

      </form>
    )}

  </div>
);

}



