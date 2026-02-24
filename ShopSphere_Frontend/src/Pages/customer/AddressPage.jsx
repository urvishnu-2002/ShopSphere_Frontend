import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAddresses, addAddress, deleteAddress, updateAddress, reverseGeocode } from "../../api/axios";
import { validateName, validatePhone, validatePincode, validateCity } from "../../utils/validators";

export default function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;

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
          const data = await reverseGeocode(lat, lon);

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

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear per-field error on change
    setFieldErrors(prev => ({ ...prev, [name]: null }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const errs = {};

    const nameErr = validateName(formData.name, "Name");
    const phoneErr = validatePhone(formData.phone);
    const pincodeErr = validatePincode(formData.pincode);
    const cityErr = validateCity(formData.city);
    if (!formData.address || formData.address.trim().length < 5) errs.address = "Please enter a full address.";
    if (!formData.state || formData.state.trim().length < 2) errs.state = "State is required.";
    if (nameErr) errs.name = nameErr;
    if (phoneErr) errs.phone = phoneErr;
    if (pincodeErr) errs.pincode = pincodeErr;
    if (cityErr) errs.city = cityErr;

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setFormError(Object.values(errs)[0]);
      return;
    }

    try {
      if (editId) {
        await updateAddress(editId, formData);
      } else {
        await addAddress(formData);
      }
      await fetchAddresses();
      setUseCurrent(false);
      setShowForm(false);
      setEditId(null);
      setFormData(emptyForm);
      setFormError("");
      setFieldErrors({});
      if (returnTo) {
        navigate(returnTo, { state: { refresh: Date.now() } });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Delivery Address
          </h1>
          {returnTo && (
            <button
              onClick={() => navigate(returnTo, { state: { refresh: Date.now() } })}
              className="bg-white text-orange-400 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all border border-orange-200"
            >
              ← Back to Cart
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Use Current Location */}
        <button
          onClick={getCurrentLocation}
          className="w-full bg-white border-2 border-dashed border-orange-400 text-orange-400 py-3 rounded-xl mb-6 hover:bg-orange-50 transition flex items-center justify-center gap-2"
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
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-300"
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
                      className="text-orange-400 hover:text-orange-400 text-sm font-bold"
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
            className="w-full bg-orange-400 text-white py-3 rounded-xl hover:bg-orange-400 transition"
          >
            + Add New Address
          </button>
        )}

        {/* Address Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg space-y-4"
            noValidate
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? "Edit Address" : "Add New Address"}
            </h2>

            {/* Name */}
            <div>
              <input
                name="name" value={formData.name} onChange={handleChange}
                placeholder="Full Name (letters only, >3 chars)"
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 bg-white placeholder:text-gray-500 ${fieldErrors.name ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.name && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fieldErrors.name}</p>}
            </div>
            {/* Phone */}
            <div>
              <input
                name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Phone (10 digits only)"
                maxLength={10}
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 bg-white placeholder:text-gray-500 ${fieldErrors.phone ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fieldErrors.phone}</p>}
            </div>
            {/* Pincode */}
            <div>
              <input
                name="pincode" value={formData.pincode} onChange={handleChange}
                placeholder="Pincode (6 digits)"
                maxLength={6}
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 bg-white placeholder:text-gray-500 ${fieldErrors.pincode ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.pincode && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fieldErrors.pincode}</p>}
            </div>
            {/* City */}
            <div>
              <input
                name="city" value={formData.city} onChange={handleChange}
                placeholder="City"
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 bg-white placeholder:text-gray-500 ${fieldErrors.city ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.city && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fieldErrors.city}</p>}
            </div>
            {/* State */}
            <div>
              <input
                name="state" value={formData.state} onChange={handleChange}
                placeholder="State"
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 bg-white placeholder:text-gray-500 ${fieldErrors.state ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.state && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fieldErrors.state}</p>}
            </div>
            {/* Address */}
            <div>
              <textarea
                name="address" value={formData.address} onChange={handleChange}
                placeholder="Full Address (door no, street, area)"
                rows="3"
                className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none text-gray-900 bg-white placeholder:text-gray-500 ${fieldErrors.address ? "border-red-500 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.address && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fieldErrors.address}</p>}
            </div>

            {formError && <p className="text-red-500 text-sm font-medium">{formError}</p>}

            <button type="submit" className="w-full bg-orange-400 text-white py-3 rounded-xl hover:bg-orange-500 transition font-bold">
              Save Address
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditId(null); setFormData(emptyForm); setFormError(""); setFieldErrors({}); }}
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