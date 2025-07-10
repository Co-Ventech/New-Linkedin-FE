import React from "react";

const SidebarFilters = ({ categories, jobTypes, colors, countries, fields, filters, onFilterChange }) => (
  <div className="bg-white rounded-lg shadow p-4 space-y-6 sticky top-6">
    {/* Job Type */}
    <div>
      <h3 className="font-semibold mb-2">Job Type</h3>
      <div className="space-y-1">
        {jobTypes.map((type) => (
          <label key={type} className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="radio"
              name="jobType"
              value={type}
              checked={filters.type === type}
              onChange={() => onFilterChange("type", type)}
              className="accent-blue-600"
            />
            <span>{type}</span>
          </label>
        ))}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="jobType"
            value=""
            checked={filters.type === ""}
            onChange={() => onFilterChange("type", "")}
            className="accent-blue-600"
          />
          <span>All</span>
        </label>
      </div>
    </div>
    {/* Seniority Level (single-select) */}
    {/* <div>
      <h3 className="font-semibold mb-2">Seniority Level</h3>
      <div className="space-y-1">
        {categories.map((cat) => (
          <label key={cat} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filters.category === cat}
              onChange={() => onFilterChange("category", cat)}
              className="accent-blue-600"
            />
            <span>{cat}</span>
          </label>
        ))}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="category"
            value=""
            checked={filters.category === ""}
            onChange={() => onFilterChange("category", "")}
            className="accent-blue-600"
          />
          <span>All</span>
        </label>
      </div>
    </div> */}
    {/* Color (multi-select) */}
    {colors && colors.length > 0 && (
      <div>
        <h3 className="font-semibold mb-2">Color</h3>
        <div className="space-y-1">
          {colors.map((color) => (
            <label key={color} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="color"
                value={color}
                checked={filters.color.includes(color)}
                onChange={() => {
                  const newColors = filters.color.includes(color)
                    ? filters.color.filter((c) => c !== color)
                    : [...filters.color, color];
                  onFilterChange("color", newColors);
                }}
                className="accent-blue-600"
              />
              <span>{color}</span>
            </label>
          ))}
        </div>
      </div>
    )}
    {/* Country (multi-select) */}
    {countries && countries.length > 0 && (
      <div>
        <h3 className="font-semibold mb-2">Country</h3>
        <div className="space-y-1">
          {countries.map((country) => (
            <label key={country} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="country"
                value={country}
                checked={filters.country.includes(country)}
                onChange={() => {
                  const newCountries = filters.country.includes(country)
                    ? filters.country.filter((c) => c !== country)
                    : [...filters.country, country];
                  onFilterChange("country", newCountries);
                }}
                className="accent-blue-600"
              />
              <span>{country}</span>
            </label>
          ))}
        </div>
      </div>
    )}
    {/* Field (multi-select) */}
    {fields && fields.length > 0 && (
      <div>
        <h3 className="font-semibold mb-2">Field</h3>
        <div className="space-y-1">
          {fields.map((field) => (
            <label key={field} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="field"
                value={field}
                checked={filters.field.includes(field)}
                onChange={() => {
                  
                  const newFields = filters.field.includes(field)
                    ? filters.field.filter((f) => f !== field)
                    : [...filters.field, field];
                  onFilterChange("field", newFields);
                }}
                className="accent-blue-600"
              />
              <span>{field}</span>
            </label>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default SidebarFilters; 