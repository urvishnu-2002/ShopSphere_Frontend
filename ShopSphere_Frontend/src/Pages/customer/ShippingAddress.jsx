import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function ShippingAddress() {
    const navigate = useNavigate();

    const [address, setAddresses] = useState([
        // {
        //     id: 1,
        //     pincode: "500001",
        //     city: "HYDERABAD",
        //     state: "TELANGANA",
        //     area: "48,5-4-203 beside Bala Bharathi high school, Kamalanagara",
        // },
    ]);

    const [selectedAddressId, setSelectedAddressId] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    const [form, setForm] = useState({
        pincode: "",
        city: "",
        state: "",
        area: "",
    });

    const [error, setError] = useState("");

    /* ---------------- ADD / EDIT SAVE ---------------- */
    const handleSaveAddress = () => {
        if (!form.pincode || !form.city || !form.state || !form.area) {
            setError("Please fill all required fields");
            return;
        }

        if (isEditing) {
            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === editingAddressId
                        ? { ...addr, ...form }
                        : addr
                )
            );
            setSelectedAddressId(editingAddressId);
        } else {
            const newAddress = {
                id: Date.now(),
                ...form,
            };
            setAddresses((prev) => [...prev, newAddress]);
            setSelectedAddressId(newAddress.id);
        }

        setForm({ pincode: "", city: "", state: "", area: "" });
        setIsEditing(false);
        setEditingAddressId(null);
        setShowAddForm(false);
        setError("");
    };

    /* ---------------- EDIT ADDRESS ---------------- */
    const handleEditAddress = (address) => {
        setForm({
            pincode: address.pincode,
            city: address.city,
            state: address.state,
            area: address.area,
        });

        setIsEditing(true);
        setEditingAddressId(address.id);
        setShowAddForm(true);
    };

    /* ---------------- CONTINUE ---------------- */
    const handleContinue = () => {
        const selected = address.find(a => a.id === selectedAddressId);
        if (!selected) {
            alert("Please select or add an address first.");
            return;
        }

        const formattedAddress = `${selected.area}, ${selected.city}, ${selected.state} - ${selected.pincode}`;

        // ✅ Save to multiple keys for maximum compatibility
        localStorage.setItem("pickupAddress", JSON.stringify(selected));
        localStorage.setItem("shipping_address", formattedAddress);
        localStorage.setItem("vendorShippingData", JSON.stringify({ shippingAddress: formattedAddress }));

        navigate("/shipping-method");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">

            {/* Header */}
            <header className="px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500">
                <h1 className="text-sm font-bold text-white">
                    ShopSphere Seller Central
                </h1>
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">

                    <h2 className="text-2xl font-bold mb-1">Pickup Address</h2>
                    <p className="text-gray-500 mb-8">
                        This is where your orders would get picked up from.
                    </p>

                    {/* ---------------- ADDRESS LIST ---------------- */}
                    {!showAddForm && (
                        <>
                            <div className="space-y-5">
                                {address.map(addr => (
                                    <label
                                        key={addr.id}
                                        className={`flex gap-4 p-5 border rounded-xl cursor-pointer
                                        ${selectedAddressId === addr.id
                                                ? "border-purple-600 bg-purple-50"
                                                : "border-gray-300 hover:border-purple-400"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                            className="accent-purple-600 mt-1"
                                        />

                                        <div className="text-sm text-gray-700">
                                            <p>{addr.area}</p>
                                            <p className="font-medium">{addr.city}</p>
                                            <p>{addr.state} - {addr.pincode}</p>

                                            {/* EDIT BUTTON */}
                                            <button
                                                type="button"
                                                onClick={() => handleEditAddress(addr)}
                                                className="mt-2 text-orange-400 text-sm hover:underline"
                                            >
                                                Edit address
                                            </button>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setShowAddForm(true);
                                    setIsEditing(false);
                                    setForm({ pincode: "", city: "", state: "", area: "" });
                                }}
                                className="mt-6 px-5 py-2 border border-purple-600 text-orange-400 rounded-lg
                                hover:bg-purple-50 transition font-medium"
                            >
                                + Add new address
                            </button>

                            <div className="mt-10">
                                <button
                                    onClick={handleContinue}
                                    className="w-full py-3 rounded-lg text-white font-medium
                                    bg-gradient-to-r from-purple-700 to-purple-500
                                    hover:from-purple-800 hover:to-purple-600 transition shadow-md"
                                >
                                    Save and Continue
                                </button>
                            </div>
                        </>
                    )}

                    {/* ---------------- ADD / EDIT FORM ---------------- */}
                    {showAddForm && (
                        <div className="border-2 border-purple-600 rounded-xl p-8 mt-6">

                            <h3 className="text-lg font-semibold mb-6">
                                {isEditing ? "Edit Pickup Address" : "Add new pickup address"}
                            </h3>

                            <div className="space-y-4">

                                <input
                                    placeholder="Pincode*"
                                    value={form.pincode}
                                    onChange={e => setForm({ ...form, pincode: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                />

                                <input
                                    placeholder="City*"
                                    value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                />

                                <select
                                    value={form.state}
                                    onChange={e => setForm({ ...form, state: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                >
                                    <option value="">State</option>
                                    <option value="TELANGANA">TELANGANA</option>
                                    <option value="KARNATAKA">KARNATAKA</option>
                                    <option value="TAMIL NADU">TAMIL NADU</option>
                                </select>

                                <textarea
                                    placeholder="Area, Street, Building No.*"
                                    value={form.area}
                                    onChange={e => setForm({ ...form, area: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                                />

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={handleSaveAddress}
                                        className="px-6 py-3 rounded-lg text-white font-medium
                                        bg-gradient-to-r from-orange-400 to-purple-500 hover:from-orange-600 hover:to-purple-700 transition"
                                    >
                                        Save and continue
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setIsEditing(false);
                                            setError("");
                                        }}
                                        className="px-6 py-3 rounded-lg border border-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
