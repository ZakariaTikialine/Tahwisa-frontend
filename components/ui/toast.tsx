import React from 'react'

interface toast {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: 'default' | 'destructive'
}
// Toast context and hook for managing toasts
const ToastContext = React.createContext<{
    toasts: toast[]
    addToast: (toast: Omit<toast, 'id'>) => void
    removeToast: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<toast[]>([])

    const addToast = React.useCallback((toastData: Omit<toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 11)
        const newToast = { id, ...toastData }
        setToasts(prev => [...prev, newToast])
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 5000)
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Export the toast function that can be used directly
export const toast = (_toastData: Omit<toast, 'id'>) => {
    // This will be overridden by the context when used properly
    console.warn('Toast function called outside of ToastProvider')
}
interface ToastComponentProps {
    toast: toast
    onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastComponentProps) {
    const { id, title, description, action, variant = 'default' } = toast

    const baseClasses = "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"
    const variantClasses = variant === 'destructive' 
        ? "border-red-500 bg-red-50 text-red-900" 
        : "border-gray-200 bg-white text-gray-900"

    return (
        <div className={`${baseClasses} ${variantClasses}`}>
            <div className="grid gap-1">
                {title && (
                    <div className="text-sm font-semibold">
                        {title}
                    </div>
                )}
                {description && (
                    <div className="text-sm opacity-90">
                        {description}
                    </div>
                )}
            </div>
            {action}
            <button
                type="button"
                onClick={() => onDismiss(id)}
                className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
                ×
            </button>
        </div>
    )
}
