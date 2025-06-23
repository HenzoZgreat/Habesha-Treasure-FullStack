import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"

const OrdersHeader = ({ language }) => {
  const text = {
    EN: {
      title: "Your Orders",
      subtitle: "Track and manage your purchases",
    },
    AMH: {
      title: "የእርስዎ ትዕዛዞች",
      subtitle: "ግዢዎችዎን ይከታተሉ እና ያስተዳድሩ",
    },
  }

  const currentText = text[language]

  return (
    <div className="mb-8 animate-in slide-in-from-top duration-700">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-gradient-to-r from-habesha_blue to-habesha_light p-3 rounded-2xl shadow-lg">
          <ShoppingBagIcon className="text-white text-3xl" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-habesha_blue to-habesha_light bg-clip-text text-transparent">
            {currentText.title}
          </h1>
          <p className="text-gray-600 text-lg">{currentText.subtitle}</p>
        </div>
      </div>
    </div>
  )
}

export default OrdersHeader
