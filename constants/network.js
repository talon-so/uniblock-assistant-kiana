const NETWORKS = {
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 1,
    openseaCategory: 'ethereum',
  },
  5: {
    name: 'Goerli',
    symbol: 'ETH',
    chainId: 5
  },
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: 137,
    openseaCategory: 'matic',
  }
};

const NETWORK_OPTIONS = [
  { name: 'ETH', value: 1 },
  { name: 'MATIC', value: 137 }
];

const getNetwork = (chainId) => {
  return NETWORKS[chainId];
};

exports.NETWORK_OPTIONS = NETWORK_OPTIONS;
exports.getNetwork = getNetwork;
