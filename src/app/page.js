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
    <div className="w-full flex flex-col m-10">
        <div>
          <h2>{session.user.name}'s Projects</h2>
          <p>A project is a collection of maps, content and media items. You can invite others to collaborate on projects with you.</p>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
        {user?.owned_projects.length ? user.owned_projects.map(project => (
          <>
          <div className="card bg-base-100 shadow-md rounded-sm my-4">
            <div className="card-body">
              <h2 className="card-title">{project}</h2>
              <div className="card-actions justify-end">
              <Link href={`/projects/${project}`}>Edit</Link>
              </div>
            </div>
          </div>
          </>
          )) : null}
          </div>
        
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Add New</h2>
              <div className="card-actions justify-end">
                <Link href="/projects/new">+</Link>
              </div>
            </div>
          </div>
        <LogOutButton username={session.user.name} />
      </div>
  )
}
