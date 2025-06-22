"use client"

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"

const CheckoutSummary = ({ cartItems, subtotal, shipping, total, language, formatPrice }) => {
  const text = {
    EN: {
      orderSummary: "Order Summary",
      items: "items",
      item: "item",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total",
    },
    AMH: {
      orderSummary: "የትዕዛዝ ማጠቃለያ",
      items: "እቃዎች",
      item: "እቃ",
      subtotal: "ንዑስ ድምር",
      shipping: "መላኪያ",
      total: "ጠቅላላ",
    },
  }

  const currentText = text[language]

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-habesha_blue/20 sticky top-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="bg-habesha_blue p-2 rounded-xl">
          <ShoppingBagIcon className="text-white" />
        </div>
        {currentText.orderSummary}
      </h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.image || "/placeholder.svg"}
              alt={typeof item.name === "object" && item.name !== null ? item.name[language] : item.name}
              className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 text-sm truncate">
                {typeof item.name === "object" && item.name !== null ? item.name[language] : item.name}
              </h3>
              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-habesha_blue">
                {language === 'EN' ? '$' : 'ETB '}{formatPrice(item.quantity * item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>{currentText.subtotal}</span>
          <span>{language === 'EN' ? '$' : 'ETB '}{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{currentText.shipping}</span>
          <span>{language === 'EN' ? '$' : 'ETB '}{formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">{currentText.total}</span>
            <span className="text-2xl font-bold text-habesha_blue">
              {language === 'EN' ? '$' : 'ETB '}{formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary