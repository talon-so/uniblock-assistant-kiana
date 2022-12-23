const convertIPFSUrl = (ipfsUrl) => {
  let convertedStr = ipfsUrl;
  let prefix = ipfsUrl.substring(0, 7);
  let hash = ipfsUrl.substring(7);
  // replace ipfs prefix with https ipfs gateway
  if (prefix == 'ipfs://') {
    convertedStr = process.env.IPFS_BASE_URL + hash;
  }
  return convertedStr;
};

exports.convertIPFSUrl = convertIPFSUrl;
