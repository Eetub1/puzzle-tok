import { useEffect, useState } from "react"
import { getComments, postComment, deleteComment } from "../services/userService.js"
import "./Comments.css"

const MAX_LENGTH = 200

// Comment section for one puzzle
const Comments = ({ puzzleId }) => {
	const [comments, setComments] = useState([])
	const [text, setText] = useState("")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Load the comments whenever the puzzle changes
	useEffect(() => {
		if (!puzzleId) return
		let cancelled = false
		setLoading(true)
		getComments(puzzleId)
			.then(data => {
				if (!cancelled) {
					setComments(data)
					setError(null)
				}
			})
			.catch(err => {
				if (!cancelled) setError(err.message)
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [puzzleId])

	async function handleSubmit(event) {
		event.preventDefault()
		const body = text.trim()
		if (!body) return
		try {
			const newComment = await postComment(puzzleId, body)
			setComments(prev => [newComment, ...prev]) // newest first (I'm not cooking up an algorithm system)
			setText("")
			setError(null)
		} catch (err) {
			setError(err.message)
		}
	}

	async function handleDelete(commentId) {
		try {
			await deleteComment(commentId)
			setComments(prev => prev.filter(comment => comment.id !== commentId))
			setError(null)
		} catch (err) {
			setError(err.message)
		}
	}

	if (!puzzleId) return <p className="comments-empty">Comments unavailable for this puzzle.</p>

	return (
		<div className="comments">
			<h3 className="comments-title">Comments ({comments.length})</h3>

			<form className="comments-form" onSubmit={handleSubmit}>
				<input
					type="text"
					value={text}
					onChange={event => setText(event.target.value)}
					maxLength={MAX_LENGTH}
					placeholder="Write a comment..."
				/>
				<button type="submit" disabled={!text.trim()}>Post</button>
			</form>

			{error && <p className="comments-error">{error}</p>}

			{loading ? (
				<p className="comments-empty">Loading comments...</p>
			) : comments.length === 0 ? (
				<p className="comments-empty">No comments yet. Be the first!</p>
			) : (
				<ul className="comments-list">
					{comments.map(comment => (
						<li key={comment.id} className="comment">
							<div className="comment-header">
								<span className="comment-author">{comment.username}</span>
								<span className="comment-date">
									{new Date(comment.createdAt).toLocaleDateString("fi-FI")}
								</span>
								{comment.own && (
									<button
										type="button"
										className="comment-delete"
										onClick={() => handleDelete(comment.id)}
										aria-label="Delete comment"
									>
										✕
									</button>
								)}
							</div>
							<p className="comment-body">{comment.body}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Comments