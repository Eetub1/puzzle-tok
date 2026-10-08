import jwt from "jsonwebtoken"

// Helper to check that the request has a valid JWT token in the Authorization header
export const authenticateToken = (req, res, next) => {
    const header = req.get("Authorization") ?? ""
    const [scheme, token] = header.split(" ")

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) // Verify the integrity of the token
        req.user = { id: payload.sub, username: payload.username } // Get user info from the token
        return next()
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}