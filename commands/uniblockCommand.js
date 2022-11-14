import axios from 'axios';

const uniblockCommand = async () => {
  // Make a request for a user with a given ID
  const axiosRes = await axios.get(
    process.env.UNIBLOCK_BASE_URL + '/portfolio/v1/ping'
  );
  console.log(axiosRes.data.ping);
  // Send a message into the channel where command was triggered from
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: axiosRes.data.ping
    }
  });
}

export default uniblockCommand;