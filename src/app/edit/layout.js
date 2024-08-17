'use client'

export default function Layout({children}) {
    return (
        <div className="mx-auto w-full flex sm:px-6 lg:px-2 sm:py-6 lg:py-10">
            {children}
        </div>
    )
}