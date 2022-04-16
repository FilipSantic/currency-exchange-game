import axios from "axios";

const API_URL = "/api/transactions";

const createTransaction = async (transactionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, transactionData, config);

  return response.data;
};

const getTransactions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const transactionsService = {
  createTransaction,
  getTransactions,
};

export default transactionsService;
