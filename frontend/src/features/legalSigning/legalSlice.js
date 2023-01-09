import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    "platform_type": "Website",
    "app_or_website_or_service_name": "",
    "app_or_website_or_service_url": window.location.origin + window.location.pathname + "#",
    "description": "", 
    "company_name": "",
    "company_address": "",
    "company_registration_number": "",
    "company_country": "",
    "contact_email_id": "",
    "website_contact_page_url": "",
    "last_update_date": "", 
    "app_or_website_governed_by_or_jurisdiction": "",
    "days_allowed_for_cancellation_of_order_or_product": "",
    "reimburse_days": ""
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setWebsiteName: (state, action) => {
            state.app_or_website_or_service_name = action.payload
        },
        setWebsiteDescription: (state, action) => {
            state.description = action.payload
        },
        setCompanyName: (state, action) => {
            state.company_name = action.payload
        },
        setCompanyAddress: (state, action) => {
            state.company_address = action.payload
        },
        setCompanyRegistrationNumber: (state, action) => {
            state.company_registration_number = action.payload
        },
        setCompanyCountry: (state, action) => {
            state.company_country = action.payload
        },
        setCompanyEmail: (state, action) => {
            state.contact_email_id = action.payload
        },
        setWebsiteContactPageUrl: (state, action) => {
            state.website_contact_page_url = action.payload
        },
        setLastUpdateDate: (state, action) => {
            state.last_update_date = action.payload
        },
        setCompanyJurisdiction: (state, action) => {
            state.app_or_website_governed_by_or_jurisdiction = action.payload
        },
        setCancellationPeriod: (state, action) => {
            state.days_allowed_for_cancellation_of_order_or_product = action.payload
        },
        setReimbursePeriod: (state, action) => {
            state.reimburse_days = action.payload
        },
    }
})

export const {
    setWebsiteName,
    setWebsiteDescription,
    setCompanyName,
    setCompanyAddress,
    setCompanyRegistrationNumber,
    setCompanyCountry,
    setCompanyEmail,
    setWebsiteContactPageUrl,
    setLastUpdateDate,
    setCompanyJurisdiction,
    setCancellationPeriod,
    setReimbursePeriod,
} = appSlice.actions;

export default appSlice.reducer;