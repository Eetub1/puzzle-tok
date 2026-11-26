import './EvalBar.css'

export default function EvalBar({ evalScore = 0, mateIn = null, orientation = "white" }) {
    // Calculate white advantage percentage (0% to 100%)
    const getWhiteAdvantagePercent = (score, mate) => {
        if (mate !== null && mate !== undefined) {
            return mate > 0 ? 100 : 0
        }
        const clamped = Math.max(-1000, Math.min(1000, score))
        const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * clamped)) - 1)
        return Math.round(winChance)
    }

    const whitePercent = getWhiteAdvantagePercent(evalScore, mateIn)
    const label = mateIn !== null
        ? `M${Math.abs(mateIn)}`
        : (Math.abs(evalScore) / 100).toFixed(1)

    // Flip top/bottom fill direction if the board orientation is black
    const isBlackOriented = orientation === "black"

    return (
        <div className="eval-bar" style={{ flexDirection: isBlackOriented ? "column" : "column-reverse" }}>
            <div className="eval-fill-white" style={{ height: `${whitePercent}%` }} />
            <span className={`eval-label ${whitePercent >= 50 && !isBlackOriented ? "dark-text" : "light-text"}`}>
                {label}
            </span>
        </div>
    )
}