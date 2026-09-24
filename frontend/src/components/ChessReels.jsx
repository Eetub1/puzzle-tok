import "./ChessReels.css";
import Dropdown from "react-bootstrap/Dropdown";

export default function ChessReels() {
  return (
    <div className="chess-reels">
      {/* Yläpalkki */}
      <div className="top-bar">
        <Dropdown.Menu show>
            <Dropdown.Item>Your Matches</Dropdown.Item>
            <Dropdown.Item>Puzzles</Dropdown.Item>
            <Dropdown.Item>Openings</Dropdown.Item>
        </Dropdown.Menu>
        <button className="profile-btn" aria-label="Profile">👤</button>
      </div>

       {/* Scrolli */}
       <div className="content-row">
          <div className="scroll-controls">
            <button aria-label="Previous puzzle">▲</button>
            <button aria-label="Next puzzle">▼</button>
          </div>
      </div>

        { /* Alajutskat */}
      <div className="bottom-bar">
          <div className="action-buttons">
            <button className="hint-btn">Hint</button>
            <button className="solution-btn">Solution</button>
      </div>

        <div className="step-controls">
          <button aria-label="Previous move">◀</button>
          <button aria-label="Next move">▶</button>
        </div>
      </div>
    </div>
  );
}