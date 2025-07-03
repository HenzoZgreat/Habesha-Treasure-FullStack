"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import OrderCard from "../../componets/orders/UserOrders/OrderCard"
import OrderModal from "../../componets/orders/UserOrders/OrderModal"
import OrdersHeader from "../../componets/orders/UserOrders/OrdersHeader"
import OrdersFilters from "../../componets/orders/UserOrders/OrdersFilters"
import EmptyState from "../../componets/orders/UserOrders/EmptyState"
import LoadingState from "../../componets/orders/UserOrders/LoadingState"
import userOrderService from "../../service/userOrderService"
import UserSettingsService from "../../service/UserSettingsService"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const language = useSelector((state) => state.habesha.language)
  const navigate = useNavigate()

  const [exchangeRate, setExchangeRate] = useState(150); // Default value

  const formatPrice = (value) => {
    const price = language === 'EN' ? value : value * exchangeRate
    return price.toLocaleString(language === 'AMH' ? 'am-ET' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatNumber = (value) => {
    return value.toLocaleString(language === 'AMH' ? 'am-ET' : 'en-US')
  }

  const statusMap = {
    PENDING_PAYMENT: "processing",
    PAID: "processing",
    REJECTED: "cancelled",
    CANCELLED: "cancelled",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
  }

  useEffect(() => {
    fetchOrders()
    const fetchSettings = async () => {
      try {
        const response = await UserSettingsService.getSettings();
        setExchangeRate(response.data.storeInfo.exchangeRate || 150);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setExchangeRate(150); // Fallback to default
      }
    };
    fetchSettings();
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/SignIn")
        return
      }

      const response = await userOrderService.getOrders()
      const normalizedOrders = response.data.map((order) => ({
        id: order.orderId,
        date: order.orderedAt,
        status: statusMap[order.status] || "processing",
        total: order.totalPrice,
        itemCount: order.items.length,
        items: order.items.map((item, index) => ({
          id: index + 1,
          name: { EN: item.name, AMH: item.name },
          image: item.image || "/placeholder.svg",
          quantity: item.quantity,
          price: item.price,
        })),
      }))
      setOrders(normalizedOrders)
    } catch (error) {
      setError(error.message || "Failed to fetch orders")
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders
    .filter((order) => {
      if (filterStatus === "all") return true
      return order.status === filterStatus
    })
    .filter((order) => {
      if (!searchTerm) return true
      return (
        order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name[language].toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date)
        case "oldest":
          return new Date(a.date) - new Date(b.date)
        case "highest":
          return b.total - a.total
        case "lowest":
          return a.total - b.total
        default:
          return 0
      }
    })

  if (loading) {
    return <LoadingState language={language} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersHeader language={language} />

        <OrdersFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          language={language}
        />

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <EmptyState language={language} navigate={navigate} />
        ) : (
          <div className="grid gap-6 animate-in fade-in duration-500">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                language={language}
                onViewDetails={() => setSelectedOrder(order)}
                index={index}
                onCancel={() => fetchOrders()}
                formatPrice={formatPrice}
                formatNumber={formatNumber}
              />
            ))}
          </div>
        )}

        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            language={language}
            onClose={() => setSelectedOrder(null)}
            formatPrice={formatPrice}
            formatNumber={formatNumber}
          />
        )}
      </div>
    </div>
  )
}

export default OrdersPage