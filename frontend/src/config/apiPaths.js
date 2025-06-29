// BASE URL
// export const BASE_URL = 'http://localhost:8000';
export const BASE_URL = 'https://mm-backend-doq0.onrender.com';

// API ENDPOINT PATHS
export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',               // Signup
    LOGIN: '/api/v1/auth/login',                     // Authenticate user & return JWT token
    GET_PROFILE: '/api/v1/auth/profile',             // Get logged-in user details
  },
  DASHBOARD:{
    GET_DASHBOARD: '/api/v1/dashboard',
  },
  EXPENSES: {
    ADD_EXPENSE: '/api/v1/expense/add',
    GET_EXPENSES: '/api/v1/expense/get',
    DELETE_EXPENSE:(id)=> `/api/v1/expense/${id}`,
    DOWNLOAD_EXPENSES: '/api/v1/expense/download',
  },
  INCOMES: {
    ADD_INCOME: '/api/v1/income/add',
    GET_INCOMES: '/api/v1/income/get',
    DELETE_INCOME:(id)=> `/api/v1/income/${id}`,
    DOWNLOAD_INCOMES: '/api/v1/income/download',
  },
  IMAGE:{
    UPLOAD_IMAGE: '/api/v1/image/upload',
  },
  TRANSACTIONS: {
    BORROW_MONEY: '/api/v1/transaction/borrow',
    SPEND_MONEY: '/api/v1/transaction/spent',
    GET_PEOPLE: '/api/v1/transaction/get_people',
    GET_TRANSACTIONS: '/api/v1/transaction/get_transactions',
    DELETE_TRANSACTION: (id) => `/api/v1/transaction/${id}`,
    GET_PERSON_HISTORY: (name) => `/api/v1/transaction/person/history/${name}`,
    DOWNLOAD_PERSON_HISTORY_EXCEL: (name) => `/api/v1/transaction/person/download/${name}`,
  },
};
