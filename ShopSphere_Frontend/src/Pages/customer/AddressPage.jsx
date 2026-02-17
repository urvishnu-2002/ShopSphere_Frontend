import { useState, useEffect } from "react";
import { getAddresses, addAddress, deleteAddress } from "../../api/axios";

export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useCurrent, setUseCurrent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [error, setError] = useState(""); // General page errors
  const [formError, setFormError] = useState(""); // Form validation errors

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      console.log("Fetched addresses:", data);
      const list = data.addresses || (Array.isArray(data) ? data : []);
      setSavedAddresses(list);

      // Auto-select first address if none selected
      if (list.length > 0 && !selectedAddress) {
        setSelectedAddress(list[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      // Only show error if the user is actually supposed to be logged in
      if (localStorage.getItem("accessToken")) {
        setError("Unable to load addresses. Please refresh.");
      }
    }
  };

  const emptyForm = {
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  // GPS

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !formData.name ||
      !formData.phone ||
      !formData.pincode ||
      !formData.address ||
      !formData.city ||
      !formData.state
    )
      return setFormError("All fields are required");

    if (formData.phone.length !== 10)
      return setFormError("Phone must be 10 digits");

    if (formData.pincode.length !== 6)
      return setFormError("Pincode must be 6 digits");

    try {
      await addAddress(formData);
      await fetchAddresses(); // Refresh from DB

      setUseCurrent(false);
      setShowForm(false);
      setEditId(null);
      setFormData(emptyForm);
      setFormError("");
    } catch (err) {
      console.error("Error saving address:", err);
      setFormError("Failed to save address. Please try again.");
    }
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      await fetchAddresses();
      if (selectedAddress === id) setSelectedAddress(null);
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Delivery Address
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Use Current Location */}
        <button
          onClick={getCurrentLocation}
          className="w-full bg-white border-2 border-dashed border-violet-400 text-violet-600 py-3 rounded-xl mb-6 hover:bg-violet-50 transition flex items-center justify-center gap-2"
        >
          <span>📍</span> Use Current Location
        </button>

        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="space-y-3 mb-6">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${selectedAddress === addr.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 bg-white hover:border-violet-300"
                  }`}
                onClick={() => setSelectedAddress(addr.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{addr.name}</p>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(addr);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Address Button */}
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setFormData(emptyForm);
            }}
            className="w-full bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 transition"
          >
            + Add New Address
          </button>
        )}

        {/* Address Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? "Edit Address" : "Add New Address"}
            </h2>

            {["name", "phone", "pincode", "city", "state"].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none ${formError && !formData[field] ? "border-red-500" : ""
                  }`}
              />
            ))}

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              rows="3"
              className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-violet-500 outline-none ${formError && !formData.address ? "border-red-500" : ""
                }`}
            />

            {formError && <p className="text-red-500 text-sm font-medium">{formError}</p>}

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 transition"
            >
              Save Address
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setFormData(emptyForm);
                setFormError("");
              }}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
