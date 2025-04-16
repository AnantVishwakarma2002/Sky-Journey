import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SkyJourney</h3>
            <p className="text-sm text-gray-400">Find and book the best flight deals to your favorite destinations worldwide.</p>
          </div>
          <div>
            <h4 className="text-base font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Partners</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <h4 className="text-base font-medium mb-2">Subscribe to our newsletter</h4>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-700 text-white border-gray-600 rounded-r-none focus:ring-primary" 
              />
              <Button className="rounded-l-none bg-primary text-white hover:bg-opacity-90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-gray-400 text-center">
          &copy; 2023 SkyJourney. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
