"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/site";
import { getProductPrice, ProductCard } from "@/components/ui";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export default function ShopFilters({ products }) {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const activeFilters = [
    ...(category ? [{ key: "category", label: CATEGORIES.find((item) => item.slug === category)?.name || category }] : []),
    ...(brand ? [{ key: "brand", label: brand }] : []),
    ...(minPrice !== "" ? [{ key: "minPrice", label: `From AED ${minPrice}` }] : []),
    ...(maxPrice !== "" ? [{ key: "maxPrice", label: `Up to AED ${maxPrice}` }] : []),
  ];

  const filteredProducts = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    const result = products.filter((product) => {
      const price = getProductPrice(product);
      return (!category || product.category === category)
        && (!brand || product.brand === brand)
        && (min === null || price >= min)
        && (max === null || price <= max);
    });

    switch (sort) {
      case "price-asc":
        return result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      case "price-desc":
        return result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      case "name-asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
  }, [products, category, brand, minPrice, maxPrice, sort]);

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [filtersOpen]);

  function clearAll() {
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSort("featured");
  }

  function removeFilter(key) {
    if (key === "category") setCategory("");
    if (key === "brand") setBrand("");
    if (key === "minPrice") setMinPrice("");
    if (key === "maxPrice") setMaxPrice("");
  }

  return (
    <>
      <div className="shop-filter-toolbar">
        <p aria-live="polite"><strong>{filteredProducts.length}</strong> of {products.length} products</p>
        <button
          type="button"
          className="shop-filter-toggle"
          aria-expanded={filtersOpen}
          aria-controls="shop-filter-panel"
          onClick={() => setFiltersOpen(true)}
        >
          <span aria-hidden="true">☷</span> Filters
          {activeFilters.length > 0 && <span className="filter-count">{activeFilters.length}</span>}
        </button>
      </div>

      {filtersOpen && (
        <button
          type="button"
          className="shop-filter-backdrop"
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      <div className="shop-filter-layout">
        <aside
          id="shop-filter-panel"
          className={`shop-filter-panel${filtersOpen ? " is-open" : ""}`}
          aria-label="Product filters"
        >
          <div className="shop-filter-heading">
            <h3>Refine your selection</h3>
            <button type="button" className="shop-filter-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters">×</button>
          </div>

          <label className="filter-field">
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </label>

          <label className="filter-field">
            <span>Brand</span>
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="">All brands</option>
              {brands.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <fieldset className="filter-field filter-price">
            <legend>Price range (AED)</legend>
            <div>
              <label>
                <span>Minimum</span>
                <input type="number" min="0" step="1" inputMode="decimal" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="From" />
              </label>
              <label>
                <span>Maximum</span>
                <input type="number" min="0" step="1" inputMode="decimal" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="To" />
              </label>
            </div>
          </fieldset>

          <label className="filter-field">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>

          <button type="button" className="shop-clear-button" onClick={clearAll} disabled={!activeFilters.length && sort === "featured"}>
            Clear all
          </button>
          <button type="button" className="shop-apply-button" onClick={() => setFiltersOpen(false)}>Show {filteredProducts.length} products</button>
        </aside>

        <div className="shop-results">
          {activeFilters.length > 0 && (
            <div className="shop-selected-filters" aria-label="Selected filters">
              <span>Applied:</span>
              {activeFilters.map((filter) => (
                <button key={filter.key} type="button" onClick={() => removeFilter(filter.key)} aria-label={`Remove ${filter.label} filter`}>
                  {filter.label} <span aria-hidden="true">×</span>
                </button>
              ))}
              <button type="button" className="shop-clear-inline" onClick={clearAll}>Clear all</button>
            </div>
          )}
          {filteredProducts.length > 0 ? (
            <div className="grid">{filteredProducts.map((product) => <ProductCard key={product.id} p={product} />)}</div>
          ) : (
            <div className="shop-empty">
              <h3>No products match these filters</h3>
              <p>Try adjusting your selection or clear all filters to see the full collection.</p>
              <button type="button" className="shop-clear-button" onClick={clearAll}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
