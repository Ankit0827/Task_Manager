import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <aside className="hidden max-[1080px]:hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </aside>
          <main className="flex-1 w-full px-4 md:px-8 py-4">
            {children}
          </main>
        </div>
      )}
    </div>
  );
};
export default DashboardLayout