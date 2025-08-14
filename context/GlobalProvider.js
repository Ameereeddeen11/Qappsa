import { useState, createContext } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
    const [refreshing, setRefreshing] = useState(false);

    return (
        <GlobalContext.Provider
            value={{
                refreshing,
                setRefreshing
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
};
