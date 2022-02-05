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
import { ChatStore } from '../stores/ChatStore';
import { getSnapshot } from 'mobx-state-tree';
import { initializeStore } from '../stores/store';
import { useStore } from '../src/components/StoreProvider';
import { observer } from 'mobx-react-lite';

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
const ChatPage = observer((props) => {

    const [messages, setMessages] = useState([])
    const route = useRouter()
    const userLogged = route.query.user

    const { currentView } = useStore(props.initialSnapshot)
    
    useEffect(async ()=>{

        await currentView.getMessages()

            editRealtimeMessage((payload) => {
                console.log(payload)
                const newMessage = payload.new
                switch (payload.eventType) {
                    case 'INSERT':
                        if(newMessage.from !== userLogged) {
                            const audio = new Audio('./sounds/newMessage.mp3')
                            audio.play()
                        } else {
                            const audio = new Audio('./../../sounds/send-sticker.mp3')
                            audio.play()
                        }
                        currentView.addMessage(newMessage)
                        break;
                    case 'UPDATE':
                            console.log('Updateing');
                            setMessages((currentMessages) => (
                                [
                                    ...currentMessages.map(m => {
                                        console.log(m);
                                        return {
                                            id: m.id === newMessage.id ? newMessage.id : m.id,
                                            textMessage: m.id === newMessage.id ? newMessage.textMessage : m.textMessage,
                                            like: m.id === newMessage.id ? newMessage.like : m.like
                                        }
                                    })
                                ]
                            ))
                        break;                
                    default:
                        break;
                }
            })

    }, []); 

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
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    height: '100%',
                    maxWidth: {
                        md: '70%',
                        sm: '95%',
                        xs: '95%',
                    },
                    maxHeight: '93vh',
                    padding: {
                        md: '40px',
                        sm: '20px',
                        xs: '20px',
                    },
                }}
            >
                <Header userLogged={userLogged} />
                    <Box styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '0px',
                        backgroundColor: 'rgba(71, 4, 147, 0.5)'
                    }}>    
                    
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
                            currentView.messages.filter(message => !message.deleted).map((message) => {
                                return (
                                    <MessageItem
                                        currentView={currentView} 
                                        key={message.id}
                                        supabaseClient={supabaseClient} 
                                        message={message} 
                                        userLogged={userLogged} />
                                )
                            })
                        }
                    </Box>
                    
                    <TextFieldSend currentView={currentView} userLogged={userLogged} supabaseClient={supabaseClient} />
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
})

export default ChatPage

export async function getServerSideProps(context) {
    const store = initializeStore()
    const view = ChatStore.create()
    store.setCurrentView(view)
    console.log(store)
    return {
        props: {
            initialSnapshot: getSnapshot(store),
            SUPABASE_KEY: process.env.SUPABASE_KEY,
            SUPABASE_HOST: process.env.SUPABASE_HOST,
        }
    }
}