import { type PieImageType, type CrustImageType } from "@shared/schema";

interface RecipeIconProps {
  type: "pie" | "crust";
  imageType: string;
  className?: string;
}

export default function RecipeIcon({ type, imageType, className = "" }: RecipeIconProps) {
  const renderPieIcon = (variant: PieImageType) => {
    const baseStyles = "w-full h-full";

    const icons = {
      "berry-red": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base crust */}
          <rect x="8" y="16" width="48" height="32" fill="#e5c6a0" />
          {/* Red filling */}
          <rect x="12" y="20" width="40" height="24" fill="#e63946" />
          {/* Berry details */}
          <circle cx="24" cy="28" r="3" fill="#d62828" />
          <circle cx="40" cy="28" r="3" fill="#d62828" />
          <circle cx="32" cy="36" r="3" fill="#d62828" />
        </svg>
      ),
      "berry-blue": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base crust */}
          <rect x="8" y="16" width="48" height="32" fill="#e5c6a0" />
          {/* Blue filling */}
          <rect x="12" y="20" width="40" height="24" fill="#457b9d" />
          {/* Berry details */}
          <circle cx="24" cy="28" r="3" fill="#1d3557" />
          <circle cx="40" cy="28" r="3" fill="#1d3557" />
          <circle cx="32" cy="36" r="3" fill="#1d3557" />
        </svg>
      ),
      "chocolate": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base crust */}
          <rect x="8" y="16" width="48" height="32" fill="#e5c6a0" />
          {/* Chocolate filling */}
          <rect x="12" y="20" width="40" height="24" fill="#6f4e37" />
          {/* Swirl pattern */}
          <path d="M20,32 Q32,24 44,32" stroke="#8b5e3c" strokeWidth="3" fill="none" />
        </svg>
      ),
      "lattice": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base crust */}
          <rect x="8" y="16" width="48" height="32" fill="#e5c6a0" />
          {/* Base filling */}
          <rect x="12" y="20" width="40" height="24" fill="#e63946" />
          {/* Lattice pattern */}
          <path d="M16,28 H48 M16,36 H48" stroke="#e5c6a0" strokeWidth="3" />
          <path d="M24,24 V44 M40,24 V44" stroke="#e5c6a0" strokeWidth="3" />
        </svg>
      ),
      "cheesecake": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Graham crust */}
          <rect x="8" y="16" width="48" height="32" fill="#774936" />
          {/* Filling */}
          <rect x="12" y="20" width="40" height="24" fill="#fefae0" />
          {/* Top texture */}
          <rect x="12" y="20" width="40" height="4" fill="#faedcd" />
        </svg>
      ),
    };

    return icons[variant as PieImageType] || icons["berry-red"];
  };

  const renderCrustIcon = (variant: CrustImageType) => {
    const baseStyles = "w-full h-full";

    const icons = {
      "classic": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base crust */}
          <rect x="8" y="16" width="48" height="32" fill="#e5c6a0" />
          {/* Texture pattern */}
          <path d="M12,28 H52 M12,36 H52" stroke="#d4a373" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      ),
      "graham": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base */}
          <rect x="8" y="16" width="48" height="32" fill="#774936" />
          {/* Texture */}
          <rect x="12" y="20" width="40" height="24" fill="#9c6644" />
          {/* Crumb pattern */}
          <path d="M12,28 H52 M12,36 H52" stroke="#774936" strokeWidth="2" />
        </svg>
      ),
      "cookie": (
        <svg viewBox="0 0 64 64" className={baseStyles}>
          {/* Base */}
          <rect x="8" y="16" width="48" height="32" fill="#c4a484" />
          {/* Texture */}
          <rect x="12" y="20" width="40" height="24" fill="#deb887" />
          {/* Cookie crumb pattern */}
          <g fill="#c4a484">
            <circle cx="20" cy="28" r="2" />
            <circle cx="32" cy="28" r="2" />
            <circle cx="44" cy="28" r="2" />
            <circle cx="26" cy="36" r="2" />
            <circle cx="38" cy="36" r="2" />
          </g>
          {/* Chocolate chip details */}
          <g fill="#4a2700">
            <circle cx="24" cy="32" r="1.5" />
            <circle cx="36" cy="32" r="1.5" />
            <circle cx="30" cy="26" r="1.5" />
          </g>
        </svg>
      ),
    };

    return icons[variant as CrustImageType] || icons["classic"];
  };

  return (
    <div className={`aspect-square ${className}`}>
      {type === "pie" ? renderPieIcon(imageType as PieImageType) : renderCrustIcon(imageType as CrustImageType)}
    </div>
  );
}