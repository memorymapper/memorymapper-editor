import Link from "next/link"
import LogOutButton from "@/components/buttons/LogOutButton"
import { redirect } from "next/navigation"

import { auth } from "@/auth" 

async function getUser(userId) {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}users/${userId}`

  try {
    const response = await fetch(url)
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
      }
      const json = await response.json()
      return json
  } catch(error) {
      console.log(error)
  }

}

export default async function Home() {

  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  const user = await getUser(session.user.userId)

  

  return (
    <div className="w-full flex flex-col">
        <h1>MMT Editor</h1>
        <h2>{session.user.name}'s Projects</h2>
        <ul>
        {user?.owned_projects.length ? user.owned_projects.map(project => (<li><Link href={`/projects/${project}`}>{project}</Link></li>)) : null}
        <li><Link href="/projects/new">Add New...</Link></li>
        </ul>
        <p>A project is a collection of maps, content and media items. You can invite others to collaborate on projects with you.</p>
        <LogOutButton username={session.user.name} />
      </div>
  )
}
