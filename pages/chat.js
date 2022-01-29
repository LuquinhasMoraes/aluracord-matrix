import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { BiSend } from 'react-icons/bi';
import { FaShareSquare, FaSpider } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import appConfig from '../config.json';
import Link from 'next/link';

export default function ChatPage() {
    const [message, setMessage] = useState()
    const [messages, setMessages] = useState([])
    const route = useRouter()
    const userLogged = route.query.user
    
    const sendMessage = (textMessage) => {
        const message = {
            id: messages.length + 1,
            from: userLogged, 
            textMessage: textMessage,
        }
        setMessages([
            ...messages,
            message
        ])
        setMessage('')
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'url(./img/bg.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.transparente.fundo,
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header userLogged={userLogged} />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}>

                    <MessageList messages={messages} />
                    
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
                            value={message}
                            onChange={(event) => {
                                setMessage(event.target.value)
                            }}
                            onKeyPress={(event) => {
                                if(event.key === 'Enter') {
                                    event.preventDefault()
                                    sendMessage(message)
                                }
                            }}
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.transparente.fundo,
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header(props) {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat: {props.userLogged}
                </Text>
                <Button
                    variant='tertiary'
                    label='Logout'
                    href="/"
                    styleSheet={{
                        borderRadius: '5px',
                        padding: '6px 8px',
                        backgroundColor: appConfig.theme.colors.transparente.buttonBlack,
                        marginRight: '30px',
                        color: appConfig.theme.colors.neutrals[200],
                    }}
                />
            </Box>
        </>
    )
}

function MessageText({ message }) {
    
    return (
        <Text
            key={message.id}
            tag="li"
            styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                hover: {
                    backgroundColor: appConfig.theme.colors.transparente.fundo,
                }
            }}
        >
            <Box
                styleSheet={{
                    marginBottom: '3px',
                    width: '100%', 
                    marginBottom: '16px', 
                    display: 'flex'
                }}
            >
                
                <a href={`https://github.com/${message.from}`} target="_blank">
                    <Image
                        styleSheet={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        onError={(event) => {
                            event.target.src = appConfig.userImageDefault
                        }}
                        src={`https://github.com/${message.from}.png`}
                    />
                </a>
                
                <Text tag="strong" styleSheet={{marginTop: '5px'}}>
                    <a href={`https://github.com/${message.from}`} target="_blank">
                        {message.from}
                    </a>
                </Text>
            
                <Text
                    styleSheet={{
                        fontSize: '10px',
                        marginLeft: '8px',
                        marginTop: '8px',
                        color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                >
                    {(new Date().toLocaleDateString())}
                </Text>
                <Box
                    title={`Apagar mensagem`}
                    styleSheet={{
                        padding: '2px 15px',
                        cursor: 'pointer',
                        right: '100px'
                    }}
                    onClick={()=>{
                        let resposta = confirm('Deseja remover essa mensagem?')
                        if(resposta === true){
                                
                        }
                    }}
                >
                    {<RiDeleteBinLine />}
                </Box>
            </Box>

            

            {message.textMessage}
        </Text>
    )
}   

function MessageList({messages}) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                wordBreak: 'break-word',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '1px'
            }}
        >

            {
                messages.map(message => {
                    return (
                        <MessageText key={message.id} message={message} />
                    )
                })
            }

            
        </Box>
    )
}