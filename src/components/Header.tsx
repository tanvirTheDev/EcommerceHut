"use client";
import useBasketStore from "@/store/store";
import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { Menu, Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-600 hover:text-orange-500 transition-colors duration-200"
            >
              EcommerceHut
            </Link>
          </div>

          {/* Desktop Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <Form action="/search" className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="query"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </Form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Basket/Cart Button */}
            <Link
              href="/basket"
              className="relative p-2 sm:px-3 sm:py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              aria-label="Shopping Basket"
            >
              <TrolleyIcon className="w-6 h-6 sm:w-5 sm:h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse group-hover:animate-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
              <span className="hidden sm:inline-block ml-2 text-sm font-medium">
                Basket
              </span>
            </Link>

            {/* User Account */}
            <ClerkLoaded>
              <SignedIn>
                {/* Orders Link - Desktop */}
                <Link
                  href="/orders"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <PackageIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Orders</span>
                </Link>
              </SignedIn>

              {/* User Button */}
              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <UserButton />
                    <div className="hidden xl:block text-left">
                      <p className="text-xs text-gray-500">Welcome Back</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName || user.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="hidden sm:block">
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </ClerkLoaded>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Toggle */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 transition-all duration-200 ease-in-out">
            <Form action="/search" className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="query"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </Form>
          </div>
        )}

        {/* Mobile Menu - Toggle */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 transition-all duration-200 ease-in-out">
            <nav className="flex flex-col space-y-3">
              <ClerkLoaded>
                <SignedIn>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <PackageIcon className="w-5 h-5" />
                    <span className="font-medium">My Orders</span>
                  </Link>
                </SignedIn>
                {!user && (
                  <div className="px-4">
                    <SignInButton mode="modal">
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                )}
              </ClerkLoaded>
              <Link
                href="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <PackageIcon className="w-5 h-5" />
                <span className="font-medium">Categories</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
