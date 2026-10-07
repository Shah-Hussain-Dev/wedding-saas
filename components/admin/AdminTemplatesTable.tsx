"use client";

import { useState } from "react";
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
} from "@phosphor-icons/react";

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  style: string;
  priceInr: number;
  priceFormatted: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(1199);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Price Presets
  const PRICE_PRESETS = [999, 1199, 1499, 1999, 2499];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.style.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      t.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (template: TemplateItem) => {
    setEditingId(template.id);
    setEditPriceValue(template.priceInr);
  };

  const handleSavePrice = async (templateId: string, customPrice?: number) => {
    const priceToSave = customPrice !== undefined ? customPrice : editPriceValue;
    if (isNaN(priceToSave) || priceToSave < 0) return;

    setIsSaving(templateId);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          priceInr: priceToSave,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Price updated to ₹${priceToSave.toLocaleString("en-IN")}`);
        setEditingId(null);
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
        onRefresh();
      }
    } catch (_) {
    } finally {
      setIsSaving(null);
    }
  };

  // Stats calculation
  const totalCount = templates.length;
  const activeCount = templates.filter((t) => t.isActive).length;
  const prices = templates.map((t) => t.priceInr);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

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
              ({activeCount} Active)
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Average Price
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#073D31]">
              ₹{avgPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Lowest Price
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">
              ₹{minPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#073D31]/10 shadow-xs">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 font-sans block">
            Highest Price
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C8A45E]">
              ₹{maxPrice.toLocaleString("en-IN")}
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
            placeholder="Search by template name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 outline-none focus:border-[#073D31] focus:bg-white transition-all"
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

      {/* Templates Table / Grid */}
      <div className="rounded-2xl bg-white border border-[#073D31]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 font-sans">
                <th className="py-3.5 px-4 sm:px-6">Template &amp; Theme</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Live Price (INR)</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredTemplates.map((template) => {
                const isEditing = editingId === template.id;
                const isSavingThis = isSaving === template.id;

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

                    {/* Price & Inline Edit */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-[#073D31]">₹</span>
                            <input
                              type="number"
                              value={editPriceValue}
                              onChange={(e) => setEditPriceValue(Number(e.target.value))}
                              autoFocus
                              className="w-24 px-2 py-1 rounded-lg bg-white border-2 border-[#073D31] text-xs font-bold text-[#073D31] outline-none shadow-xs font-mono"
                            />
                            <button
                              onClick={() => handleSavePrice(template.id)}
                              disabled={isSavingThis}
                              className="px-2.5 py-1 rounded-lg bg-[#073D31] hover:bg-[#032A23] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <FloppyDisk size={12} weight="bold" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 rounded-lg bg-stone-200 text-stone-600 hover:bg-stone-300 text-[11px] cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </div>

                          {/* Quick Preset Buttons */}
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-stone-400 font-sans">Quick:</span>
                            {PRICE_PRESETS.map((p) => (
                              <button
                                key={p}
                                onClick={() => {
                                  setEditPriceValue(p);
                                  handleSavePrice(template.id, p);
                                }}
                                className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-[#073D31] hover:text-white text-[9.5px] font-mono text-stone-600 transition-colors cursor-pointer"
                              >
                                ₹{p}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#073D31]">
                            {template.priceFormatted}
                          </span>
                          <button
                            onClick={() => handleStartEdit(template)}
                            className="p-1 rounded-md text-stone-400 hover:text-[#073D31] hover:bg-stone-100 transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                            title="Edit Price"
                          >
                            <PencilSimple size={13} weight="bold" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/preview/${template.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#073D31] hover:text-[#F7F4ED] text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye size={13} weight="bold" />
                          <span>Preview</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTemplates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <p className="text-sm font-medium">No templates matched your filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
