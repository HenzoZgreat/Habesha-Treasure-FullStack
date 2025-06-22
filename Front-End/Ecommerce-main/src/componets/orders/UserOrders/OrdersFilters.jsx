"use filters"

import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import SortIcon from "@mui/icons-material/Sort"

const OrdersFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus, sortBy, setSortBy, language }) => {
  const text = {
    EN: {
      search_placeholder: "Search your orders...",
      filter_all: "All Orders",
      filter_processing: "Processing",
      filter_shipped: "Shipped",
      filter_delivered: "Delivered",
      filter_cancelled: "Cancelled",
      sort_newest: "Newest First",
      sort_oldest: "Oldest First",
      sort_highest: "Highest Amount",
      sort_lowest: "Lowest Amount",
    },
    AMH: {
      search_placeholder: "ትዕዛዞን ፈልግ",
      filter_all: "ሁሉም ትዕዛዞች",
      filter_processing: "በሂደት ላይ",
      filter_shipped: "ተልኳል",
      filter_delivered: "ተደርሷል",
      filter_cancelled: "ሰርዟል",
      sort_newest: "አዲስ መጀመሪያ",
      sort_oldest: "አሮጌ መጀመሪያ",
      sort_highest: "ከፍተኛ መጠን",
      sort_lowest: "ዝቅተኛ መጠን",
    },
  }

  const currentText = text[language]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 animate-in">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder={currentText.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-2 py-3 border rounded-xl focus:ring-2 focus:ring-habesha_blue focus:border-transparent transition-all duration-300 bg-white/50"
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
              <option value="all">{currentText.filter_all}</option>
              <option value="processing">{currentText.filter_processing}</option>
              <option value="shipped">{currentText.filter_shipped}</option>
              <option value="delivered">{currentText.filter_delivered}</option>
              <option value="cancelled">{currentText.filter_cancelled}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortIcon className="text-habesha_blue" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-habesha_blue focus:border-transparent transition-all duration-300 bg-white/50"
            >
              <option value="newest">{currentText.sort_newest}</option>
              <option value="oldest">{currentText.sort_oldest}</option>
              <option value="highest">{currentText.sort_highest}</option>
              <option value="lowest">{currentText.sort_lowest}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersFilters