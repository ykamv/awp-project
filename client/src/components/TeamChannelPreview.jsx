import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => {

    // this is called a hook, gets channel and client info from getstream.io, also we are renaming channel to activeChannel
    const { channel: activeChannel, client } = useChatContext();

    const ChannelPreview = () => (
        <p className="channel-preview__item">
            {/* ? checks if we have the channel or the data before accessing the name */}

            # {channel?.data?.name || channel?.data?.id}
        </p>
    );


    const DirectPreview = () => {
        // we use object.values to get the value pair from channel.state.members, it is of the type {'id':{}}. Then we use a filter method, we use a callback function inside it. We check if the user.id is not the same as the client.userid
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
    
        console.log(members[0]);

        return (
            <div className="channel-preview__item single">
               <Avatar 
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
            </div>
        )
    }

    return (
        <div className={
            channel?.id === activeChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
        onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
            setActiveChannel(channel);
            if(setToggleContainer) {
                setToggleContainer((prevState) => !prevState)
            }
        }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    );
}

export default TeamChannelPreview
