import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
  Navigate // Import Navigate for default route
} from "react-router-dom";
import { productsData } from "./componets/api/api"; // Corrected 'componets' to 'components'
import Footer from "./componets/Footer/Footer";     // Corrected 'componets' to 'components'
import Header from "./componets/Header/Header";     // Corrected 'componets' to 'components'
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import Regestration from "./pages/Regestration";
import ProductDetails from "./pages/User/ProductDetails"; // Assuming you have a ProductDetails page
import Favorites from "./pages/User/FavoritesPage"; // Assuming you have a Favorites page
import UserProfile from "./pages/User/ProfilePage"; // Assuming you have a Profile page
import OrdersPage from "./pages/User/OrdersPage";
import CheckoutPage from "./pages/User/CheckoutPage";

// Import the Admin Layout
import AdminDashboardLayout from "./layout/AdminDashboardLayout"; // Assuming this is your layout file

// Import Admin Pages
import DashboardOverview from "./pages/Admin/DashboardOverview"; // The actual dashboard content page
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers";
import SettingsPage from "./pages/Admin/SettingsPage";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import UserDetails from "./pages/Admin/UserDetails";
import EditUser from "./pages/Admin/EditUser"; 
import AddUser from "./pages/Admin/AddUser"; 


const Layout = () => {
  return (
    <div>
      <Header />
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route> {/* Root Route, can be empty or have a general wrapper if needed */}
        {/* Public facing layout and routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} loader={productsData}></Route>
          <Route path="/product/:id" element={<ProductDetails />} /> {/* Product details page */}
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/favorites" element={<Favorites />}></Route>
          <Route path="/profile" element={<UserProfile />}></Route> {/* User Profile page */}
          <Route path="/orders" element={<OrdersPage />}></Route> {/* User Orders page */}
          <Route path="/checkout" element={<CheckoutPage />}></Route> {/* Checkout page */}
          
          {/* Default route for the root path */}
          {/* Add other public routes here if they share the Header/Footer Layout */}
        </Route>

        {/* Authentication routes (typically don't have Header/Footer) */}
        <Route path="/SignIn" element={<SignIn />}></Route>
        <Route path="/Registration" element={<Regestration />}></Route>
        <Route path="/search" element={<SearchResults />} />

        {/* Profile route */}
        


        {/* Admin Section with its own Layout */}
        <Route path="/admin" element={<AdminDashboardLayout />}> {/* Use the layout here */}
          {/* Default route for /admin, navigate to the overview */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} /> {/* New route for overview */}
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="setting" element={<SettingsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users/:id" element={<UserDetails />} /> {/* User details page */}
          <Route path="users/edit/:id" element={<EditUser />} /> {/* Edit user page */}
          <Route path="users/add" element={<AddUser />} /> {/* Add user page */}

          {/* Add other nested admin routes here */}
        </Route>
      </Route>
    )
  );
  return (
    <div className="font-bodyFont bg-gray-100">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;