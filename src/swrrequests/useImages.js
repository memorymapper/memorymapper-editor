import useSWR from 'swr'
import { fetcher } from './fetcher'

export default function useImages(project) {

    const { data, error, isLoading } = useSWR(`/api/media/${project}/`, fetcher)


    return {
        images: data,
        isLoading,
        isError: error
    }
}