import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
  Navigate
} from "react-router-dom";
import { productsData } from "./componets/api/api";
import Footer from "./componets/Footer/Footer";
import Header from "./componets/Header/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import Regestration from "./pages/Regestration";
import ResetPassword from "./pages/ResetPassword";
import ProductDetails from "./pages/User/ProductDetails";
import Favorites from "./pages/User/FavoritesPage";
import UserProfile from "./pages/User/ProfilePage";
import OrdersPage from "./pages/User/OrdersPage";
import CheckoutPage from "./pages/User/CheckoutPage";
import AdminDashboardLayout from "./layout/AdminDashboardLayout";
import DashboardOverview from "./pages/Admin/DashboardOverview";
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/Admin/Orders/ManageOrders";
import ManageUsers from "./pages/ManageUsers";
import SettingsPage from "./pages/Admin/SettingsPage";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import UserDetails from "./pages/Admin/UserDetails";
import OrderDetails from "./pages/Admin/Orders/OrderDetails";
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
      <Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} loader={productsData}></Route>
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/favorites" element={<Favorites />}></Route>
          <Route path="/profile" element={<UserProfile />}></Route>
          <Route path="/orders" element={<OrdersPage />}></Route>
          <Route path="/checkout" element={<CheckoutPage />}></Route>
        </Route>
        <Route path="/SignIn" element={<SignIn />}></Route>
        <Route path="/Registration" element={<Regestration />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="setting" element={<SettingsPage />} />
          <Route path="profile" element={<Profile />} />
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