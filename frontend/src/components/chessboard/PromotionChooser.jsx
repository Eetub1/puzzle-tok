import { defaultPieces } from 'react-chessboard'

// PromotionChooser component, renders promotion piece selection buttons
export function PromotionChooser({ pendingPromotion, onSelect, playerColor }) {
	if (!pendingPromotion) {
		return null
	}


	const promotionPosition = playerColor === 'b' ? {
			left: `${(7 - (pendingPromotion.to.charCodeAt(0) - 'a'.charCodeAt(0))) * 12.5}%`,
			top: `${(Number(pendingPromotion.to[1])- 1) * 12.5}%`,
		}
		: {
			left: `${(pendingPromotion.to.charCodeAt(0) - 'a'.charCodeAt(0)) * 12.5}%`,
			top: `${(8 - Number(pendingPromotion.to[1])) * 12.5}%`,
		}

	return (
		<div className="promotion-picker" style={promotionPosition}>
			{['q', 'r', 'b', 'n'].map((piece) => (
				<button key={piece} onClick={() => onSelect(piece)}>
					{defaultPieces[`${pendingPromotion.color}${piece.toUpperCase()}`]()}
				</button>
			))}
		</div>
	)
}
