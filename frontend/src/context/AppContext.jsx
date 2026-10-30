import { createContext, useCallback, useEffect, useState } from "react";
import { loadUser, saveUser, removeUser } from "../util/storage";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => loadUser());

    useEffect(() => {
        if (user) {
            saveUser(user);
        } else {
            removeUser();
        }
    }, [user]);

    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    const contextValue = {
        user,
        setUser,
        clearUser,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;