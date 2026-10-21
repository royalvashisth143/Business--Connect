import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_PRESETS } from '../../data/defaultSiteSettings';
import { CategoryItem } from '../../types';
import { 
  Palette, 
  Sparkles, 
  Layout, 
  Sliders, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Type, 
  Megaphone, 
  ShieldCheck, 
  Save, 
  Eye,
  CheckCircle2,
  FolderTree
} from 'lucide-react';

export const SiteCustomizerModal: React.FC = () => {
  const { 
    isCustomizerOpen, 
    setIsCustomizerOpen, 
    siteSettings, 
    updateSiteSettings, 
    resetSiteSettings,
    addCategory,
    deleteCategory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'theme' | 'branding' | 'hero' | 'modules' | 'categories' | 'backup'>('theme');
  const [saveToast, setSaveToast] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // New Category Form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameHi, setNewCatNameHi] = useState('');
  const [newCatSubcats, setNewCatSubcats] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [showAddCatForm, setShowAddCatForm] = useState(false);

  if (!isCustomizerOpen) return null;

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    updateSiteSettings({
      theme: {
        ...siteSettings.theme,
        primaryColor: preset.primaryColor,
        primaryColorDark: preset.primaryColorDark,
        accentColor: preset.accentColor,
        presetName: preset.name,
      }
    });
    triggerToast();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(siteSettings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `business_connect_theme_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.branding || !parsed.theme || !parsed.hero) {
        throw new Error('Invalid theme JSON structure. Missing branding, theme, or hero objects.');
      }
      updateSiteSettings(parsed);
      triggerToast();
      setImportJsonText('');
      alert('Site customization settings imported successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      setImportError(msg);
    }
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const subcats = newCatSubcats
      ? newCatSubcats.split(',').map(s => s.trim()).filter(Boolean)
      : ['General Wholesale', 'OEM Supplies', 'Bulk Orders'];

    const newCategory: CategoryItem = {
      id,
      name: newCatName.trim(),
      nameHi: newCatNameHi.trim() || newCatName.trim(),
      icon: 'Package',
      count: 'New Category',
      image: newCatImage.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      subcategories: subcats
    };

    addCategory(newCategory);
    setNewCatName('');
    setNewCatNameHi('');
    setNewCatSubcats('');
    setNewCatImage('');
    setShowAddCatForm(false);
    triggerToast();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-800 my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#18231D] dark:text-[#F0F4F1]">
                  Live Site Customizer & Theme Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Fully Dynamic
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Customize colors, branding, hero copy, categories, and modules in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Changes Applied Live!
              </span>
            )}
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-gray-100 dark:border-gray-800 shrink-0 scrollbar-none">
          {[
            { id: 'theme', label: 'Theme & Colors', icon: Palette },
            { id: 'branding', label: 'Branding & Identity', icon: Type },
            { id: 'hero', label: 'Hero Section & Stats', icon: Sparkles },
            { id: 'modules', label: 'Modules & Toggles', icon: Sliders },
            { id: 'categories', label: 'Categories Manager', icon: FolderTree },
            { id: 'backup', label: 'Import / Export', icon: Download },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          
          {/* TAB 1: THEME & COLORS */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  1-Click Color Theme Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((p) => {
                    const isSelected = siteSettings.theme.presetName === p.name || siteSettings.theme.primaryColor === p.primaryColor;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleApplyPreset(p)}
                        className={`text-left p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 relative ${
                          isSelected
                            ? 'border-[#16834A] bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-[#16834A]/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-[#141C17]'
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: p.primaryColor }}
                        >
                          <Palette className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {p.description}
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primaryColor }}></span>
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primaryColorDark }}></span>
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                            <span className="text-[9px] font-mono text-gray-400 ml-1">{p.primaryColor}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-[#16834A]">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Hex Color Controls */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-4">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#16834A]" /> Custom Color Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={siteSettings.theme.primaryColor}
                        onChange={(e) => {
                          updateSiteSettings({
                            theme: {
                              ...siteSettings.theme,
                              primaryColor: e.target.value,
                              presetName: 'Custom Palette'
                            }
                          });
                          triggerToast();
                        }}
                        className="w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={siteSettings.theme.primaryColor}
                        onChange={(e) => {
                          updateSiteSettings({
                            theme: {
                              ...siteSettings.theme,
                              primaryColor: e.target.value,
                              presetName: 'Custom Palette'
                            }
                          });
                          triggerToast();
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Dark Shade (Hover / Header)
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={siteSettings.theme.primaryColorDark}
                        onChange={(e) => {
                          updateSiteSettings({
                            theme: {
                              ...siteSettings.theme,
                              primaryColorDark: e.target.value,
                              presetName: 'Custom Palette'
                            }
                          });
                          triggerToast();
                        }}
                        className="w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={siteSettings.theme.primaryColorDark}
                        onChange={(e) => {
                          updateSiteSettings({
                            theme: {
                              ...siteSettings.theme,
                              primaryColorDark: e.target.value,
                              presetName: 'Custom Palette'
                            }
                          });
                          triggerToast();
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={siteSettings.theme.accentColor}
                        onChange={(e) => {
                          updateSiteSettings({
                            theme: {
                              ...siteSettings.theme,
                              accentColor: e.target.value,
                            }
                          });
                          triggerToast();
                        }}
                        className="w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={siteSettings.theme.accentColor}
                        onChange={(e) => {
                          updateSiteSettings({
                            theme: {
                              ...siteSettings.theme,
                              accentColor: e.target.value,
                            }
                          });
                          triggerToast();
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BRANDING & IDENTITY */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Portal Brand Name *
                  </label>
                  <input
                    type="text"
                    value={siteSettings.branding.siteName}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, siteName: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-gray-400">Main title displayed in header and tabs</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Brand Highlight Word *
                  </label>
                  <input
                    type="text"
                    value={siteSettings.branding.siteNameHighlight}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, siteNameHighlight: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />
                  <span className="text-[10px] text-gray-400">Colored word in logo header (e.g. CONNECT)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Logo Initials / Short Code
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={siteSettings.branding.logoInitial}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, logoInitial: e.target.value.toUpperCase() }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden uppercase"
                  />
                  <span className="text-[10px] text-gray-400">Letters in brand icon tile (e.g. BC)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Site Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={siteSettings.branding.tagline}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, tagline: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Support Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={siteSettings.branding.helplinePhone}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, helplinePhone: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Support WhatsApp Business
                  </label>
                  <input
                    type="text"
                    value={siteSettings.branding.supportWhatsApp}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, supportWhatsApp: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
                  />
                </div>
              </div>

              {/* Announcement Bar Customizer */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Announcement Ticker Banner
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={siteSettings.branding.showAnnouncementTicker}
                      onChange={(e) => {
                        updateSiteSettings({
                          branding: { ...siteSettings.branding, showAnnouncementTicker: e.target.checked }
                        });
                        triggerToast();
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16834A]"></div>
                  </label>
                </div>
                {siteSettings.branding.showAnnouncementTicker && (
                  <input
                    type="text"
                    value={siteSettings.branding.announcementTickerText}
                    onChange={(e) => {
                      updateSiteSettings({
                        branding: { ...siteSettings.branding, announcementTickerText: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
                    placeholder="Enter announcement banner message"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HERO SECTION & STATS */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Headline Start
                  </label>
                  <input
                    type="text"
                    value={siteSettings.hero.headlineStart}
                    onChange={(e) => {
                      updateSiteSettings({
                        hero: { ...siteSettings.hero, headlineStart: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Headline Highlight
                  </label>
                  <input
                    type="text"
                    value={siteSettings.hero.headlineHighlight}
                    onChange={(e) => {
                      updateSiteSettings({
                        hero: { ...siteSettings.hero, headlineHighlight: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Headline End
                  </label>
                  <input
                    type="text"
                    value={siteSettings.hero.headlineEnd}
                    onChange={(e) => {
                      updateSiteSettings({
                        hero: { ...siteSettings.hero, headlineEnd: e.target.value }
                      });
                      triggerToast();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Subheadline / Description
                </label>
                <textarea
                  rows={2}
                  value={siteSettings.hero.subheadline}
                  onChange={(e) => {
                    updateSiteSettings({
                      hero: { ...siteSettings.hero, subheadline: e.target.value }
                    });
                    triggerToast();
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                />
              </div>

              {/* 4 Trust Metric Cards */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  4 Dynamic Trust Metric Cards
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101713]">
                    <span className="text-[10px] text-gray-400 block mb-1">Stat 1</span>
                    <input
                      type="text"
                      value={siteSettings.hero.stat1Value}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat1Value: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-200 dark:border-gray-700 mb-1"
                    />
                    <input
                      type="text"
                      value={siteSettings.hero.stat1Label}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat1Label: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 text-gray-500"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101713]">
                    <span className="text-[10px] text-gray-400 block mb-1">Stat 2</span>
                    <input
                      type="text"
                      value={siteSettings.hero.stat2Value}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat2Value: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-200 dark:border-gray-700 mb-1"
                    />
                    <input
                      type="text"
                      value={siteSettings.hero.stat2Label}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat2Label: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 text-gray-500"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101713]">
                    <span className="text-[10px] text-gray-400 block mb-1">Stat 3</span>
                    <input
                      type="text"
                      value={siteSettings.hero.stat3Value}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat3Value: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-200 dark:border-gray-700 mb-1"
                    />
                    <input
                      type="text"
                      value={siteSettings.hero.stat3Label}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat3Label: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 text-gray-500"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101713]">
                    <span className="text-[10px] text-gray-400 block mb-1">Stat 4</span>
                    <input
                      type="text"
                      value={siteSettings.hero.stat4Value}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat4Value: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-xs font-bold rounded border border-gray-200 dark:border-gray-700 mb-1"
                    />
                    <input
                      type="text"
                      value={siteSettings.hero.stat4Label}
                      onChange={(e) => {
                        updateSiteSettings({
                          hero: { ...siteSettings.hero, stat4Label: e.target.value }
                        });
                        triggerToast();
                      }}
                      className="w-full px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-700 text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MODULES & TOGGLES */}
          {activeTab === 'modules' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Enable or disable major business features and sections with one switch:
              </p>

              {[
                { key: 'enableB2BMarketplace', title: 'B2B Wholesale Portal', desc: 'MOQ orders, bulk buyer discounts, supplier tiers' },
                { key: 'enableB2CMarketplace', title: 'B2C Retail Marketplace', desc: 'Single unit shopping, direct customer checkout' },
                { key: 'enableDirectory', title: 'Verified Indian Directory', desc: 'Filterable supplier and factory catalog with phone & WhatsApp' },
                { key: 'enableRfqBoard', title: 'Public RFQ Board & Lead Exchange', desc: 'Post and bid on high-intent industrial tenders' },
                { key: 'enableGeolocationDiscovery', title: 'Nearby Geolocation Discovery', desc: 'Locate local verified suppliers within 50km radius' },
                { key: 'enableTrendingProducts', title: 'Trending Products Showcase', desc: 'Highlight top wholesale and consumer items on homepage' },
                { key: 'enableVerifiedSuppliers', title: 'Verified Manufacturers Grid', desc: 'Showcase trusted badges & star ratings' },
                { key: 'enableFaqSection', title: 'How It Works & FAQ Section', desc: 'Guide buyers and sellers through platform processes' },
              ].map(mod => {
                const isEnabled = (siteSettings.modules as any)[mod.key];
                return (
                  <div 
                    key={mod.key}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101713] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        {mod.desc}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={isEnabled}
                        onChange={(e) => {
                          updateSiteSettings({
                            modules: { ...siteSettings.modules, [mod.key]: e.target.checked }
                          });
                          triggerToast();
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16834A]"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Active Categories ({siteSettings.categories.length})
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Changes dynamically update Directory, Marketplace, Category Grid, and Header
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCatForm(!showAddCatForm)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddCatForm ? 'Cancel' : 'Add New Category'}</span>
                </button>
              </div>

              {/* Add category form */}
              {showAddCatForm && (
                <form onSubmit={handleAddNewCategory} className="p-4 rounded-xl border-2 border-[#16834A]/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                  <h5 className="text-xs font-bold text-[#16834A]">Add Custom Category</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Category Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Solar Energy & CleanTech"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Category Name (हिन्दी)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. सौर ऊर्जा और स्वच्छ तकनीक"
                        value={newCatNameHi}
                        onChange={(e) => setNewCatNameHi(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Subcategories (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Panels, Inverters, Battery Storage, Installation Services"
                      value={newCatSubcats}
                      onChange={(e) => setNewCatSubcats(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Banner Image URL (Unsplash or direct image link)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCatForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-[#16834A] text-white rounded-lg hover:bg-[#0D5F38]"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              )}

              {/* Categories list */}
              <div className="space-y-2">
                {siteSettings.categories.map((cat, idx) => (
                  <div 
                    key={cat.id || idx}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101713] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-10 h-10 rounded-lg object-cover shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {cat.nameHi} &bull; {cat.subcategories.slice(0, 3).join(', ')}...
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium hidden sm:inline">
                        {cat.count}
                      </span>
                      {siteSettings.categories.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                              deleteCategory(cat.id);
                              triggerToast();
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: IMPORT / EXPORT & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Export Theme & Site Setup
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Download current colors, branding, hero text, and categories as a backup JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJson}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  Import Theme JSON
                </h4>
                <p className="text-[11px] text-gray-500">
                  Paste previously exported theme JSON to restore or migrate settings:
                </p>
                <textarea
                  rows={4}
                  placeholder='{"branding": { ... }, "theme": { ... } }'
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713]"
                />
                {importError && (
                  <div className="text-xs text-red-600 font-medium">
                    Error: {importError}
                  </div>
                )}
                <button
                  onClick={handleImportJson}
                  disabled={!importJsonText.trim()}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 disabled:opacity-50 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Apply Imported Settings</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-red-200 dark:border-red-950/40 bg-red-50/40 dark:bg-red-950/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-700 dark:text-red-400">
                    Reset to Factory Defaults
                  </h4>
                  <p className="text-[11px] text-red-600/80 dark:text-red-400/80">
                    Restore original Emerald Bharat palette, seed categories, and default text.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all customizations to factory defaults?')) {
                      resetSiteSettings();
                      triggerToast();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer CTAs */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time CSS & State Sync Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#16834A] hover:bg-[#0D5F38] text-white transition shadow-sm cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
