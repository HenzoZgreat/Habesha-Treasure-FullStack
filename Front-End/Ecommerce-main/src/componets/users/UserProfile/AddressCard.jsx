"use client"

import LocationOnIcon from "@mui/icons-material/LocationOn"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import UserUserService from "../../../service/UserUserService"

const AddressCard = ({ user, formData, editMode, saving, currentText, onEdit, onCancel, onSave, onInputChange }) => {
  const handleSave = async (field) => {
    try {
      const [parent, child] = field.split(".");
      const updatedData = { [child]: formData[parent][child] };
      await UserUserService.updateUserProfile(updatedData);
      onSave(field);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <LocationOnIcon className="text-habesha_blue" />
        {currentText.address}
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.city}</label>
          {editMode["address.city"] ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.address?.city || ""}
                onChange={(e) => onInputChange("address.city", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-habesha_blue focus:border-transparent"
              />
              <button
                onClick={() => handleSave("address.city")}
                disabled={saving}
                className="bg-habesha_blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SaveIcon className="text-sm" />
              </button>
              <button
                onClick={() => onCancel("address.city")}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <CancelIcon className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-800">{user.address.city}</span>
              <button
                onClick={() => onEdit("address.city")}
                className="text-habesha_blue hover:text-blue-700 transition-colors"
              >
                <EditIcon className="text-sm" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.state}</label>
            {editMode["address.state"] ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address?.state || ""}
                  onChange={(e) => onInputChange("address.state", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-habesha_blue focus:border-transparent"
                />
                <button
                  onClick={() => handleSave("address.state")}
                  disabled={saving}
                  className="bg-habesha_blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <SaveIcon className="text-sm" />
                </button>
                <button
                  onClick={() => onCancel("address.state")}
                  className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <CancelIcon className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-800">{user.address.state}</span>
                <button
                  onClick={() => onEdit("address.state")}
                  className="text-habesha_blue hover:text-blue-700 transition-colors"
                >
                  <EditIcon className="text-sm" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.country}</label>
            {editMode["address.country"] ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address?.country || ""}
                  onChange={(e) => onInputChange("address.country", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-habesha_blue focus:border-transparent"
                />
                <button
                  onClick={() => handleSave("address.country")}
                  disabled={saving}
                  className="bg-habesha_blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <SaveIcon className="text-sm" />
                </button>
                <button
                  onClick={() => onCancel("address.country")}
                  className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <CancelIcon className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-800">{user.address.country}</span>
                <button
                  onClick={() => onEdit("address.country")}
                  className="text-habesha_blue hover:text-blue-700 transition-colors"
                >
                  <EditIcon className="text-sm" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressCard