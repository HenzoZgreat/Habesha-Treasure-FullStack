import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"

const OrderHistoryCard = ({ currentText }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingBagIcon className="text-habesha_blue" />
        {currentText.orderHistory}
      </h3>
      <div className="text-center py-8">
        <ShoppingBagIcon className="text-gray-400 text-4xl mx-auto mb-4" />
        <p className="text-gray-600">Order history will be displayed here</p>
      </div>
    </div>
  )
}

export default OrderHistoryCard
