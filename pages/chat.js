import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { BiSend, BiEdit } from 'react-icons/bi';
import { FaShareSquare, FaSpider } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import Emojis from '../src/components/Emoji';
import MessageItem from '../src/components/MessageItem';
import TextFieldSend from '../src/components/TextFieldSend';

const supabaseClient = createClient('https://bfomzoczejfqvfooluii.supabase.co', process.env.PRIVATE_KEY)

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

    const [messages, setMessages] = useState([])
    const route = useRouter()
    const userLogged = route.query.user

    useEffect(()=>{

        supabaseClient
            .from('messages')
            .select('*')
            .match({deleted: false})
            .order('id', { ascending: false})
            .then(( {data})=>{
                setMessages(data)
            });

            editRealtimeMessage((payload) => {
                console.log(payload)
                const newMessage = payload.new
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
                            // setMessages((currentMessages) => (
                            //     [
                            //         ...currentMessages.map(m => {
                            //             return {
                            //                 ...m,
                            //                 textMessage: m.id === newMessage.id ? newMessage.textMessage : m.textMessage
                            //             }
                            //         })
                            //     ]
                            // ))
                        break;                
                    default:
                        break;
                }
            })

    }, []);

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
            .update({ textMessage: newMessage, updated_at: new Date() })
            .match({ id: id }).then(res => {
                editMessageClient(newMessage, id)
            })
                    
    }

    const handleOnClickEditMessage = (message) => {
        const editedMessages = messages.map(m => {
            if (m.id === message.id) {
                return {
                    ...m,
                    updated_at: new Date(),
                    isEditing: true
                }
            } else {
                return {
                    ...m
                }
            }
        })
        setMessages(editedMessages)
    }

    

    const MessageList = ({messages}) => {
        return (
            <Box
                tag="ul"
                id="main-box"
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
                    messages.filter(message => !message.deleted).map((message) => {
                        return (
                            <MessageItem 
                                key={message.id}
                                supabaseClient={supabaseClient} 
                                messageItem={message} 
                                userLogged={userLogged} />
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

                    <TextFieldSend userLogged={userLogged} supabaseClient={supabaseClient} />

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
                            backgroundColor: appConfig.theme.colors.primary[900],
                            marginRight: '10px',
                            color: appConfig.theme.colors.neutrals[200],
                        }}
                        buttonColors={{
                            contrastColor: appConfig.theme.colors.neutrals["000"],
                            mainColor: appConfig.theme.colors.primary[900],
                            mainColorLight: appConfig.theme.colors.primary[400],
                            mainColorStrong: appConfig.theme.colors.primary[600],
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