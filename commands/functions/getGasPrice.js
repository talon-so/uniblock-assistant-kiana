import axios from "axios";
export const getGasPrice = (chainId) => {
  return axios.get(`https://api.uniblock.dev/portfolio/v1/utils/getGasPrice?chainId=${chainId}`);
}