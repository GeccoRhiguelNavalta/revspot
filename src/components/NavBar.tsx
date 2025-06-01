"use client";

import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { FC, ReactNode, useState } from "react";
import UploadModal from "./UploadModal";

interface NavBarProps {
  children: ReactNode;
}

const NavBar: FC<NavBarProps> = ({ children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleUploadSuccess = () => {
    // You can optionally trigger a refresh or toast
    console.log("Upload successful!");
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-gray-800 text-white p-4 flex items-center justify-between z-50">
        <button onClick={() => router.push("/dashboard")}>
          <HomeIcon />
        </button>

        <button onClick={() => setShowModal(true)}>
          <AddBoxIcon />
        </button>

        <div className="text-xl font-bold">RevSpot</div>

        <button onClick={() => router.push("/settings")}>
          <SettingsIcon />
        </button>
      </nav>

      <main className="pt-20">{children}</main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default NavBar;
