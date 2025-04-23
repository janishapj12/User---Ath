import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
   axios.defaults.withCredentials = true
    const getauth = async() =>{
             try{
               const {data} = await axios.get(`http://localhost:4000/api/user/is-auth`)
               if(data.success){
                setIsLoggedin(true)
                setUserData(data.user);
               }
             }catch(e){
                toast.error(e.message)
             }
    }
    useEffect(() =>{
            getauth()
    },[])
    // Function to log the user out
    
   
    const value = {
        backendurl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        setIsLoading,
        isLoading,
        getauth
        // Provide logout function as part of context
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
