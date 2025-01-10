import "@/app/styles/index.css";

const Shape = ({ shape, color, onClick }) => {
  if (shape === "circle") {
    return (
      <div
        style={{
          backgroundColor: color,
          width: "75px",
          height: "75px",
          borderRadius: "50%",
        }}
        onClick={onClick}
      ></div>
    );
  }

  if (shape === "square") {
    return (
      <div
        style={{
          backgroundColor: color,
          width: "75px",
          height: "75px",
        }}
        onClick={onClick}
      ></div>
    );
  }

  if (shape === "triangle") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "40px solid transparent",
          borderRight: "40px solid transparent",
          borderBottom: `75px solid ${color}`,
        }}
        onClick={onClick}
      ></div>
    );
  }

  if (shape === "rectangle") {
    return (
      <div
        style={{
          backgroundColor: color,
          width: "120px",
          height: "60px",
        }}
        onClick={onClick}
      ></div>
    );
  }

  return null;
};

export default Shape;
