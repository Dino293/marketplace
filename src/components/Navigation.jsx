import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSearch } from "../contexts/SearchContext";
import { useLocale } from "../contexts/LocaleContext";
import SearchBar from "./SearchBar";
import {
  User,
  ShoppingCart,
  Heart,
  Smartphone,
  Headphones,
  Mouse,
  Laptop,
  Tag,
  X,
  Filter
} from "lucide-react";
import "../styles/style.css";

export default function Navigation() {
  const { authUser, logout } = useAuth();
  const { 
    searchKeyword, 
    updateSearch, 
    selectedCategory, 
    selectCategory, 
    selectedBrand,
    clearFilters 
  } = useSearch();
  const { locale } = useLocale();
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const categories = [
    {
      icon: <Smartphone size={20} />,
      label: "Ponsel & Tablet",
      options: ["Smartphone", "Tablet", "Aksesoris Ponsel"],
      category: "smartphone"
    },
    {
      icon: <Headphones size={20} />,
      label: "Audio & Wearable",
      options: ["Headphone", "Earbuds", "Smartwatch"],
      category: "audio"
    },
    {
      icon: <Mouse size={20} />,
      label: "Aksesori",
      options: ["Mouse", "Keyboard", "USB"],
      category: "accessories"
    },
    {
      icon: <Laptop size={20} />,
      label: "Komputer & Gaming",
      options: ["Laptop", "PC", "Gaming Gear"],
      category: "laptop"
    },
    {
      icon: <Tag size={20} />,
      label: "Brand",
      options: ["Apple", "Samsung", "Xiaomi", "Realme", "Vivo", "Oppo"],
      category: "brand"
    },
  ];

  const toggleDropdown = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleCategorySelect = (option, categoryType) => {
    if (categoryType === "brand") {
      selectCategory(option); // Use selectCategory for brands too
    } else {
      selectCategory(option);
    }
    setActiveIndex(null);
    navigate("/"); // Navigate to home to see filtered results
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <>
      <nav className="navbar">
        {/* NAV LEFT */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src="/produk/logo.jpg" alt="Logo MyStore" />
          </Link>
        </div>

        {/* NAV CENTER */}
        {authUser && (
          <div className="nav-center">
            <SearchBar
              keyword={searchKeyword}
              onSearch={updateSearch}
              placeholder={locale === "id" ? "Cari produk..." : "Search products..."}
            />
          </div>
        )}

        {/* NAV RIGHT */}
        <div className="nav-right">
          {authUser ? (
            <>
              <Link to="/wishlist" className="nav-link" aria-label="Wishlist">
                <Heart size={24} />
              </Link>
              <Link to="/cart" className="nav-link" aria-label="Cart">
                <ShoppingCart size={24} />
              </Link>
              <button onClick={logout} className="nav-link" aria-label="Logout">
                <User size={24} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Masuk</Link>
              <Link to="/register" className="nav-link">Daftar</Link>
            </>
          )}
        </div>
      </nav>

      {/* SUB-NAV */}
      <div className="sub-nav-container">
        <ul className="sub-nav">
          {categories.map((cat, i) => (
            <li key={i} className="sub-nav-item">
              <div 
                className={`sub-nav-label ${selectedCategory === cat.label ? 'active' : ''}`}
                onClick={() => toggleDropdown(i)}
              >
                {cat.icon} <span className="label-text">{cat.label}</span>
              </div>
              {activeIndex === i && (
                <ul className="dropdown">
                  {cat.options.map((opt, idx) => (
                    <li 
                      key={idx} 
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(opt, cat.category);
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Active Filters Display */}
        {(selectedCategory) && (
          <div className="active-filters">
            <Filter size={16} />
            <span className="filter-label">
              {locale === "id" ? "Filter Aktif:" : "Active Filter:"}
            </span>
            <div className="filter-tag">
              {selectedCategory}
              <button 
                onClick={handleClearFilters}
                className="clear-filter-btn"
                aria-label={locale === "id" ? "Hapus filter" : "Clear filter"}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}