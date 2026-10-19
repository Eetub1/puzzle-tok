import "./Message.css"

const Message = ({ data }) => {
	return (
		<div className={data.isError ? "message messageError" : "message messageSuccess"}>
			<p className="messageText">{data.message}</p>
		</div>
	)
}

export default Message