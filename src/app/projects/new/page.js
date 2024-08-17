import { cookies } from 'next/headers'
import ProjectConfigurator from '@/components/projects/ProjectConfigurator'

export default function Page() {

    const userToken = cookies().get('userToken').value
    const loggedInUserID = cookies().get('loggedInUserID').value

    return (
        <ProjectConfigurator userToken={userToken} userID={loggedInUserID} />
    )
}