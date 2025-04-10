import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../protectRoute/protectRoute";

// Import pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/Homepage";
import SystemOverView from "../pages/SystemOverView";
import Application from "../pages/Application";
import RowSelectionPage from "../pages/RowSelectionPage";
import PotSelectionPage from "../pages/PotSelectionPage";
import FarmType from "../pages/FarmType";
import TypeMushrooms from "../pages/TypeMushrooms";
import Device from "../pages/device-page/Device";
import Cultivation from "../pages/Cultivation";
import Growing from "../pages/Growing";
import ViewCultivation from "../pages/ViewCultivation";
import ViewGrowing from "../pages/ViewGrowing";
import ViewPot from "../pages/view-pot-page/ViewPot";

// Main App Router
const AppRouter = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/systemOverView" element={<SystemOverView />} />
          <Route path="/application" element={<Application />} />
          <Route path="/rowselection" element={<RowSelectionPage />} />
          <Route path="/potselection" element={<PotSelectionPage />} />
          <Route path="/farmtype" element={<FarmType />} />
          <Route path="/typemushrooms" element={<TypeMushrooms />} />
          <Route path="/Device" element={<Device />} />
          <Route path="/mushroom-cultivation" element={<Cultivation />} />
          <Route path="/mushroom-cultivation/view/" element={<ViewCultivation />} />
          <Route path="/mushroom-growing" element={<Growing />} />
          <Route path="/mushroom-growing/view/" element={<ViewGrowing />} />
          <Route path="/view-pot" element={<ViewPot />} />

        {/* </Route> */}
      </Routes>
    </AuthProvider>
  );
};

export default AppRouter;
