import { Box, TextField, Button, Text } from '@skynexui/components';
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
            deleted: false,
            like: {
                amei: [],
                curti: [],
                haha: [],
                uau: [],
                triste: [],
                grr: [],
                olha: []
            },
            updated_at: null
        }
        return message
    }

    return (

        <>
            {/* <Box 
                styleSheet={{
                    display: 'flex',
                    width: '100%',
                    padding: '15px',
                    backgroundColor: appConfig.theme.colors.transparente.fundo
                }}
            >
                <Text>Respondendo para: </Text>
            </Box> */}
            <Box
                as="form"
                styleSheet={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px'
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
                            props.currentView.sendMessage(createMessage(textMessage))
                            setTextMessage('')
                        }
                    }}
                    styleSheet={{
                        width: '100%',
                        // border: '0',
                        // resize: 'none',
                        borderRadius: '5px',
                        paddingTop: '17px',
                        paddingLeft: '17px',
                        backgroundColor: appConfig.theme.colors.transparente.fundo,
                        // marginRight: '12px',
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
                        props.currentView.sendMessage(createMessage(':sticker: ' + sticker))
                    }}
                    />

                <Button
                    variant='tertiary'
                    label={<BiSend size={25} />}
                    type='submit'
                    styleSheet={{
                        borderRadius: '5px',
                        minWidth: '59px',
                        minHeight: '59px',
                        marginBottom: '14px',
                        marginTop: '5px',
                        backgroundColor: appConfig.theme.colors.transparente.fundoTransparanete,
                        right: '85px',
                        position: 'absolute',
                        color: appConfig.theme.colors.neutrals[200],
                        hover:{
                            backgroundColor: appConfig.theme.colors.transparente.fundoTransparanete
                        },
                        focus:{
                            backgroundColor: appConfig.theme.colors.transparente.fundoTransparanete,
                        }
                    }}
                    
                    onClick={(event) => {
                        event.preventDefault();
                        if (textMessage.length > 0) {
                            event.preventDefault()
                            sendMessage(createMessage(textMessage))
                            setTextMessage('')
                        }
                    }}
                    />
            </Box>
        </>
    )
}

export default TextFieldSend