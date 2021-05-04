import "./MessageItem.css";

export default function MessageItem({ messageItem }) {
  return (
  <tbody className="messageItem">
            <tr>
          
                    <td className="name">{messageItem.sender}</td>
                    <td className="timestamp">{messageItem.createdAt}</td>
            </tr>
            <tr>
                    <td></td>
                    <td className="textmessage">{messageItem.message}</td>
            </tr>
        </tbody>

  );
}
