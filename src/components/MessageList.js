import { Box, Text, Button } from '@skynexui/components';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useEffect, useState } from 'react';
import appConfig from '../../config.json';
import MessageItem from './MessageItem';

const MessageList = ({messages, userLogged, supabaseClient}) => {
    console.log('new messages', messages)
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
            }}>

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

export default MessageList