'use server' 
import { signIn } from '@/auth'
import { redirect } from "next/navigation"

export async function authenticate(_currentState, formData) {
  try {
    key = await signIn(formData)
  } catch (error) {
    if (error) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return error.type
      }
    }
    throw error
  }
}