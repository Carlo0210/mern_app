import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL
const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}`,
  }),

  endpoints: (builder) => ({
    // creating the user
    signupUser: builder.mutation({
      query: (user) => ({
        url: "/api",
        method: "POST",
        body: user,
      }),
    }),

    // login
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/api/login",
        method: "POST",
        body: user,
      }),
    }),

    // logout
    logoutUser: builder.mutation({
      query: (payload) => ({
        url: "/api/logout",
        method: "DELETE",
        body: payload,
      }),
    }),    

    // delete account
    deleteAccount: builder.mutation({
      query: (userId) => ({
        url: `/api/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useDeleteAccountMutation,
} = appApi;

export default appApi;

