import axios from 'axios';
import { InteractionResponseType } from 'discord-interactions';
import { wrapCodeBlock } from '../utils/wrapCodeBlock.js';

const instance = axios.create({
  baseURL: process.env.UNIBLOCK_BASE_URL,
  timeout: 1000
});

export const pingUniblock = async (res) => {
  // Make a request for a user with a given ID
  const axiosRes = await axios.get(process.env.UNIBLOCK_BASE_URL + '/v1/ping');
  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: axiosRes.data.ping
    }
  });
};

export const getBalance = async (res) => {
  // Make a request for a user with a given ID
  const axiosRes = await axios.get(
    process.env.UNIBLOCK_BASE_URL +
      '/v1/balance/0x4A8b9FA6B245a34E587Dc9A9AfBC395907446e4C?chainId=1'
  );
  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: wrapCodeBlock(JSON.stringify(axiosRes.data))
    }
  });
};
