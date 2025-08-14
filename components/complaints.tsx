"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

const schema = z.object({
  name: z.string().max(80).optional(),
  phone: z.string().max(30).optional(),
  message: z
    .string()
    .min(10, { message: "نص الرسالة يجب أن يكون 10 أحرف على الأقل" })
    .max(500, { message: "الحد الأقصى 500 حرف" }),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Complaints() {
  const [submitted, setSubmitted] = React.useState(false);
  const t = useTranslations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", message: "", company: "" },
    mode: "onBlur",
  });

  const msg = form.watch("message") ?? "";
  const remaining = 500 - msg.length;

  const onSubmit = async (values: FormValues) => {
    if (values.company) return;

    try {
      await api.post("/complaints", {
        name: values.name || undefined,
        phone: values.phone || undefined,
        message: values.message,
      });
      toast.success("تم تقديم الشكوى بنجاح");
      setSubmitted(true);
      form.reset({ name: "", phone: "", message: "", company: "" });
    } catch {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (submitted) {
    return (
      <Card className="border bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold">
            {t("complaint_received")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("send_apply_complaint_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            {t("send_new_complaint")}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">
          {t("apply_complaint")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("apply_complaint_subtitle")}
        </CardDescription>
      </CardHeader>
      <Separator />

      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {/* honeypot (hidden) */}
            <input
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              {...form.register("company")}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-1">
                  <FormLabel>{t("apply_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("apply_name_placeholder")}
                      autoComplete="name"
                      inputMode="text"
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
                <FormItem className="sm:col-span-1">
                  <FormLabel>{t("apply_phone")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="0912345678"
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
                <FormItem className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("apply_message")}</FormLabel>
                    <span
                      className={`text-xs ${
                        remaining < 0
                          ? "text-destructive"
                          : remaining <= 30
                          ? "text-amber-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {remaining} {t("chars_remaining")}
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-32 resize-y"
                      placeholder={t("apply_message_placeholder")}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="sm:col-span-2 flex items-center gap-3">
              <Button
                type="submit"
                className="w-36"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("sending")}
                  </span>
                ) : (
                  t("send")
                )}
              </Button>

              {form.formState.isSubmitting && (
                <p className="text-sm text-muted-foreground">
                  {t("dont_close_page")}
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        {t("by_sending_your_message")}
      </CardFooter>
    </Card>
  );
}
