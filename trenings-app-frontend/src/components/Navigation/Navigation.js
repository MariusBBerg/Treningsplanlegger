import { useState, useEffect  } from "react";
import React, { Fragment } from 'react';

import { Dialog, Menu, Transition } from "@headlessui/react";
import { Dropdown } from 'flowbite-react';

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../assets/logo_nobg.png";
import DropdownMenu from "./DropdownMenu";



const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "/#features" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

const loggedInNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
  { name: "Coach", href: "/coach" },
];

const menuItems = [
  { name: "Requests", href: "/coach" },
  { name: "All Clients", href: "/clients" },
  { name: "Client Calendar", href: "/client-dashboard" },
  
];  

export default function Navigation() {
  const [coachDropdownOpen, setCoachDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { loggedIn } = useAuth(); // Anta at dette er en hook som returnerer autentiseringsstatus
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setHasScrolled(offset > 30); // Sett til true hvis brukeren har scrollet mer enn 50px
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = loggedIn ? loggedInNavigation : navigation;

  return (
    <div className="bg-white mb-10">
      <header
        className={`fixed inset-x-0 top-0 z-50 ${
          hasScrolled ? "bg-white" : ""
        }`}
      >
        <nav
          className="flex items-center justify-between p-6 lg:px-8 shadow-md"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">NæsBerg Solutions</span>
              <img className="h-8 w-auto" src={logo} alt="" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 flex items-center">
          {navItems.map((item) => (
                    <React.Fragment key={item.name}>
                      {item.name === "Coach" ? (
                        <DropdownMenu items={menuItems} name={"Coach"} className={"dropdown-toggle inline-flex items-center px-3 py-2 border border-transparent text-sm font-semibold leading-6 text-gray-900"} />

                      ) : (
                        <a
                          key = {item.name}
                          href={item.href}
                          className="text-sm font-semibold leading-6 text-gray-900"
                        >
                          {item.name}
                        </a>
                      )}

                    </React.Fragment>
                  ))}
          </div>
          {!loggedIn && (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          )}
          {loggedIn && (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a
                href="/logout"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log Out <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          )}
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">NæsBerg Solutions</span>
                <img className="h-8 w-auto" src={logo} alt="" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navItems.map((item) => (
                    <React.Fragment key={item.name}>
                      {item.name === "Coach" ? (
                        <DropdownMenu items={menuItems} name={"Coach"} classNamae={"dropdown-toggle inline-flex items-center -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"} />

                      ) : (
                        <a
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      )}

                    </React.Fragment>
                  ))}
                </div>
                <div className="py-6">
                {!loggedIn && (
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                )}
                {loggedIn && (
                  <a
                    href="/logout"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log Out
                  </a>
                )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </div>
  );
}
