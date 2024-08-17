import { auth } from "@/auth"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session.user) return null

  return (
    <div className="w-4">
      <img src={session.user.image} alt="User Avatar" />
      <p>{session.user.name}</p>
    </div>
  )
}