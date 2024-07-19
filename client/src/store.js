import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";
import providerApi from "./services/providerApi";

// persist our store
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";

// reducers
const reducer = combineReducers({
    user: userSlice,
    [appApi.reducerPath]: appApi.reducer,
    [providerApi.reducerPath]: providerApi.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    blackList: [
        appApi.reducerPath,
        providerApi.reducerPath,
    ],
};

// persist our store

const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            thunk,
            appApi.middleware,
            providerApi.middleware
        ),
});
export default store;


// import { configureStore } from "@reduxjs/toolkit";
// import userSlice from "./features/userSlice";
// import appApi from "./services/appApi";
// import appApiBrand from "./services/appApiBrands";
// import appApiSupplier from "./services/appApiSuppliers";
// import appApiPurchases from "./services/appApiPurchases";
// import appApiProducts from "./services/appApiProducts";
// import appApiAdjustments from "./services/appApiAdjustments";
// import appApiAreas from "./services/appApiAreas";
// import appApiOrders from "./services/appApiOrders";

// // persist our store
// import storage from "redux-persist/lib/storage";
// import { combineReducers } from "redux";
// import { persistReducer } from "redux-persist";
// import thunk from "redux-thunk";

// // reducers
// const reducer = combineReducers({
//     user: userSlice,
//     [appApi.reducerPath]: appApi.reducer,
//     [appApiBrand.reducerPath]: appApiBrand.reducer,
//     [appApiSupplier.reducerPath]: appApiSupplier.reducer,
//     [appApiPurchases.reducerPath]: appApiPurchases.reducer,
//     [appApiProducts.reducerPath]: appApiProducts.reducer,
//     [appApiAdjustments.reducerPath]: appApiAdjustments.reducer,
//     [appApiAreas.reducerPath]: appApiAreas.reducer,
//     [appApiOrders.reducerPath]: appApiOrders.reducer,
// });

// const persistConfig = {
//     key: "root",
//     storage,
//     blackList: [
//         appApi.reducerPath,
//         appApiBrand.reducerPath,
//         appApiSupplier.reducerPath,
//         appApiPurchases.reducerPath,
//         appApiProducts.reducerPath,
//         appApiAdjustments.reducerPath,
//         appApiAreas.reducerPath,
//         appApiOrders.reducerPath,
//     ],
// };

// // persist our store

// const persistedReducer = persistReducer(persistConfig, reducer);

// // creating the store

// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: 
//     [thunk, 
//     appApi.middleware, 
//     appApiBrand.middleware, 
//     appApiSupplier.middleware, 
//     appApiPurchases.middleware, 
//     appApiProducts.middleware,
//     appApiAdjustments.middleware,
//     appApiAreas.middleware,
//     appApiOrders.middleware],
// });

// export default store;

