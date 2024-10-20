'use client'
import Link from "next/link"

export default function LogOutButton(props) {

    return (
        <Link href="/auth/signout" className="className='rounded-md bg-stone-50 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Sign Out</Link>
    )
}