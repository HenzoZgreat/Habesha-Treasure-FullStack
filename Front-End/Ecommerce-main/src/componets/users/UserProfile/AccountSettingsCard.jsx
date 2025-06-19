"use client"

import SecurityIcon from "@mui/icons-material/Security"
import LanguageIcon from "@mui/icons-material/Language"
import NotificationsIcon from "@mui/icons-material/Notifications"

const AccountSettingsCard = ({ user, currentText, language }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <SecurityIcon className="text-habesha_blue" />
        {currentText.accountSettings}
      </h3>

      <div className="space-y-8">
        {/* Language Preference */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
            <LanguageIcon className="text-habesha_blue text-sm" />
            {currentText.language}
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Current Language: {language === "EN" ? "English" : "አማርኛ"}</span>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Managed in header</span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
            <NotificationsIcon className="text-habesha_blue text-sm" />
            {currentText.notifications}
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <div className="font-medium text-gray-800">{currentText.emailNotifications}</div>
                <div className="text-sm text-gray-600">Receive order updates and promotions via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences.notifications.email}
                  onChange={(e) => {
                    console.log("Email notifications:", e.target.checked)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-habesha_blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <div className="font-medium text-gray-800">{currentText.smsNotifications}</div>
                <div className="text-sm text-gray-600">Receive order updates via SMS</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences.notifications.sms}
                  onChange={(e) => {
                    console.log("SMS notifications:", e.target.checked)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-habesha_blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <div className="font-medium text-gray-800">{currentText.pushNotifications}</div>
                <div className="text-sm text-gray-600">Receive push notifications in your browser</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences.notifications.push}
                  onChange={(e) => {
                    console.log("Push notifications:", e.target.checked)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-habesha_blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <div className="font-medium text-gray-800">{currentText.newsletter}</div>
                <div className="text-sm text-gray-600">Receive our weekly newsletter with deals and updates</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences.newsletter}
                  onChange={(e) => {
                    console.log("Newsletter:", e.target.checked)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-habesha_blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
            <SecurityIcon className="text-habesha_blue text-sm" />
            Security
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">{currentText.changePassword}</div>
                <div className="text-sm text-gray-600">Update your account password</div>
              </div>
              <button className="bg-habesha_blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                {currentText.changePassword}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettingsCard
