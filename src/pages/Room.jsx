import React, { useEffect, useState, useRef } from "react";
import client, { databases } from "../appwriteConfig";
import { appwriteDatabaseId, appwriteCollectionIdMessages } from "../conf/conf";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2, Send } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
	const { user } = useAuth();

	const [messages, setMessages] = useState([]);
	const [messageBody, setMessageBody] = useState("");

	const sendButtonRef = useRef();

  // adding this useEffect so that the messages are scrolled to the bottom when a new message is added
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  


	useEffect(() => {
		getMessages();

		const unsubscribe = client.subscribe(
			`databases.${appwriteDatabaseId}.collections.${appwriteCollectionIdMessages}.documents`,
			(response) => {
				if (
					response.events.includes(
						"databases.*.collections.*.documents.*.create"
					)
				) {
					console.log("A MESSAGE WAS CREATED ");
					setMessages((prevState) => [
						...prevState,
						response.payload,
					]);
				}

				// TODO NOTE : the delete fucntionality is working but all messages get removed from the screen this most probably is due to how the message queries is being shown on the screen
				// making the order descending might fix the problem
				if (
					response.events.includes(
						"databases.*.collections.*.documents.*.delete"
					)
				) {
					console.log("A MESSAGE WAS DELETED !!!");
					setMessages((prevMessages) =>
						prevMessages.filter(
							(message) => message.$id !== response.payload.$id
						)
					);
				}
			}
		);
		// creating a cleanup function to unsubscribe from the event listener so that messages do not get duplicated when the component is re-rendered
		return () => {
			unsubscribe();
		};
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		let payload = {
			user_id: user.$id,
			username: user.name,
			body: messageBody,
		};

		// document level permissions // to allow only the user who created the message to delete it
		// we have already provided the collection level create and read permissions in the appwrite console for all the users
		let permissions = [Permission.write(Role.user(user.$id))];

		let response = await databases.createDocument(
			appwriteDatabaseId,
			appwriteCollectionIdMessages,
			ID.unique(),
			payload,
			permissions
		);
		console.log("Created! ", response);

		/* remove this line and add to useEffect to add realtime fucntionality 		
    setMessages((prevState) => [response, ...prevState]);
    */
		setMessageBody("");
	};

	const getMessages = async () => {
		const response = await databases.listDocuments(
			appwriteDatabaseId,
			appwriteCollectionIdMessages,
			[], // filters
			0, // offset
			10, // limit
			"$createdAt", // orderField
			"DESC" // orderType

			/* TODO: 
      
      Query.limit is not working  
          add way to sort the queries indescending order based on the timestamp
      [
        Query.orderDesc("$createdAt")
        Query.limit(10),
      ] */
		);
		console.log("Response: ", response);
		setMessages(response.documents);
	};

	const deleteMessage = async (messageId) => {
		databases.deleteDocument(
			appwriteDatabaseId,
			appwriteCollectionIdMessages,
			messageId
		);
		/*  removing this method from here and add to useEffect to add realtime fucntionality 
    setMessages((prevState) =>
			messages.filter((message) => message.$id !== messageId)
		); */
	};

	return (
		<main className=" container">
			<Header />
			<div className="room--container">
				<div>
					<div>
						{messages.map((message) => (
							<div
								key={message.$id}
								className={`message--wrapper ${
									message.user_id === user.$id
										? "my-message"
										: ""
								}`}>
								<div className="message--header">
									<p>
										{message?.username ? (
											<span>{message.username}</span>
										) : (
											<span>Anonymous User</span>
										)}

										<small className="message-timestamp">
											{new Date(
												message.$createdAt
											).toLocaleString([], {
												year: "numeric",
												month: "2-digit",
												day: "2-digit",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</small>
									</p>

									{message.$permissions.includes(
										`delete(\"user:${user.$id}\")`
									) && (
										<Trash2
											className="delete--btn"
											onClick={() => {
												deleteMessage(message.$id);
											}}
										/>
									)}
								</div>
								<div className="message--body">
									<span>{message.body}</span>
								</div>
							</div>
						))}
            <div ref={messagesEndRef} />
					</div>
				</div>

				<form onSubmit={handleSubmit} id="message--form">
					<div>
						<textarea
              style={{resize: "none"}}
							required
							maxLength="1000"
							placeholder="Type something..."
							onChange={(e) => {
								setMessageBody(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									sendButtonRef.current.click();
								}
							}}
							value={messageBody}></textarea>
					</div>

					<div className="send-btn--wrapper">
            
						<button
							ref={sendButtonRef}
							type="submit"
							value="Send"
							className="btn btn--secondary"
						><Send/></button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default Room;
