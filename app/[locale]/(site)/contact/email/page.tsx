"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Copy,
  Check,
  Clock,
  MapPin,
  PhoneCall,
  Mail,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PhoneContact } from "@/lib/types";
import { PropagateLoader } from "react-spinners";
import ErrorComponent from "@/components/error-component";

function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span className="sr-only">نسخ</span>
    </Button>
  );
}

export default function ContactEmailPage() {
  const locale = useLocale();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["email"],
    queryFn: async () => {
      const res = await api.get("/contact/email");
      return res.data as PhoneContact[];
    },
  });

  return (
    <div
      className="space-y-5"
      itemScope
      itemType="https://schema.org/ContactPage"
    >
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-1">
        <Link href="/">الرئيسية</Link>
        <span className="mx-1">/</span>
        <Link href={`/${locale}/contact/email`}>اتصل بنا (بريد إلكتروني)</Link>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">التواصل عبر البريد الإلكتروني</h1>
        {data && <Badge variant="secondary">{data.length} بريد إلكتروني</Badge>}
      </div>

      <Separator />

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <PropagateLoader color="#4A5568" size={15} />
        </div>
      )}

      {/* Error state */}
      {isError && <ErrorComponent error={error} />}

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((contact) => (
          <Card key={contact.id} className="border bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  <Mail className="w-5 h-5" />
                </span>
                {contact.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.value.map((emailAddress, idx) => (
                <div
                  key={`${contact.id}-${idx}`}
                  className="flex items-center justify-between gap-2"
                >
                  <a
                    href={`mailto:${emailAddress}`}
                    className="font-bold tracking-wide hover:underline"
                  >
                    {emailAddress}
                  </a>
                  <div className="flex items-center gap-2">
                    <CopyButton value={emailAddress} />
                    <Button asChild size="sm">
                      <a
                        href={`mailto:${emailAddress}`}
                        aria-label={`اتصال بـ ${emailAddress}`}
                      >
                        <Mail className="w-4 h-4 me-1" />
                        إرسال
                      </a>
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{contact.time_period ?? "أوقات الدوام الرسمية"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{contact.zone ?? "خدمة على مستوى ليبيا"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SEO JSON-LD */}
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "الهيئة الوطنية لأمراض الكلى",
              contactPoint: data.flatMap((contact) =>
                contact.value.map((phoneNumber) => ({
                  "@type": "ContactPoint",
                  telephone: phoneNumber,
                  contactType: "customer support",
                  areaServed: "LY",
                  availableLanguage: ["ar"],
                }))
              ),
            }),
          }}
        />
      )}
    </div>
  );
}
