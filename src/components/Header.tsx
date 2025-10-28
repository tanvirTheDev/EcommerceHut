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
import Form from "next/form";
import Link from "next/link";
const Header = () => {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
  // const createPassKey = async () => {
  //   // Handle passkey click
  //   try {
  //     const res = await user?.createPasskey();
  //     console.log(res);
  //   } catch (err) {
  //     console.error("Error", JSON.stringify(err, null, 2));
  //   }
  // };
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      <div className="w-full md:w-1/4 ml-4 md:ml-0">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer sm:ml-4"
        >
          Sibling Basket
        </Link>
      </div>
      {/* Top Row */}
      <div className="flex flex-wrap justify-end items-center px-4 py-2 w-3/4">
        <Form action="/search" className="sm:flex-1 sm:mx-4 sm:mt-0 w-full">
          <input
            type="text"
            placeholder="Search for products"
            name="query"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"
          />
        </Form>
        <div className="flex items-center space-x-4 mt-4 flex-1 sm:flex-none md:mt-0">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <TrolleyIcon className="size-6" />
            {/* span item count once global state is implemented */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
            <span className="">My Orders</span>
          </Link>
          {/* user area */}
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="size-6" />
                <span className="">My Orders</span>
              </Link>
            </SignedIn>
            {user ? (
              <div className="flex justify-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.firstName}</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}
            {/* {user?.passkeys.length === 0 && (
              <button
                onClick={createPassKey}
                className="bg-white text-blue-500 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded animate-pulse border border-blue-300 transition-all duration-300 ease-in-out"
              >
                Create a Passkey Now
              </button>
            )} */}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};

export default Header;
