import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

import { verifyEmail } from "../services/authService"

const VerifyEmail = () => {
	const [searchParams] = useSearchParams()
	const token = searchParams.get("token")

	const [status, setStatus] = useState(token ? "loading" : "error")
	const [message, setMessage] = useState(token ? "Verifying your email address..." : "The verification link is missing or broken.",)

	// StrictMode runs effects twice in development but the token can only be used once
	// So need to keep track if the request has already been sent
	const requestSent = useRef(false)

	useEffect(() => {
		if (!token || requestSent.current) {
			return
		}
		requestSent.current = true

		verifyEmail(token)
			.then(data => {
				setStatus("success")
				setMessage(data.message)
			})
			.catch(error => {
				setStatus("error")
				setMessage(error.message)
			})
	}, [token])

	return (
		<div className="testDiv">
			<p>{message}</p>
			{status !== "loading" && <Link to="/">Continue to PuzzleTok</Link>}
		</div>
	)
}

export default VerifyEmail