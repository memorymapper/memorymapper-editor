import { signIn } from "@/auth"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
 
export async function SignIn() {

    const session = await auth()

    if (session) {
        redirect("/")
    }

  return (
    <form
      action={async (formData) => {
        "use server"
        const user = await signIn("credentials", formData)
      }}
    >
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}