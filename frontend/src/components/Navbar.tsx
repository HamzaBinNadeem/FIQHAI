import { useNavigate } from "react-router-dom";
import logo from "@/assets/fiqh-ai-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/20 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer transition-transform hover:scale-105" 
            onClick={handleLogoClick}
          >
            <img src={logo} alt="FIQH AI Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">FIQH AI</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;