const Button = ({
  btnText,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={variant === "primary" ? "btn" : "btn-outline"}
      onClick={onClick}
      disabled={disabled}
    >
      {btnText}
    </button>
  );
};

export default Button;
