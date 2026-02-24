import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DecrCart, IncrCart, RemoveFromCart } from "../../Store";
import { getAddresses, addAddress, deleteAddress, updateAddress, reverseGeocode } from "../../api/axios";
import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaReceipt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCrosshairs,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartObjects = useSelector((state) => state.cart || []);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressError, setAddressError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyForm = {
    name: "",
    phone: "",
    pincode: "",
    address_line1: "",
    city: "",
    state: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  // Calculations
  const subtotal = cartObjects.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const deliveryCharges = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + tax + deliveryCharges;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      const list = data.addresses || (Array.isArray(data) ? data : []);
      setSavedAddresses(list);
      // ✅ NO auto-selection — user must explicitly click to choose their address.
      // Prevents addresses from one user's session leaking to another user's session.
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  // ── GPS: Use Current Location ──
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const data = await reverseGeocode(lat, lon);

          setFormData({
            name: formData.name || "",
            phone: formData.phone || "",
            pincode: data.address.postcode || "",
            address_line1: data.display_name || "",
            city:
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "",
            state: data.address.state || "",
          });

          setShowAddressForm(true);
          setSelectedAddress(null);
          setAddressError("");
        } catch {
          alert("Unable to fetch location details");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Location permission denied");
        setIsLocating(false);
      }
    );
  };

  // ── Form Handlers ──
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
      !formData.address_line1 ||
      !formData.city ||
      !formData.state
    )
      return setFormError("All fields are required");

    if (formData.phone.length !== 10)
      return setFormError("Phone must be 10 digits");

    if (formData.pincode.length !== 6)
      return setFormError("Pincode must be 6 digits");

    setIsSaving(true);
    try {
      if (editId) {
        // Update existing address in-place
        await updateAddress(editId, formData);
      } else {
        // Create new address
        await addAddress(formData);
      }
      await fetchAddresses();

      setShowAddressForm(false);
      setEditId(null);
      setFormData(emptyForm);
      setFormError("");
    } catch (err) {
      console.error("Error saving address:", err);
      setFormError("Failed to save address. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditId(addr.id);
    setShowAddressForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      await fetchAddresses();
      if (selectedAddress === id) setSelectedAddress(null);
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const cancelForm = () => {
    setShowAddressForm(false);
    setEditId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  // ── Checkout ──
  const handleCheckout = () => {
    if (savedAddresses.length === 0) {
      setAddressError("Please add a delivery address first");
      return;
    }
    if (!selectedAddress) {
      setAddressError("Please select a delivery address");
      return;
    }

    const address = savedAddresses.find((a) => a.id === selectedAddress);
    if (address) {
      localStorage.setItem("selectedAddress", JSON.stringify(address));
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ─── Left Column ─── */}
          <div className="flex-grow lg:w-2/3">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                <span className="bg-gradient-to-r from-orange-400 to-purple-500 text-white p-3 rounded-2xl shadow-lg shadow-orange-400/20">
                  🛒
                </span>
                Shopping Cart
              </h1>
              <span className="text-gray-400 font-bold bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">
                {cartObjects.length} Items Selected
              </span>
            </div>

            {cartObjects && cartObjects.length > 0 ? (
              <div className="space-y-6">
                {/* ── Cart Items ── */}
                {cartObjects.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="w-32 h-32 bg-gray-50 rounded-[24px] overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500 border border-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                        <span className="text-sm text-gray-400 font-bold">
                          Price:
                        </span>{" "}
                        ₹{item.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-5 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <button
                        onClick={() => dispatch(DecrCart(item))}
                        className="bg-white hover:bg-red-50 text-red-500 w-10 h-10 rounded-xl transition-all shadow-sm border border-gray-100 flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="text-lg font-black text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(IncrCart(item))}
                        className="bg-white hover:bg-purple-50 text-purple-500 w-10 h-10 rounded-xl transition-all shadow-sm border border-gray-100 flex items-center justify-center"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[120px]">
                      <div className="text-xl font-black text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => dispatch(RemoveFromCart(item))}
                        className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                      >
                        <FaTrashAlt size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* ══════════════════════════════════════════════
                    ADDRESS SECTION  
                   ══════════════════════════════════════════════ */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mt-2">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                      <FaMapMarkerAlt className="text-orange-400" />
                      Delivery Address
                    </h2>
                  </div>

                  {addressError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-bold">
                      {addressError}
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  {!showAddressForm && (
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <button
                        onClick={() => {
                          setShowAddressForm(true);
                          setEditId(null);
                          setFormData(emptyForm);
                          setAddressError("");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-purple-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all shadow-lg font-bold"
                      >
                        <FaPlus size={12} /> Add New Address
                      </button>

                      <button
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-orange-400 py-3 px-5 rounded-xl font-bold border-2 border-dashed border-orange-400 hover:bg-orange-50 transition-all disabled:opacity-50"
                      >
                        <FaCrosshairs
                          size={14}
                          className={isLocating ? "animate-spin" : ""}
                        />
                        {isLocating
                          ? "Detecting Location..."
                          : "📍 Use Current Location"}
                      </button>
                    </div>
                  )}

                  {/* ── Inline Address Form ── */}
                  {showAddressForm && (
                    <form
                      onSubmit={handleSubmit}
                      className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200 space-y-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-gray-800">
                          {editId ? "Edit Address" : "New Address"}
                        </h3>
                        <button
                          type="button"
                          onClick={cancelForm}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>

                      {/* Use Current Location inside form */}
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isLocating}
                        className="w-full flex items-center justify-center gap-2 bg-white text-orange-400 border-2 border-orange-200 py-3 rounded-xl hover:bg-orange-50 transition-all font-bold"
                      >
                        <FaCrosshairs
                          size={13}
                          className={isLocating ? "animate-spin" : ""}
                        />
                        {isLocating
                          ? "Detecting..."
                          : "Auto-fill from Current Location"}
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none transition text-gray-900 bg-white placeholder:text-gray-500 ${formError && !formData.name ? "border-red-400" : "border-gray-200"
                            }`}
                        />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone (10 digits)"
                          maxLength={10}
                          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-gray-900 placeholder:text-gray-500 ${formError && !formData.phone ? "border-red-400" : "border-gray-200"
                            }`}
                        />
                        <input
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="Pincode (6 digits)"
                          maxLength={6}
                          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-gray-900 placeholder:text-gray-500 ${formError && !formData.pincode ? "border-red-400" : "border-gray-200"
                            }`}
                        />
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-gray-900 placeholder:text-gray-500 ${formError && !formData.city ? "border-red-400" : "border-gray-200"
                            }`}
                        />
                        <input
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="State"
                          className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-gray-900 placeholder:text-gray-500 ${formError && !formData.state ? "border-red-400" : "border-gray-200"
                            }`}
                        />
                        <div className="sm:col-span-2">
                          <textarea
                            name="address_line1"
                            value={formData.address_line1}
                            onChange={handleChange}
                            placeholder="Datailed Address (Street, House No, etc.)"
                            rows="2"
                            className={`w-full border rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-gray-900 placeholder:text-gray-500 ${formError && !formData.address_line1 ? "border-red-400" : "border-gray-200"
                              }`}
                          />
                        </div>
                      </div>

                      {formError && (
                        <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">
                          {formError}
                        </p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="w-full bg-gradient-to-r from-orange-400 to-purple-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all shadow-lg font-bold disabled:opacity-50"
                        >
                          {isSaving ? "Saving Address..." : "Save Address"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ── Saved Addresses List ── */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Your Saved Addresses
                      </h3>
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddress(addr.id);
                            setAddressError("");
                          }}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id
                            ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200"
                            : "border-gray-100 bg-white hover:border-orange-200"
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedAddress === addr.id
                                  ? "border-orange-400 bg-orange-400"
                                  : "border-gray-300"
                                  }`}
                              >
                                {selectedAddress === addr.id && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-lg">
                                  {addr.name}
                                </p>
                                <p className="text-gray-500 font-medium">
                                  {addr.phone}
                                </p>
                                <p className="text-gray-600 mt-1 max-w-md">
                                  {addr.address_line1}, {addr.city}, {addr.state} -{" "}
                                  <span className="font-mono text-gray-500">
                                    {addr.pincode}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(addr);
                                }}
                                className="p-2 text-orange-400 hover:bg-orange-50 rounded-lg transition"
                                title="Edit Address"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(addr.id);
                                }}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                                title="Delete Address"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // ─── Empty Cart State ───
              <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
                <div className="mb-6 relative inline-block">
                  <div className="text-9xl opacity-20 transform rotate-12">
                    🛒
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-4xl bounce">
                    🕸️
                  </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                  Looks like you haven't added anything yet. Explore our products
                  and find something you love!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-orange-400 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-purple-700 transition-all shadow-xl shadow-orange-400/30 hover:-translate-y-1"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* ─── Right Column: Order Summary ─── */}
          {cartObjects.length > 0 && (
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-orange-100/50 border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <span className="bg-yellow-100 text-yellow-600 p-2 rounded-xl">
                    <FaReceipt size={20} />
                  </span>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Tax (18% GST)</span>
                    <span className="text-gray-900 font-bold">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Delivery Charges</span>
                    {deliveryCharges === 0 ? (
                      <span className="text-green-500 font-bold flex items-center gap-1">
                        <FaTruck size={12} /> Free
                      </span>
                    ) : (
                      <span className="text-gray-900 font-bold">
                        ₹{deliveryCharges.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-gray-100 my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-gray-900">
                      Total
                    </span>
                    <span className="text-3xl font-black text-orange-400">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!selectedAddress}
                  className="w-full bg-gradient-to-r from-orange-400 to-purple-500 text-white py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  Proceed to Payment
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                {!selectedAddress && (
                  <p className="text-center text-red-500 text-sm font-semibold mt-3 bg-red-50 py-2 rounded-lg">
                    ⚠️ Select an address to checkout
                  </p>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 mt-8">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                    <FaShieldAlt className="text-green-500 mb-1" size={20} />
                    <span className="text-xs font-bold text-gray-600">
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                    <FaCheckCircle className="text-orange-400 mb-1" size={20} />
                    <span className="text-xs font-bold text-gray-600">
                      Quality Assured
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;