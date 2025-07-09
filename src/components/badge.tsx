interface BadgeProps {
  varient?: "default" | "secondary" | "outline";
  className?: string;
  children: React.ReactNode;
}

function Badge({ varient = "default", className = "", children }: BadgeProps) {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantclasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span className={`${baseClasses} ${variantclasses[varient]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
