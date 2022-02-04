import React , { useState, useEffect } from 'react';
import { getChannel, useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from './'
import { SearchIcon } from '../assets';

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();

    // We are creating states for the components
    const [query, setQuery] = useState('');

    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])
    

    useEffect(() => {
        if(!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query])

    // we use an async function because we have to wait for our query to be fetched first
    const getChannels =async (text) => {
        try {
            const channelResponse = client.queryChannels({
                type: 'team', 
                name: { $autocomplete: text }, 
                members: { $in: [client.userID]}
            });
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }
            })

            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

            if(channels.length) setTeamChannels(channels);
            if(users.length) setDirectChannels(users);
        } catch (error) {
            setQuery('')
        }
    }
    // To prevent reload of the page after submission
    const onSearch = (event) =>{
        event.preventDefault();

        // on search our loading will be set to true
        setLoading(true);
        // what are we searching for?
        setQuery(event.target.value);
        // after search we get our channel
        getChannels(event.target.value);
    }
    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }
    

  return (
  <div className='channel-search__container'>
      <div className='channel-search__input__wrapper'>
          <div className='channel-search__input__icon'>
              <SearchIcon />
          </div>
          <input className='channel-search__input__text' type="text" placeholder='Search' value={query} onChange={onSearch}/>
      </div>
      { query && (
                <ResultsDropdown 
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
    
  </div>
  );
};

export default ChannelSearch;
