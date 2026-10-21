import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockSeedData';
import { X, Plus, Trash2, Package, Sparkles } from 'lucide-react';

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setIsAddProductModalOpen, addProduct, currentUser } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES_DATA[0].name);
  const [brand, setBrand] = useState(currentUser?.companyName || 'Bharat Precision');
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [wholesalePrice, setWholesalePrice] = useState(1500);
  const [retailPrice, setRetailPrice] = useState(2200);
  const [moq, setMoq] = useState(10);
  const [priceUnit, setPriceUnit] = useState('Piece');
  const [stockQuantity, setStockQuantity] = useState(250);
  const [deliveryTime, setDeliveryTime] = useState('3-5 Days');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');

  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Material Grade', value: 'High Tensile Steel / ISO Standard' },
    { key: 'Warranty', value: '1 Year Manufacturer Guarantee' }
  ]);

  if (!isAddProductModalOpen) return null;

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', text: string) => {
    const updated = [...specs];
    updated[index][field] = text;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const specificationsObj: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim()) specificationsObj[s.key.trim()] = s.value.trim();
    });

    addProduct({
      name,
      category,
      brand,
      sku,
      wholesalePrice: Number(wholesalePrice) || 100,
      retailPrice: Number(retailPrice) || 150,
      moq: Number(moq) || 1,
      priceUnit,
      stockQuantity: Number(stockQuantity) || 50,
      deliveryTime,
      description,
      images: [imageUrl],
      specifications: specificationsObj,
    });

    setIsAddProductModalOpen(false);
    alert('Product successfully added to your catalog and published to the marketplace!');
  };

  const sampleImages = [
    { label: 'Machinery', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
    { label: 'Textiles', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Solar/Tech', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' },
    { label: 'Packaging', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
    { label: 'Food Grain', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Seller & Supplier Catalog
            </span>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              Add New Product Listing
            </h3>
          </div>
          <button
            onClick={() => setIsAddProductModalOpen(false)}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Product Title / Model Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 5kW Hybrid On-Grid Solar Inverter with Wi-Fi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              >
                {CATEGORIES_DATA.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                SKU / Part Number
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Pricing & MOQ Grid */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Pricing & Order Unit (INR ₹)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Wholesale Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Retail Price (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Min. Order (MOQ) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={moq}
                  onChange={(e) => setMoq(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Price Unit *
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1]"
                >
                  <option value="Piece">Piece</option>
                  <option value="Unit">Unit</option>
                  <option value="Set">Set</option>
                  <option value="Meter">Meter</option>
                  <option value="Kg">Kg</option>
                  <option value="Metric Ton">Metric Ton</option>
                  <option value="Box">Box</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Image URL with Preset Chips */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Primary Product Photo URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] mb-2"
            />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-gray-400">Presets:</span>
              {sampleImages.map(sm => (
                <button
                  key={sm.label}
                  type="button"
                  onClick={() => setImageUrl(sm.url)}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 text-gray-600 dark:text-gray-300 hover:text-[#16834A] cursor-pointer"
                >
                  {sm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specifications Builder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                Technical Specifications & Standards
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-[11px] font-bold text-[#16834A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Spec Row
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Feature (e.g. Tolerance / Voltage)"
                    value={s.key}
                    onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. ±0.01mm / 415V)"
                    value={s.value}
                    onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(i)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Full Product Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe application suitability, manufacturing process, packing details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="px-4 py-2 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold shadow-md transition cursor-pointer"
            >
              Publish Product to Marketplace
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
