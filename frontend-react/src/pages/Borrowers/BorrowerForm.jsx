import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { ArrowLeft, Loader2, Save, User, MapPin, CreditCard, FileText } from "lucide-react";
import usePhLocations from "../../hooks/usePhLocations";

export default function BorrowerForm({ onSuccess, onCancel, initialData }) {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    // If in modal (onCancel exists), ignore routeId unless it's explicitly passed via initialData
    const borrowerId = initialData?.id || (!onCancel ? routeId : null);
    const isEditing = !!borrowerId;

    const { provinces, cities, barangays, fetchCities, fetchBarangays, loading: locationLoading } = usePhLocations();

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        province: "",
        city: "",
        barangay: "",
        street: "",
        id_type: "",
        id_number: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!borrowerId && !initialData);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                contact: initialData.contact || "",
                email: initialData.email || "",
                province: initialData.province || "",
                city: initialData.city || "",
                barangay: initialData.barangay || "",
                street: initialData.street || "",
                id_type: initialData.id_type || "",
                id_number: initialData.id_number || "",
                notes: initialData.notes || "",
            });
        } else if (borrowerId) {
            fetchBorrower();
        }
    }, [borrowerId, initialData]);

    // Effect to trigger fetches when initial data is loaded
    useEffect(() => {
        if (formData.province) {
            // Find province code to fetch cities
            const prov = provinces.find(p => p.name === formData.province);
            if (prov) fetchCities(prov.code);
        }
    }, [formData.province, provinces]);

    useEffect(() => {
        if (formData.city && cities.length > 0) {
            // Find city code to fetch barangays
            const city = cities.find(c => c.name === formData.city);
            if (city) fetchBarangays(city.code);
        }
    }, [formData.city, cities]);


    const fetchBorrower = async () => {
        try {
            const response = await axiosClient.get(`/borrowers/${borrowerId}`);
            setFormData({
                name: response.data.name,
                contact: response.data.contact || "",
                email: response.data.email || "",
                province: response.data.province || "",
                city: response.data.city || "",
                barangay: response.data.barangay || "",
                street: response.data.street || "",
                id_type: response.data.id_type || "",
                id_number: response.data.id_number || "",
                notes: response.data.notes || "",
            });
        } catch (error) {
            console.error("Error fetching borrower:", error);
            navigate("/borrowers");
        } finally {
            setInitialLoading(false);
        }
    };

    const handleProvinceChange = (e) => {
        const provinceName = e.target.value;
        setFormData(prev => ({ ...prev, province: provinceName, city: "", barangay: "" }));

        const prov = provinces.find(p => p.name === provinceName);
        if (prov) {
            fetchCities(prov.code);
        } else {
            // Clear cities if no province selected
            fetchCities(null);
        }
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setFormData(prev => ({ ...prev, city: cityName, barangay: "" }));

        const city = cities.find(c => c.name === cityName);
        if (city) {
            fetchBarangays(city.code);
        } else {
            fetchBarangays(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            if (isEditing) {
                const targetId = borrowerId || initialData.id;
                await axiosClient.put(`/borrowers/${targetId}`, formData);
            } else {
                await axiosClient.post("/borrowers", formData);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                navigate("/borrowers");
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error saving borrower:", error);
                alert("Failed to save borrower");
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not in a modal (no onCancel), show the full page layout with back button
    const isModal = !!onCancel;

    return (
        <div className={isModal ? "" : "max-w-4xl mx-auto"}>
            {!isModal && (
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/borrowers"
                        className="p-2.5 bg-white border border-border rounded-xl hover:bg-gray-50 transition-colors text-gray-500 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {isEditing ? "Edit Borrower" : "Add New Borrower"}
                        </h1>
                        <p className="text-gray-500 text-sm">Enter the borrower's details below.</p>
                    </div>
                </div>
            )}

            <div className={isModal ? "" : "bg-white rounded-2xl border border-border shadow-soft overflow-hidden"}>
                {/* Header Gradient Line */}
                <div className="h-1.5 bg-gradient-to-r from-primary to-primary-600 w-full"></div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field transition-shadow focus:shadow-md"
                                    placeholder="Enter borrower's full name"
                                    required
                                    autoFocus={isModal}
                                />
                                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="input-field transition-shadow focus:shadow-md"
                                    placeholder="e.g. 09123456789"
                                />
                                {errors?.contact && <p className="text-red-500 text-xs mt-1">{errors.contact[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field transition-shadow focus:shadow-md"
                                    placeholder="email@example.com"
                                />
                                {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Province</label>
                                <div className="relative">
                                    <select
                                        value={formData.province}
                                        onChange={handleProvinceChange}
                                        className="input-field appearance-none"
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map(p => (
                                            <option key={p.code} value={p.name}>{p.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors?.province && <p className="text-red-500 text-xs mt-1">{errors.province[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">City/Municipality</label>
                                <div className="relative">
                                    <select
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        className="input-field appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                                        disabled={!formData.province}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(c => (
                                            <option key={c.code} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors?.city && <p className="text-red-500 text-xs mt-1">{errors.city[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Barangay</label>
                                <div className="relative">
                                    <select
                                        value={formData.barangay}
                                        onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                                        className="input-field appearance-none disabled:bg-gray-50 disabled:text-gray-400"
                                        disabled={!formData.city}
                                    >
                                        <option value="">Select Barangay</option>
                                        {barangays.map(b => (
                                            <option key={b.code} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors?.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay[0]}</p>}
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street / House No.</label>
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="input-field transition-shadow focus:shadow-md"
                                    placeholder="House No., Street, Subdivision"
                                />
                                {errors?.street && <p className="text-red-500 text-xs mt-1">{errors.street[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Identification Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <CreditCard size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Identification</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    ID Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.id_type}
                                        onChange={(e) => setFormData({ ...formData, id_type: e.target.value })}
                                        className="input-field appearance-none"
                                    >
                                        <option value="">Select ID Type</option>
                                        <option value="Passport">Passport</option>
                                        <option value="Driver's License">Driver's License</option>
                                        <option value="National ID">National ID</option>
                                        <option value="SSS/GSIS">SSS/GSIS</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                {errors?.id_type && <p className="text-red-500 text-xs mt-1">{errors.id_type[0]}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    ID Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.id_number}
                                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                                    className="input-field transition-shadow focus:shadow-md"
                                    placeholder="Enter ID Number"
                                />
                                {errors?.id_number && <p className="text-red-500 text-xs mt-1">{errors.id_number[0]}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                        </div>

                        <div>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={4}
                                className="input-field resize-none transition-shadow focus:shadow-md"
                                placeholder="Any additional details or remarks about the borrower..."
                            />
                            {errors?.notes && <p className="text-red-500 text-xs mt-1">{errors.notes[0]}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-border">
                        {onCancel ? (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn btn-secondary px-6"
                            >
                                Cancel
                            </button>
                        ) : (
                            <Link
                                to="/borrowers"
                                className="btn btn-secondary px-6"
                            >
                                Cancel
                            </Link>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {!loading && <Save size={18} />}
                            Save Borrower
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
