import { cookies } from "next/headers"
import Link from "next/link"

async function getUser(userId, token) {
    // Needs to move somewhere more sensible...
    const url = `http://192.168.79.2:8000/api/1.0/users/${userId.value}`
    const response = await fetch(url, {
        credentials: 'include',
        method: 'GET',
        cache: 'no-store',
        headers: {
            "Authorization": `Token ${token.value}`,
            "loggedInUserID": userId.value,
            "cookie": `loggedInUserID=${userId.value}`
        }
    })
    const json = response.json()
    return json
}


export default async function Page() {
    const userId = cookies().get('loggedInUserID')
    const userName = cookies().get('loggedInUserName')
    const userToken = cookies().get('userToken')

    const userData = await getUser(userId, userToken)
    console.log(userData)

    return (
        <div className="flex w-full">
                <h1>MMT Editor</h1>
                <h2>{userName.value}'s Entries</h2>
                <ul>
                    {userData.documents 
                        ? userData.documents.map((e) => <li key={e}><Link href={`/entries/${e}/edit`}>{e}</Link></li>)
                        : null
                    }
                </ul>
        </div>
    )
}