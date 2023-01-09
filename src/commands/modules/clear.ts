import { YouTubeInterface } from 'bot-classes';
import { getCommandIntraction, initComponentInteractionHandler } from 'bot-functions';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { CommandHandler } from '../CommandHandler.types';

const clear: CommandHandler = async initialInteraction => {
	try {
		const commandInteraction = getCommandIntraction(initialInteraction);

		if (!commandInteraction) {
			return;
		}

		const { interaction, guild, guildMember } = commandInteraction;
		await interaction.deferReply({ ephemeral: true });
		const voiceChannel = guildMember.voice.channel;

		if (!voiceChannel) {
			await interaction.editReply('🚨 You must be connected to a voice channel for me to clear the queue!');
			return;
		}

		const audioInterface = YouTubeInterface.getInterfaceForGuild(guild);
		const queueLength = await audioInterface.queueLength();

		if (queueLength > 0) {
			const actionRow = new MessageActionRow().addComponents(
				new MessageButton().setCustomId('queue-clear-accept').setLabel('Delete!').setStyle('DANGER'),
				new MessageButton().setCustomId('queue-clear-decline').setLabel('Leave it!').setStyle('SUCCESS')
			);

			const botMessage = await interaction.editReply({
				content: `ℹ️ Are you sure you want to delete the ENTIRE queue? ${queueLength} item${queueLength > 1 ? 's' : ''} will be removed if you do!`,
				components: [actionRow]
			});

			if (!(botMessage instanceof Message)) {
				return;
			}

			initComponentInteractionHandler(botMessage, interaction);
		} else {
			await interaction.editReply({ content: 'ℹ️ The queue seems to be empty.' });
		}
	} catch (error) {
		console.error(error);
	}
};

export default clear;
