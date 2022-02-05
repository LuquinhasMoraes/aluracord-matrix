import { memo, useState } from "react";
import appConfig from '../../config.json';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { BiSend, BiEdit, BiReply, BiReplyAll } from 'react-icons/bi';
import { BsFillReplyFill } from 'react-icons/bs';

import { RiDeleteBinLine } from 'react-icons/ri';

import Emojis from './Emoji';
import { observer } from "mobx-react-lite";

const MessageItem = ({currentView, supabaseClient, message, userLogged}) => {

    const [textMessage, setTextMessage] = useState()
    // const [message, setMessage] = useState(messageItem)
    const [messageEdit, setMessageEdit] = useState()
    
    if(message.deleted) return (null)

    return (
        <>
            <Text
                key={message.id}
                tag="li"
                styleSheet={{
                    padding: '15px',
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
                    
                    <Text tag="strong" styleSheet={{marginTop: '0px'}}>
                        <a href={`https://github.com/${message.from}`} target="_blank">
                            {message.from}
                        </a>

                        <Text
                            styleSheet={{
                                fontSize: '10px',
                                marginLeft: '0px',
                                marginTop: '5px',
                                color: appConfig.theme.colors.neutrals[300],
                            }}
                            tag="p"
                        >
                        
                            {(new Date(message.created_at).toLocaleDateString()) + ' às ' + new Date(message.created_at).toLocaleTimeString()} {message.updated_at != null ? `- Editado às ${new Date(message.updated_at).toLocaleTimeString()}` : null}
                        </Text>
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

                                message.delete()

                                // supabaseClient
                                //     .from('messages')
                                //     .update({ deleted: true })
                                //     .match({ id: message.id }).then(res => {
                                //         if(res.error === null) {
                                //             setMessage(res.data[0])
                                //             const audio = new Audio('./../../sounds/send-trash.mp3')
                                //             audio.play()
                                //         }
                                //         else
                                //             console.error('Erro ao deletar mensagem: ', error)
                                //     })
                            
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
                                setMessageEdit(message.textMessage)
                                message.setIsEdinting(true)
                                // handleOnClickEditMessage(message)
                            }}
                        >
                            {<BiEdit />}
                        </Box>

                        
                        </>
                        : 
                            
                        <Box
                            title={`Responder para ${message.from}`}
                            styleSheet={{
                                padding: '2px 15px',
                                cursor: 'pointer',
                                right: '10px'
                            }}
                            onClick={()=>{
                                setMessage((msg) => ({...msg, isReplying: true}))
                            }}
                        >
                            {<BsFillReplyFill />}
                        </Box>

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

                                    message.update({ textMessage: messageEdit.textMessage, updated_at: new Date() })

                                    // supabaseClient
                                    // .from('messages')
                                    // .update({ textMessage: messageEdit, updated_at: new Date() })
                                    // .match({ id: message.id }).then(res => {
                                    //     if(res.error === null)
                                    //         setMessage(res.data[0])
                                    //     else
                                    //         console.error('Erro ao editar mensagem: ', error)
                                    // })
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
                        null
                }
                {
                    message.textMessage.startsWith(':sticker:') ? 
                    (
                        <Image src={message.textMessage.replace(':sticker:', '')}
                        styleSheet={{
                            width: '150px',
                        }}
                        />
                    ) : 
                    (
                        !message.isEditing ? message.textMessage : null
                    )
                
                }
                <Emojis supabaseClient={supabaseClient} message={message} userLogged={userLogged} />
            </Text>
            
        </>
    )
}

export default observer(MessageItem)