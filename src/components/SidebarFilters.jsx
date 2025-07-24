import React from "react";

const SidebarFilters = ({ paymentVerified, categories, jobTypes, colors, countries, levels, domains = [], filters, onFilterChange }) => (
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
    {/* Status (engaged/not_engaged) */}
  <div>
  <h3 className="font-semibold mb-2">Status</h3>
  <div className="space-y-1">
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="status"
        value=""
        checked={filters.status === ""}
        onChange={() => onFilterChange("status", "")}
        className="accent-blue-600"
      />
      <span>All</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="status"
        value="engaged"
        checked={filters.status === "engaged"}
        onChange={() => onFilterChange("status", "engaged")}
        className="accent-blue-600"
      />
      <span>Engaged</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="status"
        value="not_engaged"
        checked={filters.status === "not_engaged"}
        onChange={() => onFilterChange("status", "not_engaged")}
        className="accent-blue-600"
      />
      <span>Not Engaged</span>
    </label>
  </div>
</div>

{/* Client History */}
<div>
  <h3 className="font-semibold mb-2">Client History</h3>
  <div className="space-y-1">
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="clientHistory"
        value=""
        checked={filters.clientHistory === ""}
        onChange={() => onFilterChange("clientHistory", "")}
        className="accent-blue-600"
      />
      <span>All</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="clientHistory"
        value="no_hires"
        checked={filters.clientHistory === "no_hires"}
        onChange={() => onFilterChange("clientHistory", "no_hires")}
        className="accent-blue-600"
      />
      <span>No hires</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="clientHistory"
        value="1_9"
        checked={filters.clientHistory === "1_9"}
        onChange={() => onFilterChange("clientHistory", "1_9")}
        className="accent-blue-600"
      />
      <span>1-9</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="clientHistory"
        value="10_plus"
        checked={filters.clientHistory === "10_plus"}
        onChange={() => onFilterChange("clientHistory", "10_plus")}
        className="accent-blue-600"
      />
      <span>10+</span>
    </label>
  </div>
</div>
{/* Payment Verified */}
{paymentVerified && paymentVerified.length > 0 && (
  <div>
    <h3 className="font-semibold mb-2">Payment Verified</h3>
    <select
      className="w-full border rounded px-2 py-1"
      value={filters.paymentVerified || ""}
      onChange={e => onFilterChange("paymentVerified", e.target.value)}
    >
      <option value="">All</option>
      {paymentVerified.map(paymentVerified => (
        <option key={paymentVerified} value={String(paymentVerified)}>
          {paymentVerified ? "Verified" : "Not Verified"}
        </option>
      ))}
    </select>
  </div>
)}
{/* Project Length */}
<div>
  <h3 className="font-semibold mb-2">Project Length</h3>
  <div className="space-y-1">
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="projectLength"
        value=""
        checked={filters.projectLength === ""}
        onChange={() => onFilterChange("projectLength", "")}
        className="accent-blue-600"
      />
      <span>All</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="projectLength"
        value="less_than_1"
        checked={filters.projectLength === "less_than_1"}
        onChange={() => onFilterChange("projectLength", "less_than_1")}
        className="accent-blue-600"
      />
      <span>Less than 1 month</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="projectLength"
        value="1_3"
        checked={filters.projectLength === "1_3"}
        onChange={() => onFilterChange("projectLength", "1_3")}
        className="accent-blue-600"
      />
      <span>1 to 3 months</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="projectLength"
        value="3_6"
        checked={filters.projectLength === "3_6"}
        onChange={() => onFilterChange("projectLength", "3_6")}
        className="accent-blue-600"
      />
      <span>3 to 6 months</span>
    </label>
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name="projectLength"
        value="more_6"
        checked={filters.projectLength === "more_6"}
        onChange={() => onFilterChange("projectLength", "more_6")}
        className="accent-blue-600"
      />
      <span>More than 6 months</span>
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
   
{/* Level (single-select) */}
{levels && levels.length > 0 && (
  <div>
    <h3 className="font-semibold mb-2">Level</h3>
    <select
      className="w-full border rounded px-2 py-1"
      value={filters.level || ""}
      onChange={e => onFilterChange("level", e.target.value)}
    >
      <option value="">All</option>
      {levels.map(level => (
        <option key={level} value={level}>{level}</option>
      ))}
    </select>
  </div>
)}
{/* Category (multi-select) */}
{categories && categories.length > 0 && (
  <div>
    <h3 className="font-semibold mb-2">Category</h3>
    <select
      className="w-full border rounded px-2 py-1"
      value={filters.category[0] || ""}
      onChange={e => {
        const value = e.target.value;
        onFilterChange("category", value ? [value] : []);
      }}
    >
      <option value="">All</option>
      {categories.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  </div>
)}
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
              <span>{color === 'Green' ? 'AI Recommended' : color === 'Yellow' ? 'Recommended' : color === 'Red' ? 'Not Recommended' : color}</span>
            </label>
          ))}
        </div>
      </div>
    )}
    {/* Country (single-select) */}
    {countries && countries.length > 0 && (
      <div>
        <h3 className="font-semibold mb-2">Country</h3>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.country[0] || ""}
          onChange={e => {
            const value = e.target.value;
            onFilterChange("country", value ? [value] : []);
          }}
        >
          <option value="">All</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
    )}
    {/* Field (single-select) */}
    {/* {fields && fields.length > 0 && (
      <div>
        <h3 className="font-semibold mb-2">Field</h3>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.field[0] || ""}
          onChange={e => {
            const value = e.target.value;
            onFilterChange("field", value ? [value] : []);
          }}
        >
          <option value="">All</option>
          {fields.map((field) => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>
    )} */}
    {/* Domain (single-select, predicted_domain) */}
    {domains && domains.length > 0 && (
      <div>
        <h3 className="font-semibold mb-2">Domain</h3>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.domain[0] || ""}
          onChange={e => {
            const value = e.target.value;
            onFilterChange("domain", value ? [value] : []);
          }}
        >
          <option value="">All</option>
          {domains.map((domain) => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>
      </div>
    )}

    
  </div>
);

export default SidebarFilters; 