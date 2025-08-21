import { AuthForm } from "../components/auth/signupForm";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Link from "next/link";

export default function SignUpPage() {
  return (
        <main className="relative min-h-screen w-full overflow-hidden">
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <img
                    src="/assets/bg-signup.jpg"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl filter"
                />
                <Card className="w-full max-w-md bg-black/80 backdrop-blur-lg border border-white/10 shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AuthForm />
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
  );
}
