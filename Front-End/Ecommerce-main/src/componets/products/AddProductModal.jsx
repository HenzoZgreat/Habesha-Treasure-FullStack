import React, { useState, useEffect } from 'react';
import { FiX, FiArrowLeft } from 'react-icons/fi';
import productService from '../../service/productService';

const AddProductModal = ({ isOpen, onClose, onAddProduct, products }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    image: '',
    descriptionEn: '',
    descriptionAm: '',
    isFeatured: false
  });
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, statRes] = await Promise.all([
          productService.getUniqueCategories(products),
          productService.getUniqueStatuses(products)
        ]);
        setCategories(catRes.data);
        setStatuses(statRes.data);
      } catch (error) {
        console.error('Failed to fetch options:', error);
      }
    };
    fetchOptions();
  }, [products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setSaving(true);
    setErrors({});

    try {
      await productService.addProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      setErrors({ success: 'Product added successfully!' });
      await onAddProduct();
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'Active',
        image: '',
        descriptionEn: '',
        descriptionAm: '',
        isFeatured: false
      });
      setTimeout(onClose, 2000);
    } catch (error) {
      const errorMessage = error.response?.data || 'Error adding product';
      setErrors({ general: errorMessage });
      if (error.response && [401, 403].includes(error.response.status)) {
        localStorage.removeItem('token');
        window.location.href = '/SignIn';
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {errors.success && (
          <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
            {errors.success}
          </div>
        )}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {errors.general}
          </div>
        )}
        {Object.keys(errors).length > 0 && !errors.general && !errors.success && (
          <div className="mb-4 p-3 bg-gray-100 border-l-4 border-red-500 text-red-600 text-sm">
            <ul>
              {Object.entries(errors).map(([key, value], index) => (
                <li key={index}>• {value}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
          <SelectField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={['', ...categories]}
            error={errors.category}
            required
          />
          <InputField
            label="Price ($)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            required
          />
          <InputField
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            error={errors.stock}
            required
          />
          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statuses}
            error={errors.status}
          />
          <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          <TextAreaField label="Description (English)" name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} />
          <TextAreaField label="Description (Amharic)" name="descriptionAm" value={formData.descriptionAm} onChange={handleChange} />
          <CheckboxField name="isFeatured" label="Featured Product" checked={formData.isFeatured} onChange={handleChange} />

          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                {saving && <Spinner />}
                {saving ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, placeholder, type = 'text', required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-1D3F93 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-1D3F93 ${error ? 'border-red-500' : 'border-gray-300'}`}
    >
      {options.map(option => (
        <option key={option} value={option}>{option || 'Select Category'}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value || ''}
      onChange={onChange}
      rows="3"
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-1D3F93 border-gray-300"
    />
  </div>
);

const CheckboxField = ({ name, label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-1D3F93 border-gray-300 rounded focus:ring-1D3F93"
    />
    <label className="ml-2 text-sm font-medium text-gray-700">{label}</label>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default AddProductModal;