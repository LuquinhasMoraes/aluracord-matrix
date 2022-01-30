import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { BiSend, BiEdit } from 'react-icons/bi';
import { FaShareSquare, FaSpider } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient('https://bfomzoczejfqvfooluii.supabase.co', process.env.PRIVATE_KEY)

function getRealtimeMessages(sendMessage) {
    return supabaseClient
        .from('messages')
        .on('INSERT', payload => {
            console.log(payload);
            // sendMessage(payload.new)
        }).subscribe(event => {
            console.log(event);
        })
}

function editRealtimeMessage(updateInRealTime) {
    return supabaseClient
        .from('messages')
        .on('*', payload => {
            updateInRealTime(payload)
        }).subscribe(event => {
            console.log(event);
        })
}


export default function ChatPage(props) {

    const [textMessage, setMessage] = useState()
    const [messageEdit, setMessageEdit] = useState()
    const [messages, setMessages] = useState([])
    const route = useRouter()
    const userLogged = route.query.user

    useEffect(()=>{

        getRealtimeMessages((event) => {
            console.log(event);
            
        })

        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false})
            .then(( {data})=>{
                setMessages(data)
            });

            editRealtimeMessage((payload) => {
                console.log(payload)
                const newMessage = payload.new
                const oldMessage = payload.old
                switch (payload.eventType) {
                    case 'INSERT':
                        if(newMessage.from !== userLogged) {
                            const audio = new Audio('./sounds/newMessage.mp3')
                            audio.play()
                        }
                        setMessages((currentMessages) => (
                            [
                                newMessage,
                                ...currentMessages
                            ]
                        ))
                        break;
                    case 'UPDATE':
                            setMessages((currentMessages) => (
                                [
                                    ...currentMessages.map(m => {
                                        return {
                                            ...m,
                                            textMessage: m.id === newMessage.id ? newMessage.textMessage : m.textMessage
                                        }
                                    })
                                ]
                            ))
                        break;                
                    default:
                        break;
                }
                

                // editMessageClient(newMessage.textMessage, newMessage.id)
            })
    
            // editRealtimeMessage((newMessage) => {
            //     console.log(newMessage);
            //     setMessages((currentMessages) => (
            //         [
            //             ...currentMessages.map(m => {
            //                 return {
            //                     ...m,
            //                     textMessage: m.id === newMessage.id ? newMessage.textMessage : m.textMessage
            //                 }
            //             })
            //         ]
            //     ))

            //     // editMessageClient(newMessage.textMessage, newMessage.id)
            // })

    }, []);

    function createMessage(textMessage) {
        const message = {
            from: userLogged, 
            textMessage: textMessage,
            updated_at: null
        }
        return message
    }
    
    function sendMessage(message) {
        
        console.log(message);
        supabaseClient
            .from('messages')
            .insert([
                message
            ])
            .then(( {data})=>{
                console.log('Criando Mensagem: ', data);
                // setMessages([
                //     data[0],
                //     ...messages,
                // ]);
            })   
        setMessage('')
    }

    function editMessageClient(newMessage, id) {
        console.log(newMessage, id, messages);
        const editedMessages = messages.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    isEditing: false,
                    textMessage: newMessage
                }
            } else {
                return {
                    ...m
                }
            }
        })
        console.log(editedMessages);
        setMessages(editedMessages)
    }

    const editMessage = (newMessage, id) => {
        supabaseClient
            .from('messages')
            .update({ textMessage: newMessage })
            .match({ id: id }).then(res => {
                editMessageClient(newMessage, id)
            })
                    
    }

    

    const MessageList = ({messages}) => {
        return (
            <Box
                tag="ul"
                key="editor1"
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
                    messages.map((message, key) => {
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

                                    {
                                        message.from === userLogged ?

                                        <>
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
                                                    supabaseClient
                                                    .from('messages')
                                                    .delete()
                                                    .match({ id: message.id }).then(() =>{
                                                        let index = messages.indexOf(message);
                                                        messages.splice(index, 1)
                                                        setMessages([...messages])
                                                    })  
                                                }
                                            }}
                                        >
                                            {<RiDeleteBinLine />}
                                        </Box>

                                        <Box
                                            title={`Editar mensagem`}
                                            styleSheet={{
                                                padding: '2px 0px',
                                                cursor: 'pointer',
                                                right: '10px'
                                            }}
                                            onClick={()=>{
                                                const editedMessages = messages.map(m => {
                                                    if (m.id === message.id) {
                                                        return {
                                                            ...m,
                                                            isEditing: true
                                                        }
                                                    } else {
                                                        return {
                                                            ...m
                                                        }
                                                    }
                                                })
                                                setMessageEdit(message.textMessage)
                                                setMessages(editedMessages)
                                            }}
                                        >
                                            {<BiEdit />}
                                        </Box>
                                        </>
                                        : null

                                    }

                                    

                                </Box>

                                
                                {
                                    message.isEditing ?
                                        <TextField
                                            key={'edinting' + message.id}
                                            placeholder="Edite sua mensagem"
                                            value={messageEdit}
                                            autoFocus="autoFocus"
                                            onChange={(event) => {
                                                setMessageEdit(event.target.value)
                                            }}
                                            onKeyPress={(event) => {
                                                if(event.key === 'Enter') {
                                                    event.preventDefault()
                                                    editMessage(messageEdit, message.id)
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
                                        :
                                        message.textMessage
                                }
                            </Text>
                        )
                    })
                }
    
                
            </Box>
        )
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
                            value={textMessage}
                            onChange={(event) => {
                                setMessage(event.target.value)
                            }}
                            onKeyPress={(event) => {
                                if(event.key === 'Enter') {
                                    event.preventDefault()
                                    sendMessage(createMessage(textMessage))
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
}

export async function getServerSideProps(context) {
    return {
        props: {
            SUPABASE_KEY: process.env.SUPABASE_KEY,
            SUPABASE_HOST: process.env.SUPABASE_HOST,
        }
    }
}