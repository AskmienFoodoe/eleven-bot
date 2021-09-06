import axios from "axios"
import { CommandInteraction } from "discord.js"
import { parse } from "node-html-parser"

export const currentplayers = async(interaction: CommandInteraction) => {
    const resp = (
        await axios.get(
            'https://steamcharts.com/app/1049590', 
            {headers: {
                Accept: '*/*'
            }}
        )
    ).data as string
    const num = parse(resp).querySelector('.timeago').parentNode.querySelector('span').innerText
    await interaction.reply(`There are currently ${num} players online!`)
}