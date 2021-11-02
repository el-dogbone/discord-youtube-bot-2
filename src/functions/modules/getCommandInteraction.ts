import { Guild, GuildMember, Interaction } from 'discord.js';

/**
 * Get the command interaction instance for a given interaction.
 * Will return false if not in a guild and not sent by a guild member and is not a command.
 * This is useful because the bot can take commands in the DMs.
 */
export default function getCommandIntraction(interaction: Interaction) {
	const guildMember = interaction.member;
	const isGuild = interaction.guild instanceof Guild;
	const isGuildMember = guildMember instanceof GuildMember;
	const isCommand = interaction.isCommand();

	if (!isGuild && !isGuildMember) {
		if (isCommand) {
			interaction.reply('🚨 I only take commands in Discord servers.');
			return null;
		}
	} else if (isCommand) {
		// Safe to assert types, as this block will only run if the first condition was met.
		return { interaction, guild: interaction.guild as Guild, guildMember: interaction.member as GuildMember };
	}

	return null;
}
