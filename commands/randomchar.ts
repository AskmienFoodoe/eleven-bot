import { CommandInteraction, MessageEmbed } from "discord.js"
import { ErBsClient } from "erbs-client"

export const randomchar = async(interaction: CommandInteraction, erbsClient: ErBsClient) => {
    const charData = await erbsClient.getCharacters()
    const ran = Math.floor(Math.random() * charData.length)
    const ranChar = charData[ran]
    const charId = (ranChar.code + 1000).toString().slice(1)
    const embed = new MessageEmbed()
        .setTitle(`You got ${ranChar.name}!`)
        .setThumbnail(`https://dak.gg/bser/images/assets/character/community/${charId}.png`)
        .setImage(`https://dak.gg/bser/images/assets/character/full/${charId}.png`)
    await interaction.reply({ embeds: [embed] })
}