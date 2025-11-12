import _stockData from "../constants/stock_data.json";
export const stockData = _stockData;

const getStockNameByCode = (code: string) => {
  return stockData.find((stock) => stock.code === code)?.name;
};

const getStockIncludeName = (name: string) => {
  return stockData.find((stock) => stock.name.includes(name));
};

const getStockInfo = (code: string) => {
  return stockData.find((stock) => stock.code === code);
};

const getStockIncludeCode = (code: string) => {
  return stockData.find((stock) => stock.code.includes(code));
};

const getStockData = (page: number, limit: number) => {
  return {
    data: stockData.slice((page - 1) * limit, page * limit),
    total: stockData.length,
  };
};
const getPopularStocks = () => {
  return stockData.slice(0, 10);
};

export const STOCK_DATA_API = {
  getStockNameByCode,
  getStockIncludeName,
  getStockInfo,
  getStockIncludeCode,
  getStockData,
  getPopularStocks,
};
