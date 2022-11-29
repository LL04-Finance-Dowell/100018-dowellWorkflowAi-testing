import "./style.css";


export const LoadingSpinner = ({ color, width, height }) => {
    const customSpinnerColor = {
        borderTopColor: color ? color : "#61ce70",
    }

    if (width) customSpinnerColor.width = width;
    if (height) customSpinnerColor.height = height;

    return <div id="loading" className="display" style={customSpinnerColor}></div>
}