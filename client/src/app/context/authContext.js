"use client";
import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [activationToken, setActivationToken] = useState("");
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [isActive, setIsActive] = useState(1);
  const [user, setUser] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [userLoad, setUserLoad] = useState(false);

  // check token
  axios.defaults.headers.common["Authorization"] = auth?.token;

  //
  useEffect(() => {
    const data = localStorage.getItem("auth");

    if (data) {
      const parseData = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseData?.user,
        token: parseData?.token,
      }));
    }
  }, []);

  // ----------Get All Users-----------
  // Get ALl Users/Contacts
  const getAllUsers = async () => {
    setUserLoad(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/all/contactlist`
      );
      setAllContacts(data?.users);
      setUserLoad(false);
    } catch (error) {
      console.log(error);
      setUserLoad(false);
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const currentUser = allContacts.filter((u) => u._id === auth?.user?._id);
    setUser(...currentUser);
  }, [allContacts, auth]);
  return (
    <AuthContext.Provider
      value={{
        activationToken,
        setActivationToken,
        auth,
        setAuth,
        isActive,
        setIsActive,
        user,
        allContacts,
        userLoad,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
