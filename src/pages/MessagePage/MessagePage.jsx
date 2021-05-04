import React from 'react';
import { useState, useRef, useEffect } from "react";
import {Paper, TextField, Button} from "@material-ui/core";
// import { getUsers } from '../../utilities/users-service';
import * as messagesAPI from '../../utilities/messages-api';
import * as usersService from '../../utilities/users-service';
import ConversationList from '../../Components/ConversationList/ConversationList';
import ConversationBox from '../../Components/ConversationBox/ConversationBox';
import useChat from '../../UseChatRoom';
import clsx from "clsx";

import './MessagePage.css';

export default function MessagePage({user, users}) {
	const [activeConversation, setActiveConversation] = useState("");
	// eslint-disable-next-line
	const [messageItems, setMessageItems] = useState([]);
	const [inputBox, setInputBox] = useState("");
	const { messages, sendMessage } = useChat();
	const { owner, setOwner } = useState([]);
	const { guest, setGuest } = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const messageRef = useRef()
	
	const usersRef = useRef([]);

	const handleChange = (e) => {
		setInputBox({
		  ...inputBox,
		  [e.target.name]: e.target.value
		})
	  }

	  const handleSubmit = (e) => {
		e.preventDefault()
		// handleNewMessage(inputBox);
	  }

	async function handleCheckToken() {
		usersService.checkToken();
	}

	const handleNewMessageChange = event => {
		setNewMessage(event.target.value);
	  };
	
	  const handleSendMessage = () => {
		if (newMessage !== "") {
		  sendMessage(newMessage);
		  setNewMessage("");
		}
	  };
	
	  const handleKeyUp = event => {
		if (event.key === "Enter"){
		  if (newMessage !== "") {
			sendMessage(newMessage);
			setNewMessage("");
		  }
		}
	  }

	  useEffect(() => messageRef.current.scrollIntoView({behavior: "smooth"}))


	useEffect(function () {
		async function getMessages() {
		  const messages = await messagesAPI.getAllMessages();
		  usersRef.current = messages.reduce((convos, message) => {
			const convo = message.conversation._id;
			return convos.includes(convo) ? convos : [...convos, convo];
		  }, []);
		  setMessageItems(messages);
		  setActiveConversation(messages[0].conversation._id);
		//   console.log(messages[0].conversation._id);
		}
		getMessages();
	}, []);

	return (
		<main className="MessagePage">

		  <aside>
		  	<button onClick={handleCheckToken}>
				Check When My Login Expires
			</button>
			<h4>Conversations</h4>
			<ConversationList
				users={users}
				activeConversation={activeConversation}
				setActiveConversation={setActiveConversation}
				/>
			</aside>
			
			<form autoComplete='off' onSubmit={handleSubmit}>
						<h2>Messages with {activeConversation}</h2>
						<h4>Last Seen: </h4>
						<ConversationBox
							user={user}
							messageItems={messageItems.filter((message) => message.conversation._id === activeConversation)}
						/>
						<div className="container">
							<Paper elevation={5} className='paper'>
								<div className="messageContainer">
								<ol className="ol">
									{messages.map((message, i) => (
									<li
										key={i}
										className={clsx(message, message.isOwner ? owner : guest)}
									>
										<span>{message.body}</span>
									</li>
									))}
								</ol>
								<div ref={messageRef}></div>
								</div>
								<div className="action">
								<TextField
									className="messageInput"
									id="message"
									label="Message"
									placeholder="enter message here"
									variant="outlined"
									value={newMessage}
									onChange={handleNewMessageChange}
									onKeyUp={handleKeyUp}
								/>
								<Button
									disabled={!newMessage}
									variant="contained"
									color="primary"
									onClick={handleSendMessage}
									className="sendButton"
								>
									Send
								</Button>
								</div>
							</Paper>
							</div>
			</form>
			
    	</main>
	)
};
