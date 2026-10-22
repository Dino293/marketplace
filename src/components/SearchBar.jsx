// src/components/SearchBar.jsx
import React from "react";
import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";
import { useLocale } from "../contexts/LocaleContext";

export default function SearchBar({ keyword, onSearch, placeholder }) {
  const searchCtx = useSearch();
  const { locale } = useLocale();

  const activeKeyword = keyword !== undefined ? keyword : (searchCtx?.searchKeyword || "");
  const activeOnSearch = onSearch || searchCtx?.updateSearch;

  const handleChange = (e) => {
    activeOnSearch?.(e.target.value);
  };

  const handleClear = () => {
    activeOnSearch?.("");
  };

  const defaultPlaceholder = locale === "id" 
    ? "Cari gadget, smartphone, aksesoris resmi..." 
    : "Search gadgets, smartphones, accessories...";

  return (
    <div className="relative w-full max-w-xl group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={activeKeyword}
        onChange={handleChange}
        placeholder={placeholder || defaultPlaceholder}
        className="w-full pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-full border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-inner"
        aria-label="Cari produk marketplace"
      />
      {activeKeyword && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Hapus kata kunci"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  keyword: PropTypes.string,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
};