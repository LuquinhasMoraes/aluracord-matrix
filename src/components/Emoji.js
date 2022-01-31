import { Button, Box } from '@skynexui/components'
import { useState } from 'react'
import appConfig from '../../config.json';


export default function Emojis({supabaseClient, message, userLogged}) {
    // console.log(message.like, userLogged, message);
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
                    const likes = message.like.curti.filter(l => l.liked)
                    const like = likes.find( l => l.from === userLogged)
                    console.log(like, likes);

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

                    console.log(likes);
                    
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