import uniblockCommand from './uniblockCommand.js';
import getWallet from './wallet/getWallet.js';
import setWallet from './wallet/setWallet.js';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes
} from 'discord-interactions';
import { getBalance, pingUniblock } from './uniblockCommands.js';

const slashCommands = async (req, res, id, data) => {
  const { name } = data;

  // "test" guild command
  if (name === 'test') {
    // Send a message into the channel where command was triggered from
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        // Fetches a random emoji to send from a helper function
        content: 'hello world ' + getRandomEmoji()
      }
    });
  }

  if (name === 'ping_uniblock') {
    pingUniblock(res, id, data);
  }

  if (name === 'get_balance') {
    getBalance(res, id, data);
  }

  if (name === 'get_address') {
    getWallet(req, res, id, data);
  }

  if (name === 'set_address') {
    setWallet(req, res, id, data);
  }

  // "challenge" guild command
  if (name === 'challenge' && id) {
    const userId = req.body.member.user.id;
    // User's object choice
    const objectName = req.body.data.options[0].value;

    // Create active game using message ID as the game ID
    activeGames[id] = {
      id: userId,
      objectName
    };

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        // Fetches a random emoji to send from a helper function
        content: `Rock papers scissors challenge from <@${userId}>`,
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                // Append the game ID to use later on
                custom_id: `accept_button_${req.body.id}`,
                label: 'Accept',
                style: ButtonStyleTypes.PRIMARY
              }
            ]
          }
        ]
      }
    });
  }
};

export default slashCommands;
