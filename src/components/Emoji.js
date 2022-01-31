import { Button, Box } from '@skynexui/components'
import { useState } from 'react'
import appConfig from '../../config.json';


export default function Emojis({supabaseClient, message, userLogged}) {
    const [contador, setContador] = useState({ curti: 0, amei: message.like.curti.filter(l => l.liked).length, haha: 0, uau: 0, triste: 0, grr: 0, olha: 0 })

    const emojis = {

        // curti: '👍',
        amei: '❤️',
        // haha: '😄',
        // uau: '😮',
        // triste: '😢',
        // grr: '😡',
        // olha: '👀',
    }

    const botesEmoji = Object.entries(emojis).map(([nome, emoji]) => {
        console.log();
        return (

            <Button key={nome}
                type='button'
                variant='secondary'
                colorVariant='light'
                rounded='md'
                title={message.like.curti.map(l => l.from).join(', ')}
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
                    const likes = message.like.curti.filter(l => l.liked)
                    const like = likes.find( l => l.from === userLogged)

                    if(like === undefined) {
                        likes.push({
                            from: userLogged,
                            liked: true
                        })
                    } else {
                        const index = likes.indexOf(like)
                        console.log(index);
                        likes.splice(index, 1)
                    }
                    
                    supabaseClient
                    .from('messages')
                    .update({like: {curti: likes}})
                    .match({ id: message.id }).then((event) =>{
                        console.log(event);
                        contador[nome] = likes.length
                        message.like = {curti: likes}
                        setContador({ ...contador })
                    })
                    
                    
                    
                }}
            />
        )
    })

    return <Box>{botesEmoji}</Box>
}