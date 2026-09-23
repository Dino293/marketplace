import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const updateSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory(null);
  };

  const value = {
    searchKeyword,
    selectedCategory,
    updateSearch,
    selectCategory,
    clearFilters
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}

// Tambahkan export default
export default SearchContext;