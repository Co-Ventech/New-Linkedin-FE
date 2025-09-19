import React from 'react';

const Row = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="text-sm font-medium text-gray-600">{label}</div>
    <div className="col-span-2 text-sm text-gray-900 break-all">{value ?? '—'}</div>
  </div>
);

const UserDetailsModal = ({ isOpen, onClose, user, loading }) => {
  if (!isOpen) return null;

  const company =
    user?.company && typeof user.company === 'object'
      ? user.company
      : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : user ? (
            <div className="space-y-2">
              <Row label="User ID" value={user._id} />
              <Row label="Username" value={user.username} />
              <Row label="Email" value={user.email} />
              <Row label="Role" value={user.role} />
              <Row label="Active" value={user.isActive ? 'Yes' : 'No'} />
              {/* <Row label="Login Count" value={String(user.loginCount ?? 0)} /> */}
              <Row label="Phone" value={user.phone} />
              <Row label="Location" value={user.location} />
              <Row label="Created" value={user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'} />
              <Row label="Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'} />
              
              <div className="mt-3 border-t pt-3">
                <div className="text-sm font-semibold text-gray-900 mb-2">Company</div>
                <Row label="Company ID" value={company?._id || (typeof user.company === 'string' ? user.company : '—')} />
                <Row label="Name" value={company?.name} />
                <Row label="Description" value={company?.description} />
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">User not found.</div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;