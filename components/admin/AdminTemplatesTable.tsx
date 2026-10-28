"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CurrencyInr,
  Sparkle,
  Crown,
  MagnifyingGlass,
  Check,
  FloppyDisk,
  Eye,
  ArrowsClockwise,
  PencilSimple,
  Sliders,
  CheckCircle,
  Tag,
  Funnel,
  X,
  Percent,
  Lightning,
  Flame,
  ArrowRight,
} from "@phosphor-icons/react";

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  style: string;
  priceInr: number;
  originalPriceInr?: number;
  discountPercent?: number;
  discountName?: string;
  priceFormatted: string;
  originalPriceFormatted?: string;
  savingsAmountInr?: number;
  savingsFormatted?: string;
  isOnSale?: boolean;
  isActive: boolean;
  isPopular?: boolean;
  tag?: string;
  gradient?: string;
}

interface AdminTemplatesTableProps {
  templates: TemplateItem[];
  onRefresh: () => void;
}

export function AdminTemplatesTable({ templates = [], onRefresh }: AdminTemplatesTableProps) {
  const [items, setItems] = useState<TemplateItem[]>(templates);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modal State for Individual Template
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(1199);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number>(2999);
  const [editDiscountName, setEditDiscountName] = useState<string>("Wedding Season Offer");

  // Bulk Campaign Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkSellingPrice, setBulkSellingPrice] = useState<number>(1199);
  const [bulkOriginalPrice, setBulkOriginalPrice] = useState<number>(2999);
  const [bulkCampaignName, setBulkCampaignName] = useState<string>("Wedding Season Offer");

  // Sync with incoming props
  useEffect(() => {
    if (templates && templates.length > 0) {
      setItems(templates);
    }
  }, [templates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const filteredTemplates = items.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.style.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      t.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Open individual edit modal
  const handleStartEdit = (template: TemplateItem) => {
    setEditingTemplate(template);
    setEditSellingPrice(template.priceInr);
    setEditOriginalPrice(template.originalPriceInr || Math.max(2999, Math.round(template.priceInr * 2.2)));
    setEditDiscountName(template.discountName || "Wedding Season Offer");
  };

  // Quick Preset Calculator for Single Edit
  const handleApplyPresetDiscount = (discountPct: number) => {
    const orig = editOriginalPrice > 0 ? editOriginalPrice : 2999;
    const computedSelling = Math.max(0, Math.round(orig * (1 - discountPct / 100)));
    setEditSellingPrice(computedSelling);
    setEditDiscountName(`${discountPct}% OFF Limited Deal`);
  };

  // Quick Preset Calculator for Bulk Edit
  const handleApplyBulkPreset = (selling: number, original: number, name: string) => {
    setBulkSellingPrice(selling);
    setBulkOriginalPrice(original);
    setBulkCampaignName(name);
  };

  // Save Single Template Pricing & Discount
  const handleSaveIndividualPricing = async () => {
    if (!editingTemplate) return;
    const templateId = editingTemplate.id;

    if (isNaN(editSellingPrice) || editSellingPrice < 0) {
      showToast("Selling price must be a valid non-negative number.");
      return;
    }

    const calculatedDiscountPct =
      editOriginalPrice > editSellingPrice
        ? Math.round(((editOriginalPrice - editSellingPrice) / editOriginalPrice) * 100)
        : 0;

    setIsSaving(templateId);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          priceInr: editSellingPrice,
          originalPriceInr: editOriginalPrice,
          discountPercent: calculatedDiscountPct,
          discountName: editDiscountName.trim() || `${calculatedDiscountPct}% OFF Deal`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Updated pricing for ${editingTemplate.name}`);
        setEditingTemplate(null);
        
        // Optimistic local update
        setItems((prev) =>
          prev.map((t) =>
            t.id === templateId
              ? {
                  ...t,
                  priceInr: editSellingPrice,
                  originalPriceInr: editOriginalPrice,
                  discountPercent: calculatedDiscountPct,
                  discountName: editDiscountName.trim() || `${calculatedDiscountPct}% OFF Deal`,
                  priceFormatted: `₹${editSellingPrice.toLocaleString("en-IN")}`,
                  originalPriceFormatted: `₹${editOriginalPrice.toLocaleString("en-IN")}`,
                  savingsAmountInr: Math.max(0, editOriginalPrice - editSellingPrice),
                  savingsFormatted: `₹${Math.max(0, editOriginalPrice - editSellingPrice).toLocaleString("en-IN")}`,
                  isOnSale: editOriginalPrice > editSellingPrice,
                }
              : t
          )
        );
        onRefresh();
      } else {
        const errData = await res.json();
        showToast(`Error: ${errData.error || "Failed to update price"}`);
      }
    } catch (err: any) {
      showToast(`Network error: ${err?.message || "Failed to update"}`);
    } finally {
      setIsSaving(null);
    }
  };

  // Apply Bulk Discount Campaign Across All Templates
  const handleSaveBulkCampaign = async () => {
    if (isNaN(bulkSellingPrice) || bulkSellingPrice < 0) {
      showToast("Selling price must be a valid non-negative number.");
      return;
    }

    const calculatedDiscountPct =
      bulkOriginalPrice > bulkSellingPrice
        ? Math.round(((bulkOriginalPrice - bulkSellingPrice) / bulkOriginalPrice) * 100)
        : 0;

    setIsSaving("bulk");
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk",
          priceInr: bulkSellingPrice,
          originalPriceInr: bulkOriginalPrice,
          discountPercent: calculatedDiscountPct,
          discountName: bulkCampaignName.trim() || `${calculatedDiscountPct}% OFF Campaign`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`Bulk campaign applied! ${data.templates?.length || items.length} templates updated.`);
        setIsBulkModalOpen(false);
        onRefresh();
      } else {
        const errData = await res.json();
        showToast(`Error: ${errData.error || "Failed to apply bulk campaign"}`);
      }
    } catch (err: any) {
      showToast(`Network error: ${err?.message || "Failed to update"}`);
    } finally {
      setIsSaving(null);
    }
  };

  const handleToggleActive = async (template: TemplateItem) => {
    setIsSaving(template.id);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          isActive: !template.isActive,
        }),
      });

      if (res.ok) {
        showToast(`Template ${template.name} is now ${!template.isActive ? "Active" : "Paused"}`);
        setItems((prev) =>
          prev.map((t) =>
            t.id === template.id ? { ...t, isActive: !template.isActive } : t
          )
        );
        onRefresh();
      }
    } catch (_) {
    } finally {
      setIsSaving(null);
    }
  };

  // Stats calculation
  const totalCount = items.length;
  const activeCount = items.filter((t) => t.isActive).length;
  const prices = items.map((t) => t.priceInr);
  const avgSellingPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const originalPrices = items.map((t) => t.originalPriceInr || 2999);
  const avgOriginalPrice = originalPrices.length ? Math.round(originalPrices.reduce((a, b) => a + b, 0) / originalPrices.length) : 0;
  const avgDiscountRate = avgOriginalPrice > avgSellingPrice ? Math.round(((avgOriginalPrice - avgSellingPrice) / avgOriginalPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-[#073D31] text-[#F7F4ED] border border-[#C8A45E]/60 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle size={18} weight="fill" className="text-[#E1C98E] shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner: Ecommerce Campaign Manager */}
      <div className="rounded-2xl bg-gradient-to-r from-[#032A23] via-[#073D31] to-[#0A4D3E] p-4 sm:p-6 text-white border border-[#C8A45E]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C8A45E]/20 text-[#E1C98E] text-[10px] sm:text-xs font-bold uppercase tracking-wider font-sans border border-[#C8A45E]/30">
            <Flame size={13} weight="fill" className="text-[#E1C98E]" />
            <span>Storewide Discount Campaign System</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
            Dynamic Pricing &amp; Promotional Discounts
          </h2>
          <p className="text-xs text-stone-300 font-sans max-w-xl">
            Control selling prices, original strikethrough MRP, custom discount tags, and campaign banners across your wedding store.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A45E] to-[#E1C98E] hover:from-[#E1C98E] hover:to-[#C8A45E] text-[#032A23] font-bold text-xs uppercase tracking-wider font-sans shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lightning size={15} weight="fill" />
            <span>Apply Storewide Campaign</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Total Templates
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#18211E]">
              {totalCount}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">
              ({activeCount} Live)
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Avg. Selling Price
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#073D31]">
              ₹{avgSellingPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-stone-400 font-sans">checkout</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Avg. Reference MRP
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-400 line-through">
              ₹{avgOriginalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Avg. Discount Rate
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-600">
              {avgDiscountRate}% OFF
            </span>
            <span className="text-[10px] text-[#C8A45E] font-bold">
              Save ₹{(avgOriginalPrice - avgSellingPrice).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search template name, ID, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 outline-none focus:border-[#073D31] focus:bg-white transition-all font-sans"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Themes" },
            { id: "muslim", label: "Muslim / Nikah" },
            { id: "hindu", label: "Hindu / Vedic" },
            { id: "universal", label: "Universal / Royal" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                categoryFilter === cat.id
                  ? "bg-[#073D31] text-[#F7F4ED] shadow-xs font-bold"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Table with Full Ecommerce Discount Columns */}
      <div className="rounded-2xl bg-white border border-[#073D31]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 font-sans">
                <th className="py-3.5 px-4 sm:px-6">Template &amp; Theme</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Original MRP</th>
                <th className="py-3.5 px-4">Discount Badge &amp; Campaign</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-sans">
              {filteredTemplates.map((template) => {
                const isSavingThis = isSaving === template.id;
                const origPrice = template.originalPriceInr || Math.max(2999, Math.round(template.priceInr * 2.2));
                const discountPct =
                  template.discountPercent !== undefined
                    ? template.discountPercent
                    : origPrice > template.priceInr
                    ? Math.round(((origPrice - template.priceInr) / origPrice) * 100)
                    : 0;
                const savings = Math.max(0, origPrice - template.priceInr);

                return (
                  <tr
                    key={template.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    {/* Template Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#18211E] border border-[#C8A45E]/30 flex items-center justify-center text-[#E1C98E] font-serif text-xs font-bold shadow-xs shrink-0">
                          {template.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-stone-900 text-sm">
                              {template.name}
                            </span>
                            {template.tag && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[9px] uppercase tracking-wider">
                                {template.tag}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">
                            /{template.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium text-[11px]">
                        {template.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(template)}
                        disabled={isSavingThis}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          template.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                        }`}
                      >
                        {template.isActive ? "Active" : "Paused"}
                      </button>
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-[#073D31] text-sm">
                        ₹{template.priceInr.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Original MRP */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="line-through text-stone-400 text-xs">
                        ₹{origPrice.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Discount Badge & Campaign Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-1.5">
                          {discountPct > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {discountPct}% OFF
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-bold text-[10px]">
                              Regular Price
                            </span>
                          )}
                          {savings > 0 && (
                            <span className="text-[10px] text-stone-500 font-medium">
                              (Save ₹{savings.toLocaleString("en-IN")})
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded font-medium max-w-[170px] truncate">
                          {template.discountName || "Wedding Season Offer"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(template)}
                          className="px-3 py-1.5 rounded-lg bg-[#073D31] hover:bg-[#032A23] text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                        >
                          <PencilSimple size={13} weight="bold" />
                          <span>Edit Price</span>
                        </button>
                        <Link
                          href={`/preview/${template.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                          title="Open Live Preview"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Single Template Pricing & Discount Modal ── */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#C8A45E]/30 shadow-2xl overflow-hidden flex flex-col text-stone-900">
            {/* Header */}
            <div className="px-6 py-4 bg-[#073D31] text-[#F7F4ED] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <span>Edit Template Pricing &amp; Discount</span>
                </h3>
                <p className="text-xs text-stone-300 font-sans">
                  {editingTemplate.name} ({editingTemplate.category})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Customer Experience Preview
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-serif text-[#073D31]">
                      ₹{editSellingPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-medium text-stone-400 line-through">
                      ₹{editOriginalPrice.toLocaleString("en-IN")}
                    </span>
                    {editOriginalPrice > editSellingPrice && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {Math.round(((editOriginalPrice - editSellingPrice) / editOriginalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <span className="text-[10.5px] font-medium text-amber-900 mt-1 block">
                    🏷️ {editDiscountName || "Launch Offer"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">You Save</span>
                  <span className="text-sm font-bold text-[#C8A45E]">
                    ₹{Math.max(0, editOriginalPrice - editSellingPrice).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Input: Selling Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  1. Selling Price (What Customer Pays)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#073D31] focus:ring-1 focus:ring-[#073D31] outline-none text-sm font-bold font-mono"
                  />
                </div>
                <p className="text-[10.5px] text-stone-400 mt-1">This is the exact verified amount processed via Razorpay checkout.</p>
              </div>

              {/* Input: Original Price / MRP */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  2. Original Price / MRP (Strikethrough)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#073D31] focus:ring-1 focus:ring-[#073D31] outline-none text-sm font-bold font-mono"
                  />
                </div>
                <p className="text-[10.5px] text-stone-400 mt-1">Displayed with a strikethrough line to anchor value and drive conversion.</p>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Quick Discount Presets
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[40, 50, 60, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyPresetDiscount(pct)}
                      className="py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-[#073D31] hover:text-white font-bold text-xs text-stone-700 transition-colors cursor-pointer"
                    >
                      {pct}% OFF
                    </button>
                  ))}
                </div>
              </div>

              {/* Input: Discount Campaign Label */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  3. Discount Campaign Name / Badge
                </label>
                <input
                  type="text"
                  value={editDiscountName}
                  onChange={(e) => setEditDiscountName(e.target.value)}
                  placeholder="e.g. Wedding Season 60% OFF, Festive Special, Early Bird"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#073D31] focus:ring-1 focus:ring-[#073D31] outline-none text-xs font-medium"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveIndividualPricing}
                disabled={isSaving === editingTemplate.id}
                className="px-5 py-2 rounded-xl bg-[#073D31] hover:bg-[#032A23] text-white text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FloppyDisk size={14} weight="bold" />
                <span>{isSaving === editingTemplate.id ? "Saving..." : "Save Discount"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Campaign Modal ── */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#C8A45E]/30 shadow-2xl overflow-hidden flex flex-col text-stone-900">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#032A23] to-[#073D31] text-[#F7F4ED] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Lightning size={18} weight="fill" className="text-[#C8A45E]" />
                  <span>Apply Storewide Discount Campaign</span>
                </h3>
                <p className="text-xs text-stone-300 font-sans">
                  Instantly applies promotional pricing across all {totalCount} templates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              {/* Campaign Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Popular Campaign Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyBulkPreset(1199, 2999, "Wedding Season 60% OFF")}
                    className="p-3 rounded-xl border border-stone-200 hover:border-[#073D31] bg-stone-50 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-xs text-[#073D31] block">Wedding Season (60% OFF)</span>
                    <span className="text-[11px] text-stone-500 font-mono">₹1,199 from ₹2,999</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyBulkPreset(1499, 2999, "Festive Royale 50% OFF")}
                    className="p-3 rounded-xl border border-stone-200 hover:border-[#073D31] bg-stone-50 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-xs text-[#073D31] block">Festive Royale (50% OFF)</span>
                    <span className="text-[11px] text-stone-500 font-mono">₹1,499 from ₹2,999</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyBulkPreset(899, 2999, "Flash Launch 70% OFF")}
                    className="p-3 rounded-xl border border-stone-200 hover:border-[#073D31] bg-stone-50 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-xs text-[#073D31] block">Flash Launch (70% OFF)</span>
                    <span className="text-[11px] text-stone-500 font-mono">₹899 from ₹2,999</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyBulkPreset(999, 2499, "Early Bird Special 60% OFF")}
                    className="p-3 rounded-xl border border-stone-200 hover:border-[#073D31] bg-stone-50 hover:bg-amber-50/50 text-left transition-all cursor-pointer"
                  >
                    <span className="font-bold text-xs text-[#073D31] block">Early Bird Special</span>
                    <span className="text-[11px] text-stone-500 font-mono">₹999 from ₹2,499</span>
                  </button>
                </div>
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Target Selling Price (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    value={bulkSellingPrice}
                    onChange={(e) => setBulkSellingPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-stone-300 focus:border-[#073D31] outline-none text-sm font-bold font-mono"
                  />
                </div>
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Target Original Reference MRP (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    value={bulkOriginalPrice}
                    onChange={(e) => setBulkOriginalPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-stone-300 focus:border-[#073D31] outline-none text-sm font-bold font-mono"
                  />
                </div>
              </div>

              {/* Campaign Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Storewide Campaign Name
                </label>
                <input
                  type="text"
                  value={bulkCampaignName}
                  onChange={(e) => setBulkCampaignName(e.target.value)}
                  placeholder="e.g. Wedding Season 60% OFF"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-[#073D31] outline-none text-xs font-medium"
                />
              </div>

              {/* Calculated Rate Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                <span>Computed Discount Rate:</span>
                <span className="font-bold text-sm">
                  {bulkOriginalPrice > bulkSellingPrice
                    ? `${Math.round(((bulkOriginalPrice - bulkSellingPrice) / bulkOriginalPrice) * 100)}% OFF`
                    : "0% OFF"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBulkCampaign}
                disabled={isSaving === "bulk"}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#073D31] to-[#0A4D3E] hover:from-[#032A23] hover:to-[#073D31] text-white text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Lightning size={14} weight="fill" className="text-[#C8A45E]" />
                <span>{isSaving === "bulk" ? "Applying Campaign..." : "Apply to All 16 Templates"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
