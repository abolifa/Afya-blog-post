"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const formSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  message: z
    .string()
    .min(10, {
      message: "نص الرسالة يجب أن يكون 10 أحرف على الأقل",
    })
    .max(500),
});

const complaints = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await api.post("/complaints", {
        name: values.name,
        phone: values.phone,
        message: values.message,
      });
      toast.success("تم تقديم الشكوى بنجاح");
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full p-10 bg-muted border shadow-md flex flex-col gap-5">
      <h1 className="text-xl font-bold">تقديم شكوى</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الإسم</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-background"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-background"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نص الرسالة</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="bg-background"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-32" disabled={loading}>
            <span>
              {loading ? <Loader className="animate-spin" /> : "تقديم"}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default complaints;
