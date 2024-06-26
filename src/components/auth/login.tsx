import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosError } from 'axios'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


const loginSchema = z.object({
    email: z.string().min(2).email({
        message: "Invalid email received."
    }),
    password: z.string().min(4, {
        message: "Password must contain at least 6 characters."
    }),
})

export default function Login() {
    const navigate = useNavigate()
    // 1. Define your form.
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        },
    })

    const { mutate: mutateLogin, isPending, isSuccess, data } = useMutation({
        mutationFn: async (values: z.infer<typeof loginSchema>) => {
            const response = await axios.post('https://pokedoro-backend.onrender.com/user/login', values)
            return response.data
        },onError: (err: AxiosError) => {
            if(err.response?.status === 404) {
                toast.error("User not found")
            }
            if(err.response?.status === 401) {
                toast.error("Password does not match.")
            }
          }
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof loginSchema>) {
        mutateLogin(values)
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Logged in with ease!")
            localStorage.setItem("auth", data.token);
            navigate('/user')
        }

     
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])




    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border p-4 rounded-md ">
                <h1 className="text-xl text-center">Log in</h1>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn@gmail.com" {...field} />
                            </FormControl>
                            <FormDescription className="text-[10px]">
                                This is your email
                            </FormDescription>
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
                                <Input placeholder="password123" type="password" {...field} />
                            </FormControl>
                            <FormDescription className="text-[10px]">
                                Choose a password to protect your account.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isPending ?
                    <Button disabled type="submit" className="flex items-center gap-4"><Loader2 className="animate-spin"/>Log in</Button>
                    : <Button type="submit">Log in</Button>
                }
            </form>
        </Form>

    )
}