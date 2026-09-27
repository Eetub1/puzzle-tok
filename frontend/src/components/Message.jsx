const Message = ({ data }) => {
	return (
		<div className="message">
			<p className={data.isError ? "messageError message" : "messageSuccess message"}>{data.message}</p>
		</div>
	)
}

export default Message