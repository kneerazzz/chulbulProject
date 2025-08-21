"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { zodResolver } from '@hookform/resolvers/zod'


const LoginSchema = z.object({
  identifier: z.string().min(1, {
    message: "Username or Email is required.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginAuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {login} = useAuth();

  const router = useRouter()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    try {
      // Simulated login request

      const payload = {
        username: data.identifier.includes("@") ? undefined : data.identifier,
        email: data.identifier.includes("@") ? data.identifier : undefined,
        password: data.password
      };
      const res = await api.post("/users/login", payload);
      const {user, accessToken, refreshToken} = res.data.data

      login(user, accessToken, refreshToken)
      router.push("/dashboard")
      toast.success("Login successful!", {
        description: `Welcome back, ${data.identifier}`,
      });

      form.reset();
    } catch (error: any) {
      toast.error("Login failed", {
        description: `Please check your credentials => ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username or email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
