"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Library } from "lucide-react";

import { getRegisterImage } from "@/lib/images";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  universityId: z.string().min(1, {
    message: "University ID is required.",
  }),
  universityCard: z.string().optional(),
});

export default function RegisterPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      universityId: "",
      universityCard: "pending_upload",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...values,
        universityId: parseInt(values.universityId),
      };
      
      await api.post("/Auth/register", payload);
      
      const loginResponse = await api.post("/Auth/login", {
        email: values.email,
        password: values.password,
      });
      
      login(loginResponse.data.token, loginResponse.data);
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
        } else if (typeof err.response.data === "object") {
             if (err.response.data.errors) {
                 errorMessage = Object.values(err.response.data.errors).flat().join(", ");
             } else if (err.response.data.title) {
                 errorMessage = err.response.data.title;
             }
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative overflow-hidden order-last">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-secondary/20 z-10" />
        <Image
          src={getRegisterImage()}
          alt="Library Books"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
        <div className="absolute bottom-10 right-10 z-20 max-w-md text-right">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
            >
                "Knowledge is free at the library. Just bring your own container."
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-lg"
            >
                Join our community of scholars and dreamers.
            </motion.p>
        </div>
      </div>

      <div className="flex items-center justify-center py-12 bg-background">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto grid w-[350px] gap-6"
        >
          <div className="grid gap-2 text-center">
            <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-secondary/10">
                    <Library className="h-8 w-8 text-secondary" />
                </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to get started
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-muted/50 border-border/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} className="bg-muted/50 border-border/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="universityId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>University ID</FormLabel>
                        <FormControl>
                        <Input placeholder="123456" {...field} className="bg-muted/50 border-border/50" />
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
                        <Input type="password" {...field} className="bg-muted/50 border-border/50" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              
              {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-destructive text-center font-medium"
                >
                    {error}
                </motion.div>
              )}

              <Button type="submit" className="w-full font-semibold shadow-lg shadow-secondary/20" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline text-secondary hover:text-secondary/80">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
