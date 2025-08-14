import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
          <RedirectToSignIn />
        </div>
      </SignedOut>
    </>
  )
}

export default ProtectedRoute
