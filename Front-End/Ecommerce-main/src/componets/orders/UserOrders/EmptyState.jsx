"use client"

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"

const EmptyState = ({ language, navigate }) => {
  const text = {
    EN: {
      noOrders: "No orders yet",
      noOrdersDesc: "You haven't placed any orders yet. Start shopping to see your orders here!",
      startShopping: "Start Shopping",
    },
    AMH: {
      noOrders: "ገና ትዕዛዝ የለም",
      noOrdersDesc: "ገና ምንም ትዕዛዝ አልሰጡም። ትዕዛዞችዎን እዚህ ለማየት ግዢን ይጀምሩ!",
      startShopping: "ግዢን ይጀምሩ",
    },
  }

  const currentText = text[language]

  return (
    <div className="text-center py-20 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-habesha_blue/20">
        <div className="bg-gradient-to-r from-habesha_blue to-blue-800 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
          <ShoppingBagIcon className="text-white text-4xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentText.noOrders}</h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">{currentText.noOrdersDesc}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-habesha_blue to-blue-400 text-white px-8 py-4 rounded-xl hover:from-blue-400 hover:to-habesha_blue transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {currentText.startShopping}
        </button>
      </div>
    </div>
  )
}

export default EmptyState
