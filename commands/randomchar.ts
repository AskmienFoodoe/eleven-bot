import axios from "axios"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { config } from "dotenv"
import { ErBsClient } from "erbs-client"

config()

let freeChars: number[] = []

export const randomchar = async(interaction: CommandInteraction, erbsClient: ErBsClient, numChars = 1, free?: boolean) => {
    let charData = await erbsClient.getCharacters()
    if (free) {
        const resp = await axios.get(
            'https://open-api.bser.io/v1/freeCharacters/2',
            {
                headers: {
                    'x-api-key': process.env.ERBS_KEY
                }
            }
        )
        if (resp.data.message === 'Success') {
            freeChars = resp.data.freeCharacters
            charData = charData.filter(char => freeChars.includes(char.code))
        }
    }
    const ranChars = []
    for (let i = 0; i < numChars; i++) {
        const ran = Math.floor(Math.random() * charData.length)
        ranChars.push(charData[ran])
        charData.splice(ran, 1)
    }
    const embeds = ranChars.map(ranChar => {
        const charId = (ranChar.code + 1000).toString().slice(1)
        const embed = new MessageEmbed()
        if (ranChar.code === 30) {
            embed.setDescription('Hey, it\'s me! <:Eleven_P:884237657020960828>')
        }
        if (numChars === 1) {
            return embed.setImage(`https://dak.gg/bser/images/assets/character/full/${charId}.png`)
        } else {
            return embed.setImage(`https://dak.gg/bser/images/assets/character/community/${charId}.png`)
        }
    })
    const names = ranChars.map(ranChars => ranChars.name).join(', ')
    embeds[0].setTitle(`You got ${names}!`)
    
    await interaction.reply({ embeds })
}