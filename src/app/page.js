import Link from "next/link"
import { cookies } from "next/headers"

export default function Home() {

  const userId = cookies().get('loggedInUserID')
  const userName = cookies().get('loggedInUserName')

  return (
      <div className="w-full flex flex-col">
        <h1>MMT Editor</h1>
        <h2>{userName.value}'s Projects</h2>
        <ul>
          <li><Link href="/projects/new">Add New...</Link></li>
        </ul>
        <p>A project is a collection of maps, content and media items. You can invite others to collaborate on projects with you.</p>
      </div>
  )
}
