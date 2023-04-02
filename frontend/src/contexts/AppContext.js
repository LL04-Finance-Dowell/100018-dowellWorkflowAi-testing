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
	const [favoriteItemsLoaded, setFavoriteitemsLoaded] = useState(false);
	const [searchItems, setSearchItems] = useState([]);
	const [searchItemsStatus, setSearchItemsStatus] = useState({
		documentsAdded: false,
		templatesAdded: false,
		workflowsAdded: false,
	});

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

	const updateSearchItemStatus = (itemAdded, value) => {
		if (itemAdded === 'documentsAdded') setSearchItemsStatus((prevItems) => { return { ...prevItems, documentsAdded: value}})
		if (itemAdded === 'templatesAdded') setSearchItemsStatus((prevItems) => { return { ...prevItems, templatesAdded: value}})
		if (itemAdded === 'workflowsAdded') setSearchItemsStatus((prevItems) => { return { ...prevItems, workflowsAdded: value}})
	}

	return (
		<AppContext.Provider value={{
			toggleNewFileForm,
			setToggleNewFileForm,
			favoriteItems,
			setFavoriteitems,
			favoriteItemsLoaded,
			setFavoriteitemsLoaded,
			addToFavoritesState,
			removeFromFavoritesState,
			searchItems,
			setSearchItems,
			searchItemsStatus,
			updateSearchItemStatus
		}}>
			{children}
		</AppContext.Provider>
	);
};
