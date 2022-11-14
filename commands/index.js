import uniblockCommand from "./uniblockCommand.js";
import slashCommands from "./slashCommands.js";
import interactiveCommands from "./interactiveCommands.js";

export async function HandleCommands(type, id, data) {
  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === 'ping_uniblock') {
    uniblockCommand(id, data);
  }


  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    slashCommands(id, data);
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    interactiveCommands(id, data);
  }
}