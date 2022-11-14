import axios from "axios";
export const getGasPrice = (chainId) => {
  return axios.get(`${process.env.UNIBLOCK_BASE_URL}/utils/getGasPrice?chainId=${chainId}`);
}