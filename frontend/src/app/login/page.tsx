
import { LoginAuthForm } from "../components/auth/loginForm";
import { Card, CardContent, CardTitle, CardHeader } from "../components/ui/card";
import Link from "next/link";

export default function LoginPage(){
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
                        <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoginAuthForm />
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Don&apos;t have a account?{" "}
                            <Link href="/signup" className="font-medium text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}