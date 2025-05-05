import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full",
            card: "shadow-none",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
