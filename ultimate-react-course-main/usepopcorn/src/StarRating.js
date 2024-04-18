import { useState } from "react";

// Styles for the StarRating component's container and stars.
const containerStyle = { display: "flex", alignItems: "center", gap: "16px" };
const starContainerStyle = { display: "flex" };

/**
 * StarRating component to display and interact with a star-based rating system.
 * 
 * @param {Object} props Component props
 * @param {number} props.maxRating Maximum rating value (default: 5)
 * @param {string} props.color Star color (default: "#fcc419")
 * @param {number} props.size Star size (default: 48)
 * @param {string} props.className Additional className for styling (default: "")
 * @param {Array<string>} props.messages Messages to display for each rating value (default: [])
 * @param {number} props.defaultRating Initial rating value (default: 0)
 * @param {Function} props.setMovieRating Function to update external rating state
 * @returns React component
 */
export function StarRating({ maxRating = 5, color = "#fcc419", size = 48, className = "", messages = [], defaultRating = 0, setMovieRating }) {
  // State for the current and temporary (on hover) ratings.
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  // Handles click event to set the rating.
  const handleRating = (ratingValue, i) => { setRating(ratingValue + i); setMovieRating(ratingValue + i); };

  // Determines if a star should be considered 'full'.
  const isFull = (rating, tempRating, i) => tempRating ? (tempRating >= i + 1) : (rating >= i + 1);

  // Handles mouse enter event on a star, setting the temporary rating.
  const handleOnHoverIn = (i) => setTempRating(i + 1);

  // Resets the temporary rating on mouse leave.
  const handleOnHoverOut = () => setTempRating(0);

  // Style for the optional text message displayed below the stars.
  const textStyle = { lineHeight: "1", margin: "0", color, fontSize: `${size / 1.5}px` };

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRateClick={() => { handleRating(1, i); }}
            full={isFull(rating, tempRating, i)}
            handleOnHoverIn={() => { handleOnHoverIn(i); }}
            handleOnHoverOut={handleOnHoverOut}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {
          (messages.length === maxRating) ?
            ((tempRating) ? (messages[tempRating - 1]) : (messages[rating - 1])) :
            (tempRating) || (rating) || ("")
        }
      </p>
    </div>
  );
}

/**
 * Star component for individual stars within the StarRating component.
 * 
 * @param {Object} props Component props
 * @param {Function} props.onRateClick Click handler to set the rating
 * @param {boolean} props.full Determines if the star is full or empty
 * @param {Function} props.handleOnHoverIn Mouse enter handler to show temp rating
 * @param {Function} props.handleOnHoverOut Mouse leave handler to reset temp rating
 * @param {string} props.color Star color
 * @param {number} props.size Star size
 * @returns React component
 */
export function Star({ onRateClick, full, handleOnHoverIn, handleOnHoverOut, color, size }) {
  // Style for individual stars.
  const starStyle = { width: `${size}px`, height: "48px", display: "block", cursor: "pointer" };

  return (
    <span role="button" style={starStyle} onClick={onRateClick} onMouseEnter={handleOnHoverIn} onMouseLeave={handleOnHoverOut}>
      {/* SVG for full or empty star based on 'full' prop. */}
      {full ? (
        // Full star SVG
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} stroke={color}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        // Empty star SVG
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={color}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="{2}" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )}
    </span>
  );
}


/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
