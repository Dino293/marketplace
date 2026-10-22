import React from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  if (!products || !products.length) {
    return <p className="text-slate-400 text-xs">Tidak ada produk</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};
