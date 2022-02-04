import React from 'react';
import { areMessagePropsEqual, Channel, useChatContext, MessageTeam } from 'stream-chat-react';
import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = ({isCreating,setIsCreating, isEditing, setIsEditing, createType}) => {
  

  // To get info about the current specific channel
  const { channel } = useChatContext();

  // are we creating a new channel?
  if (isCreating) {
    return (
      <div className='channel__container'>
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </div>
    )
  }

  // are we editing existing channel?
  if (isEditing) {
    return (
      <div className='channel__container'>
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    )
  }

  // when we have no chats
  const EmptyState = () => (
    <div className='channel-empty__container'>
      <p className='channel-empty__first'>This is the beginning of your chat history.</p>
      <p className='channel-empty__second'>Send messages, attachements, links, emojis and more.</p>
    </div>
  )
  return (
    <div className='channel__container'>
      <Channel
      // props for our channel
        EmptyStateIndicator={EmptyState}
        // i is the index, we pass the team message
        Message={(messageProps,i) => <MessageTeam key={i} {...messageProps} />}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
