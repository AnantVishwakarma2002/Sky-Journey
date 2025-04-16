import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, LogOut, Plane } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Temporary placeholder for user
  const user: { id: number; username: string; role: string } | null = null;
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Temporary placeholder for logout
    console.log("Logout clicked");
  };

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Plane className="mr-2 h-5 w-5" />
            <Link href="/" className="text-xl font-semibold">SkyJourney</Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={`hover:text-neutral-medium ${location === '/' ? 'text-white' : 'text-neutral-medium'}`}>Home</Link>
            <Link href="/search" className={`hover:text-neutral-medium ${location === '/search' ? 'text-white' : 'text-neutral-medium'}`}>Search Flights</Link>
            {user && (
              <Link href="/bookings" className={`hover:text-neutral-medium ${location === '/bookings' ? 'text-white' : 'text-neutral-medium'}`}>My Bookings</Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" className={`hover:text-neutral-medium ${location === '/admin' ? 'text-white' : 'text-neutral-medium'}`}>Admin</Link>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <span>Hello, {user.username}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white hover:bg-white hover:text-primary"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Link href="/auth">
                  <Button variant="secondary" size="sm" className="text-primary bg-white hover:bg-opacity-90">
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-white text-primary hover:bg-opacity-90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <button onClick={toggleMenu} className="md:hidden text-white ml-4">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <Link href="/" className="block py-2" onClick={toggleMenu}>Home</Link>
            <Link href="/search" className="block py-2" onClick={toggleMenu}>Search Flights</Link>
            {user && (
              <Link href="/bookings" className="block py-2" onClick={toggleMenu}>My Bookings</Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" className="block py-2" onClick={toggleMenu}>Admin</Link>
            )}
            
            {user ? (
              <div className="pt-2 border-t border-white/20 mt-2">
                <div className="py-2">Hello, {user.username}</div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2 text-white border-white hover:bg-white hover:text-primary"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex mt-3 space-x-2">
                <Link href="/auth" className="w-1/2" onClick={toggleMenu}>
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-opacity-90">
                    Login
                  </Button>
                </Link>
                <Link href="/auth" className="w-1/2" onClick={toggleMenu}>
                  <Button className="w-full bg-white text-primary hover:bg-opacity-90">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
