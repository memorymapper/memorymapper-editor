import useSWR from 'swr'
import { fetcher } from './fetcher'

export default function useFeatures(queryParams) {

    const { data, error, isLoading } = useSWR(`/api/feature/point/list/${queryParams}`, fetcher)
   
    return {
        features: data,
        isLoading,
        isError: error
    }
}