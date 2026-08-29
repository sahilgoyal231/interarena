import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return <SignUp routing="hash" fallbackRedirectUrl="/home" forceRedirectUrl="/home" />
}