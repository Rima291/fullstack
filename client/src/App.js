import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';

import { ChannelListContainer, ChannelContainer, Auth } from './components';
import 'stream-chat-react/dist/css/index.css';
import './App.css';

const cookies = new Cookies();

const apiKey = '5bh6kdddt28y';
const authToken = cookies.get('token');

const client = StreamChat.getInstance(apiKey);

if(authToken) {
    client.connectUser({
       id: cookies.get('userId'),  
        name: cookies.get('name'),
        email: cookies.get('email'),
        image: cookies.get('picture'),
        hashedPassword: cookies.get('hashedPassword'),
        phone: cookies.get('phone'),
        address: cookies.get('address'),
        domaine: cookies.get('domaine'),
    }, authToken)
}

const App = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [createType, setCreateType] = useState('');
    const [isEditing, setIsEditing] = useState(false);

   

    if (!authToken) return <Auth />; // Si pas authentifié, renvoi à l'authentification

    return (
        <Router>
            <div className="app__wrapper">
                <Chat client={client} theme="team light">
                    <Routes>
                        
                        <Route 
                            path="/messages" 
                            element={
                                <>
                                    <ChannelListContainer 
                                        isCreating={isCreating}
                                        setIsCreating={setIsCreating}
                                        setCreateType={setCreateType}
                                        setIsEditing={setIsEditing}
                                    />
                                    <ChannelContainer 
                                        isCreating={isCreating}
                                        setIsCreating={setIsCreating}
                                        isEditing={isEditing}
                                        setIsEditing={setIsEditing}
                                        createType={createType}
                                    />
                                </>
                            } 
                        />
                    </Routes>
                </Chat>
            </div>
        </Router>
    );
};

export default App;
