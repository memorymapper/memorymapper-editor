/*import { authenticate } from '@/app/lib/actions'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
*/

import { SignIn} from "@/components/auth/SignIn"

export default function Page() {
    return (
        <SignIn />
    )
}

/*
function LoginButton(props) {
    const status = useFormStatus()
    const router = useRouter()
   
    const handleClick = async (event) => {

        console.log(status)

        // router.push('/')
    }
   
    return (
        <button aria-disabled={status.pending} type="submit" 
        onClick={handleClick}
        className='rounded-md bg-stone-50 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        >
            Login
        </button>
    )
}


export default function Page() {

    const [formState, dispatch] = useFormState(authenticate, undefined)

    return (
        <div>
            <form action={dispatch}>
                <div className='flex flex-col space-y-1'>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="User Name" 
                    required 
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'

                />
                <input 
                    type="password" 
                    name="password" placeholder="Password" 
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                <LoginButton />
                </div>
            </form>
        </div>
    )
}
*/