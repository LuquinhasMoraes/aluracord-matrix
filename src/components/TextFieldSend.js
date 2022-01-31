import { Box, TextField, Button } from '@skynexui/components';
import { BiSend } from 'react-icons/bi';
import React, { useEffect, useState } from 'react';
import appConfig from '../../config.json';
import { ButtonSendSticker } from './ButtonSendSticker';

const TextFieldSend = (props) => {
    const [textMessage, setTextMessage] = useState()

    function createMessage(textMessage) {
        const message = {
            from: props.userLogged, 
            textMessage: textMessage,
            updated_at: null
        }
        return message
    }

    function sendMessage(message) {
        props.supabaseClient
            .from('messages')
            .insert([
                message
            ])
            .then(( {data})=>{
                console.log('Criando Mensagem: ', data);
            })   
        setTextMessage('')
    }

    return (
        <Box
            as="form"
            styleSheet={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <TextField
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                value={textMessage}
                onChange={(event) => {
                    setTextMessage(event.target.value)
                }}
                onKeyPress={(event) => {
                    if(event.key === 'Enter') {
                        event.preventDefault()
                        sendMessage(createMessage(textMessage))
                    }
                }}
                styleSheet={{
                    width: '100%',
                    // border: '0',
                    resize: 'none',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    backgroundColor: appConfig.theme.colors.transparente.fundo,
                    marginRight: '12px',
                    color: appConfig.theme.colors.neutrals[200],
                    focus: {
                        borderColor: appConfig.theme.colors.neutrals[400],
                    },
                    hover: {
                        borderColor: appConfig.theme.colors.neutrals[400],
                    }
                }}
            />

            <ButtonSendSticker 
                onStickerClick={(sticker) => {
                    sendMessage(createMessage(':sticker: ' + sticker))
                }}
            />

            <Button
                variant='tertiary'
                label={<BiSend />}
                type='submit'
                styleSheet={{
                    borderRadius: '5px',
                    minWidth: '46px',
                    minHeight: '46px',
                    marginBottom: '14px',
                    marginTop: '5px',
                    backgroundColor: appConfig.theme.colors.primary[600],
                    marginLeft: '5px',
                    color: appConfig.theme.colors.neutrals[200],
                    hover:{
                        backgroundColor: appConfig.theme.colors.transparente.buttonRed,
                    },
                    focus:{
                        backgroundColor: appConfig.theme.colors.primary[600],
                    }
                }}
                
                onClick={(event) => {
                    event.preventDefault();
                    if (textMessage.length > 0) {
                        event.preventDefault()
                        sendMessage(createMessage(textMessage))
                    }
                }}
            />
        </Box>
    )
}

export default TextFieldSend