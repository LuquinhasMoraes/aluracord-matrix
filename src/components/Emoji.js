import { Button, Box } from '@skynexui/components'
import { useState } from 'react'
import appConfig from '../../config.json';


export default function Emojis() {

    const [contador, setContador] = useState({ curti: 0, amei: 0, haha: 0, uau: 0, triste: 0, grr: 0, olha: 0 })

    const emojis = {

        curti: '👍',
        amei: '❤️',
        haha: '😄',
        uau: '😮',
        triste: '😢',
        grr: '😡',
        olha: '👀',
    }

    const botesEmoji = Object.entries(emojis).map(([nome, emoji]) => {

        return (

            <Button key={nome}
                type='button'
                variant='secondary'
                colorVariant='light'
                rounded='md'
                styleSheet={{ 
                    margin: '5px',
                    marginTop: '15px',
                    borderColor: appConfig.theme.colors.primary[600],
                    hover: {
                        backgroundColor: appConfig.theme.colors.primary[600],
                    }
                }}
                label={`${emoji} : ${contador[nome]}`}
                onClick={(evento) => {
                    evento.preventDefault()
                    contador[nome] += 1
                    setContador({ ...contador })
                }}
            />
        )
    })

    return <Box>{botesEmoji}</Box>
}