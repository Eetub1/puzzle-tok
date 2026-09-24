const Message = ({ message, isError = false}) => {
    return (
        <div className="message">
            <p className={isError ? "messageError message" : "messageSuccess message"}>{message}</p>
        </div>
    )
}

export default Message