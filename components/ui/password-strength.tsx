import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length > 6) score += 1;
        if (pass.length > 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const strength = getStrength(password);

    const getStrengthText = (score: number) => {
        if (score === 0) return "Enter password";
        if (score <= 2) return "Weak";
        if (score <= 3) return "Medium";
        if (score <= 4) return "Strong";
        return "Very Strong";
    };

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-gray-200";
        if (score <= 2) return "bg-red-500";
        if (score <= 3) return "bg-yellow-500";
        if (score <= 4) return "bg-green-500";
        return "bg-emerald-600";
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">{getStrengthText(strength)}</span>
            </div>
            <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={cn(
                            "h-full w-full rounded-full transition-all duration-300",
                            strength >= level ? getStrengthColor(strength) : "bg-gray-100"
                        )}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                Must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number and 1 special character.
            </p>
        </div>
    );
}
