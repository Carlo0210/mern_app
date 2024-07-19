// api/providerApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const providerApi = createApi({
  reducerPath: "providerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
  }),

  endpoints: (builder) => ({
    saveProviders: builder.mutation({
      query: (providers) => ({
        url: "/api/providers", // Use the correct endpoint URL
        method: "POST",
        body: providers,
      }),
    }),

    getProviders: builder.query({
      query: () => ({
        url: "/api/providers", // Use the correct endpoint URL
        method: "GET",
      }),
    }),

    getProviderNpi: builder.query({
      query: (npi) => ({
        url: `/api/provider/${npi}`, // Use the correct endpoint URL
        method: "GET",
      }),
    }),

    checkNPIExists: builder.query({
      query: (npi) => ({
        url: `/api/providers/${npi}/exists`, // Use the correct endpoint URL
        method: "GET",
      }),
    }),

    getAllSpecialties: builder.query({
      query: () => ({
        url: "/api/specialties", // Use the correct endpoint URL
        method: "GET",
      }),
    }),

    getAllStatesAndCities: builder.query({
      query: () => ({
        url: "/api/states-cities", // Use the correct endpoint URL
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSaveProvidersMutation,
  useGetProvidersQuery,
  useGetProviderNpiQuery,
  useCheckNPIExistsQuery,
  useGetAllSpecialtiesQuery,
  useGetAllStatesAndCitiesQuery,
} = providerApi;

export default providerApi;
