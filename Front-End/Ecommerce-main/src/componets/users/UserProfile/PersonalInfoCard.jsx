"use client"

import PersonIcon from "@mui/icons-material/Person"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import UserUserService from "../../../service/UserUserService"

const PersonalInfoCard = ({
  user,
  formData,
  editMode,
  saving,
  currentText,
  onEdit,
  onCancel,
  onSave,
  onInputChange,
}) => {
  const handleSave = async (field) => {
    try {
      const updatedData = { [field]: formData[field] };
      await UserUserService.updateUserProfile(updatedData);
      onSave(field);
    } catch (error) {
      console.error("Error updating personal info:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <PersonIcon className="text-habesha_blue" />
        {currentText.personalInfo}
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.firstName}</label>
          {editMode.firstName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => onInputChange("firstName", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-habesha_blue focus:border-transparent"
              />
              <button
                onClick={() => handleSave("firstName")}
                disabled={saving}
                className="bg-habesha_blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SaveIcon className="text-sm" />
              </button>
              <button
                onClick={() => onCancel("firstName")}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <CancelIcon className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-800">{user.firstName}</span>
              <button
                onClick={() => onEdit("firstName")}
                className="text-habesha_blue hover:text-blue-700 transition-colors"
              >
                <EditIcon className="text-sm" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.lastName}</label>
          {editMode.lastName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => onInputChange("lastName", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-habesha_blue focus:border-transparent"
              />
              <button
                onClick={() => handleSave("lastName")}
                disabled={saving}
                className="bg-habesha_blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SaveIcon className="text-sm" />
              </button>
              <button
                onClick={() => onCancel("lastName")}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <CancelIcon className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-800">{user.lastName}</span>
              <button
                onClick={() => onEdit("lastName")}
                className="text-habesha_blue hover:text-blue-700 transition-colors"
              >
                <EditIcon className="text-sm" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.email}</label>
          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <EmailIcon className="text-gray-500 text-sm" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Read-only</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{currentText.phone}</label>
          {editMode.phoneNumber ? (
            <div className="flex gap-2">
              <input
                type="tel"
                value={formData.phoneNumber || ""}
                onChange={(e) => onInputChange("phoneNumber", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-habesha_blue focus:border-transparent"
              />
              <button
                onClick={() => handleSave("phoneNumber")}
                disabled={saving}
                className="bg-habesha_blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SaveIcon className="text-sm" />
              </button>
              <button
                onClick={() => onCancel("phoneNumber")}
                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <CancelIcon className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <PhoneIcon className="text-gray-500 text-sm" />
                <span className="text-gray-800">{user.phoneNumber}</span>
              </div>
              <button
                onClick={() => onEdit("phoneNumber")}
                className="text-habesha_blue hover:text-blue-700 transition-colors"
              >
                <EditIcon className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoCard