import useSWR from 'swr'
import { fetcher } from './fetcher'

export default function useDocument(id) {

    const { data, error, isLoading } = useSWR(`/api/entry/${id}/`, fetcher)
   
    return {
        document: data,
        isLoading,
        isError: error
    }
  }