import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto w-full",
            card: "shadow-none",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
}
