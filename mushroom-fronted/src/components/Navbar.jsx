import { useState, useContext } from "react";
import ChangeNameModal from "../components/ChangeNameModal";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const date = today
    .toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/ /g, "");

  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // สำหรับเปิดปิดเมนู sidebar

  // ✅ fn Logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login"); // เปลี่ยนเส้นทางไปยังหน้า Login
  };

  return (
   <div className="flex ">
  {/* Sidebar สำหรับมือถือ */}
  <div
    className={`lg:hidden fixed top-0 left-0 w-64 h-screen bg-[#858684]  text-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-40`}
  >
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <img
          src="/Image/mushroom.png"
          alt="App Mushroom IOT"
          className="nav-logo w-10 h-10"
        />
        <h1 className="ml-2 font-bold text-xl">App Mushroom IOT</h1>
      </div>
      <button
        className="text-white"
        onClick={() => setIsMenuOpen(false)} // ปิด sidebar เมื่อคลิก
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    {/* ลิงก์ใน Sidebar */}
    <ul className="flex flex-col mt-4 ">
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <a href="/homepage" className="nav-link">Homepage</a>
      </li>
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <a href="/farmtype" className="nav-link">Farm</a>
      </li>
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <a href="/typemushrooms" className="nav-link">Mushroom Type</a>
      </li>
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <a href="/device" className="nav-link">Robot</a>
      </li>
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <a href="/user-management" className="nav-link">User management</a>
      </li>
      {/* เพิ่มปุ่ม Change Password และ Log Out */}
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <button
          className="nav-link w-full text-left"
          onClick={() => setIsChangeNameModalOpen(true)} // เปิด Modal สำหรับการเปลี่ยนชื่อ
        >
          Change Password
        </button>
      </li>
      <li className="mx-2 p-2 hover:bg-[#858684]">
        <button
          className="nav-link w-full text-left text-red-500"
          onClick={handleLogout} // ฟังก์ชั่น Logout
        >
          Log Out
        </button>
      </li>
    </ul>
  </div>

  {/* Main Content */}
  <div className="flex-1 w-full">
    {/* Navbar บนเดสก์ท็อป */}
    <div className="hidden lg:flex justify-between items-center p-4 bg-[#858684] text-white">
      <div className="flex items-center">
        <img
          src="/Image/mushroom.png"
          alt="App Mushroom IOT"
          className="nav-logo w-10 h-10"
        />
        <h1 className="ml-2 font-bold text-xl">App Mushroom IOT</h1>
      </div>

      {/* ลิงก์ใน Navbar สำหรับเดสก์ท็อป */}
      <ul className="flex space-x-4">
        <li>
          <a href="/homepage" className="nav-link">Homepage</a>
        </li>
        <li>
          <a href="/farmtype" className="nav-link">Farm</a>
        </li>
        <li>
          <a href="/typemushrooms" className="nav-link">Mushroom Type</a>
        </li>
        <li>
          <a href="/device" className="nav-link">Robot</a>
        </li>
        <li>
          <a href="/user-management" className="nav-link">User management</a>
        </li>
      </ul>

      {/* ส่วนขวา (Logout และ Profile) */}
      <div className="flex items-center space-x-5">
        <p className="text-white">{date}</p>
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-4 py-2 rounded-md transition"
          onClick={() => setIsChangeNameModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l293.1 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1l-91.4 0zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z" />
          </svg>
        </button>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>

    {/* ส่วนเนื้อหา (Dashboard หรือเนื้อหาหลัก) */}
   
  </div>

  {/* ปุ่ม Hamburger สำหรับมือถือ */}
  <button
    onClick={() => setIsMenuOpen(true)}
    className="lg:hidden fixed top-4 left-4 bg-[#858684] text-white p-3 rounded-full"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  {/* Modals */}
  {isChangeNameModalOpen && (
    <ChangeNameModal
      isOpen={isChangeNameModalOpen}
      onClose={() => setIsChangeNameModalOpen(false)}
    />
  )}
</div>


  );
};

export default Navbar;



// import { useState, useContext } from "react";
// import ChangeNameModal from "../components/ChangeNameModal";
// import { useNavigate } from "react-router-dom";
// import AuthContext from '../context/AuthContext';
// const Navbar = () => {
//   const navigate = useNavigate();
//   const today = new Date();
//   const date = today
//     .toLocaleDateString("th-TH", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     })
//     .replace(/ /g, "");

//   const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
//   const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
//   const { user, logout } = useContext(AuthContext);

//   // ✅ fn Logout
//   const handleLogout = () => {
//     logout()
//     localStorage.removeItem("token");
//     navigate("/login"); // Redirect to Login
//   };

//   return (
//     <nav className="nav-bar relative">
//       {/* <h1>{user ?? 'test'}</h1> */}
//       <div className="flex items-center">

//         <img
//           src="/Image/mushroom.png"
//           alt="App Mushroom IOT"
//           className="nav-logo"
//         />
//         <h1 className="font-bold text-xl">App Mushroom IOT</h1>
//       </div>
//       <ul className="flex">
//         <li className="mx-2">
//           <a href="/homepage" className="nav-link">
//             Homepage
//           </a>
//         </li>
//         {/* <li className="mx-2">
//           <a href="/systemOverview" className="nav-link">
//             SYSTEM OVERVIEW
//           </a>
//         </li> */}

//         <li className="mx-2">
//           <a
//             href="/farmtype"
//             className="nav-link"
//           >
//             <span className="ml-3">Farm</span>
//           </a>
//         </li>

//         <li className="mx-2">
//           <a
//             href="/typemushrooms"
//             className="nav-link"
//           >
//             <span className="ml-3">Mushroom Type</span>
//           </a>
//         </li>

//         <li className="mx-2">
//           <a
//             href="/device"
//             className="nav-link"
//           >
//             <span className="ml-3">Robot</span>
//           </a>
//         </li>

//         <li className="mx-2">
//           <a
//             href="/user-management"
//             className="nav-link"
//           >
//             <span className="ml-3">User management</span>
//           </a>
//         </li>



//         {/* <li className="mx-2">
//           <a href="/rowselection" className="nav-link">
//             APPLICATION
//           </a>
//         </li> */}

//         {/* Master Data with Dropdown */}

//         {/* <li className="mx-2 font-title relative group">
//           <button
//             className="hover:text-white-500 transition flex items-center "
//           >
//             MASTER DATA
//             <svg
//               className="w-3 h-3 fill-gray-50 group-hover:fill-black-500 transition"
//               xmlns="http://www.w3.org/2000/svg"
//               width="12"
//               height="12"
//               viewBox="0 0 12 12"
//             >
//               <path d="M10 2.586 11.414 4 6 9.414.586 4 2 2.586l4 4z" />
//             </svg>
//           </button>

          
//           <ul className="absolute left-0 mt-2 min-w-[240px] bg-gray-500 border border-gray-800 p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition duration-200">
//             <li>
//               <a
//                 href="/farmtype"
//                 className="flex items-center p-2 hover:bg-gray-800 transition"
//               >
//                 <span className="ml-3">Farm Type</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="/typemushrooms"
//                 className="flex items-center p-2 hover:bg-gray-800 transition"
//               >
//                 <span className="ml-3">Type Mushroom</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="/device"
//                 className="flex items-center p-2 hover:bg-gray-800 transition"
//               >
//                 <span className="ml-3">Device</span>
//               </a>
//             </li>
//           </ul>
//         </li> */}


//         {/* Master Data with Dropdown */}
//         {/* <li className="mx-2 font-title relative group"> */}
//         {/* <button
//             className="hover:text-white-500 transition flex items-center "
//           >
//             TYPEDATA
//             <svg
//               className="w-3 h-3 fill-gray-50 group-hover:fill-black-500 transition"
//               xmlns="http://www.w3.org/2000/svg"
//               width="12"
//               height="12"
//               viewBox="0 0 12 12"
//             >
//               <path d="M10 2.586 11.414 4 6 9.414.586 4 2 2.586l4 4z" />
//             </svg>
//           </button> */}

//         {/* Dropdown Menu */}
//         {/* <ul className="absolute left-0 mt-2 min-w-[240px] bg-gray-500 border border-gray-800 p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition duration-200">
//             <li>
//               <a
//                 href="/mushroom-cultivation"
//                 className="flex items-center p-2 hover:bg-gray-800 transition"
//               >
//                 <span className="ml-3">CULTIVATION</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="/mushroom-growing"
//                 className="flex items-center p-2 hover:bg-gray-800 transition"
//               >
//                 <span className="ml-3">GROWING</span>
//               </a>
//             </li>

//           </ul> */}
//         {/* </li> */}
//       </ul>

//       {/* Right Section */}
//       <div className="flex items-center space-x-5">
//         <p className="font-title">{date}</p>

//         {/* Change Name Button */}
//         <button
//           className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
//           onClick={() => setIsChangeNameModalOpen(true)}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 640 512"
//             className="w-5 h-5"
//           >
//             <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l293.1 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1l-91.4 0zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z" />
//           </svg>
//         </button>

//         {/* Logout Button */}
//         <button
//           className="bt-card bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>

//       {/* Modals */}
//       {isChangeNameModalOpen && (
//         <ChangeNameModal
//           isOpen={isChangeNameModalOpen}
//           onClose={(

//           ) => setIsChangeNameModalOpen(false)}

//         />
//       )}
//     </nav>
//   );
// };

// export default Navbar;
