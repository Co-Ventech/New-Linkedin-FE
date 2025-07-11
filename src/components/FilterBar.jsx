//import React from "react";

//const FilterBar = ({ categories = [], jobTypes = [], onFilterChange }) => {
//  return (
 //   <div className="flex gap-4">
//       <select className="border rounded px-3 py-2" onChange={e => onFilterChange('type', e.target.value)}>
//         <option value="">All Types</option>
//         {jobTypes.map(type => (
//           <option key={type} value={type}>{type}</option>
//         ))}
//       </select>
//       <select className="border rounded px-3 py-2" onChange={e => onFilterChange('category', e.target.value)}>
//         <option value="">All Categories</option>
//         {categories.map(cat => (
//           <option key={cat} value={cat}>{cat}</option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default FilterBar; 