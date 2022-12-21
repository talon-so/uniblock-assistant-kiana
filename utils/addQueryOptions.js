/**
 * Adds base query options for limit, offset, cursor to the command builder
 * @param slashCommandBuilder builder that provides options to commands
 */
const addQueryOptions = (slashCommandBuilder) => {
  slashCommandBuilder
    .addIntegerOption((option) =>
      option
        .setName('limit')
        .setDescription('The maximum number of records to return.')
        .setMinValue(0)
    )
    .addIntegerOption((option) =>
      option
        .setName('offset')
        .setDescription('Number of records to skip in the query.')
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('cursor')
        .setDescription('The cursor returned in the previous response.')
    );
};
exports.addQueryOptions = addQueryOptions;
