"use client"

import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import SortIcon from "@mui/icons-material/Sort"

const OrdersFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, sortBy, setSortBy, language }) => {
  const text = {
    EN: {
      searchPlaceholder: "Search your orders...",
      filterAll: "All Orders",
      filterProcessing: "Processing",
      filterShipped: "Shipped",
      filterDelivered: "Delivered",
      filterCancelled: "Cancelled",
      sortNewest: "Newest First",
      sortOldest: "Oldest First",
      sortHighest: "Highest Amount",
      sortLowest: "Lowest Amount",
    },
    AMH: {
      searchPlaceholder: "ትዕዛዞችዎን ይፈልጉ...",
      filterAll: "ሁሉም ትዕዛዞች",
      filterProcessing: "በሂደት ላይ",
      filterShipped: "ተልኳል",
      filterDelivered: "ተደርሷል",
      filterCancelled: "ተሰርዟል",
      sortNewest: "አዲስ መጀመሪያ",
      sortOldest: "አሮጌ መጀመሪያ",
      sortHighest: "ከፍተኛ መጠን",
      sortLowest: "ዝቅተኛ መጠን",
    },
  }

  const currentText = text[language]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 animate-in slide-in-from-top duration-500 delay-200 border border-habesha_blue/20">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={currentText.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-habesha_blue focus:border-transparent transition-all duration-300 bg-white/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FilterListIcon className="text-habesha_blue" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-habesha_blue focus:border-transparent transition-all duration-300 bg-white/50"
            >
              <option value="all">{currentText.filterAll}</option>
              <option value="processing">{currentText.filterProcessing}</option>
              <option value="shipped">{currentText.filterShipped}</option>
              <option value="delivered">{currentText.filterDelivered}</option>
              <option value="cancelled">{currentText.filterCancelled}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortIcon className="text-habesha_blue" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-habesha_blue focus:border-transparent transition-all duration-300 bg-white/50"
            >
              <option value="newest">{currentText.sortNewest}</option>
              <option value="oldest">{currentText.sortOldest}</option>
              <option value="highest">{currentText.sortHighest}</option>
              <option value="lowest">{currentText.sortLowest}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersFilters
