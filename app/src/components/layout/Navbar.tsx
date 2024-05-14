import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, IRootState } from "../../redux/store";
import { IAuth } from "../../redux/types";
import { isAuthenticated } from "../../utils/auth";
import { checkAuth, logout } from "../../redux/slices/auth";
import { FaHome, FaUser } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authReducer = useSelector((state: IRootState) => state.auth) as IAuth;
  const { isAuthenticated: isAuthenticatedRedux, jwt } = authReducer || {};
  const isAuth: boolean = isAuthenticatedRedux || isAuthenticated();

  useEffect(() => {
    if (!isAuthenticatedRedux && jwt) {
      dispatch(checkAuth());
    }
    if (
      isAuth &&
      (location.pathname === "/auth/login" ||
        location.pathname === "/auth/register")
    ) {
      navigate("/game");
    }
    if (
      !isAuth &&
      (location.pathname === "/profile" || location.pathname === "/game")
    ) {
      navigate("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, location.pathname, jwt]);

  const redirectHome = () => {
    const route = isAuth ? "/game" : "/";
    navigate(route);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(logout());
  };

  const itemBaseClass: string = "hover:bg-primary hover:text-white px-2";
  return (
    <nav className="flex flex-row justify-between items-center p-4 bg-background text-white w-full top-0 fixed z-50 shadow-md shadow-gray-900">
      <div className="w-1/3 flex justify-start">
        <FaHome className="w-6 h-6" onClick={redirectHome} />
      </div>
      <div className="w-1/3 flex justify-center">
        <h1 className="text-3xl">Yummy-Yams</h1>
      </div>
      <div className="w-1/3 flex justify-end">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  ring-inset ring-gray-300 hover:bg-primary">
              <FaUser className="w-6 h-6 text-white" />
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-fit min-w-36 origin-top-right rounded-md shadow-lg  ring-black ring-opacity-5 focus:outline-none bg-background border border-white">
              <div className="py-1 flex flex-col ">
                {isAuth ? (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={`${itemBaseClass} ${
                            active ? "text-primary" : "text-white"
                          }`}
                        >
                          Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/"
                          onClick={handleLogout}
                          className={`${itemBaseClass} ${
                            active ? "text-primary" : "text-white"
                          }`}
                        >
                          Logout
                        </a>
                      )}
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/auth/login"
                          className={`${itemBaseClass} ${
                            active ? "text-primary" : "text-white"
                          }`}
                        >
                          Login
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/auth/register"
                          className={`${itemBaseClass} ${
                            active ? "text-primary" : "text-white"
                          }`}
                        >
                          Register
                        </a>
                      )}
                    </Menu.Item>
                  </>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
};

export default NavBar;
