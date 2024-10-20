import { cookies } from 'next/headers'
import ProjectConfigurator from '@/components/projects/ProjectConfigurator'
import { auth } from '@/auth'

export default async function Page() {

    const session = await auth()

    if (!session) {
        redirect('/auth/login')
    }

    const accessToken = session.user.accessToken
    const userId = session.user.userId

    return (
        <ProjectConfigurator userToken={accessToken} userId={userId} />
    )
}