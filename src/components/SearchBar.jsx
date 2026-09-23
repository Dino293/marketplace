// src/components/SearchBar.jsx
import React from "react";
import PropTypes from "prop-types";

export default function SearchBar({ keyword, onSearch, placeholder }) {
  const handleChange = (e) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder={placeholder || "Search..."}
        className="search-input"
        aria-label="Search notes"
      />
    </div>
  );
}

SearchBar.propTypes = {
  keyword: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};