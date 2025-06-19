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

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const language = useSelector((state) => state.habesha.language)
  const navigate = useNavigate()

  // Simplified demo orders data
  const demoOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 89.99,
      itemCount: 3,
      items: [
        {
          id: 1,
          name: { EN: "Traditional Ethiopian Coffee", AMH: "ባህላዊ የኢትዮጵያ ቡና" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 2,
          price: 24.99,
        },
        {
          id: 2,
          name: { EN: "Berbere Spice Blend", AMH: "በርበሬ ቅመም ድብልቅ" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: 12.99,
        },
        {
          id: 3,
          name: { EN: "Ethiopian Honey", AMH: "የኢትዮጵያ ማር" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 2,
          price: 18.5,
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 156.5,
      itemCount: 2,
      items: [
        {
          id: 4,
          name: { EN: "Handwoven Ethiopian Scarf", AMH: "በእጅ የተሸመነ የኢትዮጵያ ሻርፍ" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: 45.0,
        },
        {
          id: 5,
          name: { EN: "Ethiopian Traditional Dress", AMH: "የኢትዮጵያ ባህላዊ ልብስ" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: 111.5,
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 67.25,
      itemCount: 1,
      items: [
        {
          id: 6,
          name: { EN: "Ethiopian Art Print", AMH: "የኢትዮጵያ ጥበብ ህትመት" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: 67.25,
        },
      ],
    },
    {
      id: "ORD-004",
      date: "2023-12-20",
      status: "cancelled",
      total: 34.99,
      itemCount: 1,
      items: [
        {
          id: 7,
          name: { EN: "Ethiopian Coffee Mug", AMH: "የኢትዮጵያ ቡና ኩባያ" },
          image: "/placeholder.svg?height=80&width=80",
          quantity: 1,
          price: 34.99,
        },
      ],
    },
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/SignIn")
        return
      }

      // Simulate API call
      setTimeout(() => {
        setOrders(demoOrders)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching orders:", error)
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
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              />
            ))}
          </div>
        )}

        {selectedOrder && (
          <OrderModal order={selectedOrder} language={language} onClose={() => setSelectedOrder(null)} />
        )}
      </div>
    </div>
  )
}

export default OrdersPage
