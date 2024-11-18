import useSWR from 'swr'
import { fetcher } from './fetcher'

export default function useFeature(queryParams) {

    const { data, error, isLoading } = useSWR(`/api/feature/point/${queryParams}`, fetcher)
   
    return {
        feature: data,
        isLoading,
        isError: error
    }
}