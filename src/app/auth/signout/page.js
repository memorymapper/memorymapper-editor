import { signOut } from "@/auth"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
 
export default async function SignOutPage() {

    const session = await auth()
  
    if (!session) {
        redirect('/auth/login')
    }


  return (
    <div>
      <h5>Are you sure you want to sign out?</h5>
      <form
        action={async (formData) => {
            "use server"
            await signOut()
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  )
}