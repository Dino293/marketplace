import React from "react";
import PropTypes from "prop-types";
import ProductItem from "./ProductItem";

export default function ProductList({ products, onDelete, onAddToCart, onRemoveFromCart }) {
  if (!products.length) {
    return <p className="text-gray-500">Tidak ada produk</p>;
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onDelete={onDelete}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
        />
      ))}
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func,
  onAddToCart: PropTypes.func,
  onRemoveFromCart: PropTypes.func,
};
