"use client"

import CloseIcon from "@mui/icons-material/Close"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import RefreshIcon from "@mui/icons-material/Refresh"
import CancelIcon from "@mui/icons-material/Cancel"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const OrderModal = ({ order, language, onClose }) => {
  const text = {
    EN: {
      orderDetails: "Order Details",
      orderNumber: "Order Number",
      orderDate: "Order Date",
      orderStatus: "Status",
      totalAmount: "Total Amount",
      items: "Items",
      delivered: "Delivered",
      shipped: "Shipped",
      processing: "Processing",
      cancelled: "Cancelled",
      quantity: "Quantity",
      price: "Price",
      subtotal: "Subtotal",
    },
    AMH: {
      orderDetails: "የትዕዛዝ ዝርዝሮች",
      orderNumber: "የትዕዛዝ ቁጥር",
      orderDate: "የትዕዛዝ ቀን",
      orderStatus: "ሁኔታ",
      totalAmount: "ጠቅላላ መጠን",
      items: "እቃዎች",
      delivered: "ተደርሷል",
      shipped: "ተልኳል",
      processing: "በሂደት ላይ",
      cancelled: "ተሰርዟል",
      quantity: "ብዛት",
      price: "ዋጋ",
      subtotal: "ንዑስ ድምር",
    },
  }

  const currentText = text[language]

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircleIcon className="text-green-500" />
      case "shipped":
        return <LocalShippingIcon className="text-blue-500" />
      case "processing":
        return <RefreshIcon className="text-yellow-500 animate-spin" />
      case "cancelled":
        return <CancelIcon className="text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-habesha_blue to-blue-400 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <CalendarTodayIcon className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentText.orderDetails}</h2>
                <p className="text-blue-100">#{order.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors duration-200"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Order Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-habesha_blue/10 to-habesha_blue/20 rounded-2xl p-6 text-center border border-habesha_blue/20">
              <CalendarTodayIcon className="text-habesha_blue text-3xl mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-800 mb-2">{currentText.orderDate}</h3>
              <p className="text-lg font-bold text-habesha_blue">{new Date(order.date).toLocaleDateString()}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
              <div className="mb-3">{getStatusIcon(order.status)}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{currentText.orderStatus}</h3>
              <div
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}
              >
                {currentText[order.status]}
              </div>
            </div>

            <div className="bg-gradient-to-br from-habesha_blue/10 to-habesha_blue/20 rounded-2xl p-6 text-center border border-habesha_blue/20">
              <AttachMoneyIcon className="text-habesha_blue text-3xl mb-3 mx-auto" />
              <h3 className="font-semibold text-gray-800 mb-2">{currentText.totalAmount}</h3>
              <p className="text-2xl font-bold bg-gradient-to-r from-habesha_blue to-blue-400 bg-clip-text text-transparent">
                ${order.total}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="bg-gradient-to-r from-habesha_blue to-blue-400 p-2 rounded-xl">
                <span className="text-white font-bold">{order.items.length}</span>
              </div>
              {currentText.items}
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name[language]}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg mb-2">{item.name[language]}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{currentText.quantity}:</span>
                          <span className="font-semibold ml-2">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{currentText.price}:</span>
                          <span className="font-semibold ml-2">${item.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">{currentText.subtotal}:</span>
                          <span className="font-bold text-habesha_blue ml-2">
                            ${(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-habesha_blue/20">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-700">{currentText.totalAmount}</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-habesha_blue to-blue-400 bg-clip-text text-transparent">
                      ${order.total}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Final Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderModal
