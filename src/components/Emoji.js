import { Button, Box } from '@skynexui/components'
import { observer } from 'mobx-react-lite';
import { useState } from 'react'
import appConfig from '../../config.json';


const Emojis = ({supabaseClient, message, userLogged}) => {

    const initialStateAmei = message.like.amei.filter(l => l.liked).length
    const initialStateCurti = message.like.curti.filter(l => l.liked).length
    const initialStateHaha = message.like.haha.filter(l => l.liked).length
    const initialStateUau = message.like.uau.filter(l => l.liked).length
    const initialStateTriste = message.like.triste.filter(l => l.liked).length
    const initialStateGrr = message.like.grr.filter(l => l.liked).length
    const initialStateOlha = message.like.olha.filter(l => l.liked).length

    const [contador, setContador] = useState({ 
        curti: initialStateCurti, 
        amei: initialStateAmei, 
        haha: initialStateHaha, 
        uau: initialStateUau, 
        triste: initialStateTriste, 
        grr: initialStateGrr, 
        olha: initialStateOlha 
    })

    const emojis = {
        // curti: '👍',
        amei: '❤️',
        haha: '😄',
        // uau: '😮',
        triste: '😢',
        grr: '😡',
        // olha: '👀',
    }

    const botesEmoji = Object.entries(emojis).map(([nome, emoji]) => {
        const likes = message.like[nome].filter(l => l.liked)
        const like = likes.find( l => l.from === userLogged)

        return (

            <Button key={nome}
                type='button'
                variant='secondary'
                colorVariant='light'
                rounded='md'
                title={message.like[nome].map(l => l.from).join(', ')}
                styleSheet={{ 
                    margin: '2px',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    marginTop: '15px',
                    borderColor: appConfig.theme.colors.primary[600],
                    backgroundColor: Boolean(like) ? appConfig.theme.colors.primary[600] : appConfig.theme.colors.transparente.fundoTransparanete,
                    hover: {
                        backgroundColor: appConfig.theme.colors.primary[600],
                    },
                    focus: {
                        backgroundColor: Boolean(like) ? appConfig.theme.colors.primary[600] : appConfig.theme.colors.transparente.fundoTransparanete,
                        color: 'white',
                    }
                }}
                label={`${emoji} : ${contador[nome]}`}
                onClick={(evento) => {
                    evento.preventDefault()
                    if(like === undefined) {
                        likes.push({
                            from: userLogged,
                            liked: true
                        })
                    } else {
                        const index = likes.indexOf(like)
                        likes.splice(index, 1)
                    }
                    
                    message.update({like: {...message.like, [nome]: likes}})
                    contador[nome] = likes.length
                    setContador({ ...contador }) 
                }}
            />
        )
    })

    return <Box>{botesEmoji}</Box>
}

export default observer(Emojis) 