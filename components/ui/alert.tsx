import React from 'react'

interface AlertProps {
    variant?: 'default' | 'destructive' | 'success' | 'warning'
    className?: string
    children: React.ReactNode
}

interface AlertDescriptionProps {
    className?: string
    children: React.ReactNode
}

interface AlertTitleProps {
    className?: string
    children: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ variant = 'default', className = '', children, ...props }, ref) => {
        const baseStyles = 'relative w-full rounded-lg border p-4'
        const variantStyles = {
            default: 'bg-background text-foreground',
            destructive: 'border-red-500/50 text-red-600 bg-red-50',
            success: 'border-green-500/50 text-green-600 bg-green-50',
            warning: 'border-yellow-500/50 text-yellow-600 bg-yellow-50'
        }

        return (
            <div
                ref={ref}
                role="alert"
                className={`${baseStyles} ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Alert.displayName = 'Alert'

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`text-sm [&_p]:leading-relaxed ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)
AlertDescription.displayName = 'AlertDescription'

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <h5
                ref={ref}
                className={`mb-1 font-medium leading-none tracking-tight ${className}`}
                {...props}
            >
                {children}
            </h5>
        )
    }
)
AlertTitle.displayName = 'AlertTitle'

export { Alert, AlertDescription, AlertTitle }