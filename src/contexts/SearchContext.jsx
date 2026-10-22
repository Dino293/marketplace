import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const updateSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const updateSort = (sort) => {
    setSortBy(sort);
  };

  const setPriceRange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSortBy('latest');
    setMinPrice(0);
    setMaxPrice(0);
  };

  const value = {
    searchKeyword,
    selectedCategory,
    selectedBrand,
    sortBy,
    minPrice,
    maxPrice,
    updateSearch,
    selectCategory,
    selectBrand,
    updateSort,
    setPriceRange,
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

export default SearchContext;