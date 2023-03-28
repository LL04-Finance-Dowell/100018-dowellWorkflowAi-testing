import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
	const [toggleNewFileForm, setToggleNewFileForm] = useState(null);
	const [favoriteItems, setFavoriteitems] = useState({
		documents: [],
		templates: [],
		workflows: [],
	});

	const [globalState, setGlobalState] = useState([]);

	const [favoriteItemsLoaded, setFavoriteitemsLoaded] = useState(false);

	const addToFavoritesState = (category, value) => {
		const currentFavorites = { ...favoriteItems };

		currentFavorites[category] = [
			...currentFavorites[`${category}`],
			value
		]

		setFavoriteitems(currentFavorites)
	}

	const removeFromFavoritesState = (category, itemId) => {
		const currentFavorites = { ...favoriteItems };
		currentFavorites[category] = currentFavorites[category].filter(item => item._id !== itemId);
		setFavoriteitems(currentFavorites);
	}

	return (
		<AppContext.Provider value={{
			globalState,
			setGlobalState,
			toggleNewFileForm,
			setToggleNewFileForm,
			favoriteItems,
			setFavoriteitems,
			favoriteItemsLoaded,
			setFavoriteitemsLoaded,
			addToFavoritesState,
			removeFromFavoritesState,
		}}>
			{children}
		</AppContext.Provider>
	);
};
