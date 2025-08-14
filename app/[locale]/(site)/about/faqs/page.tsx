"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { PropagateLoader } from "react-spinners";

import ErrorComponent from "@/components/error-component";
import { api } from "@/lib/api";
import { FaqsItem, FaqsResponse } from "@/lib/types";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { HelpCircle, Search, Link as LinkIcon, RefreshCw } from "lucide-react";

/** Helpers */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="bg-amber-200/60 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function slugify(input: string) {
  return (
    input
      .trim()
      .toLowerCase()
      // keep letters (incl. Arabic) & digits, replace spaces with dashes
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}\-]+/gu, "")
  );
}

export default function FaqsPage() {
  const locale = useLocale();
  const [q, setQ] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => (await api.get("/faqs")).data as FaqsResponse,
    retry: 1,
    staleTime: 60_000,
  });

  const list = React.useMemo<FaqsItem[]>(() => {
    const rows = data?.faqs ?? [];
    if (!q) return rows;
    const t = q.trim().toLowerCase();
    return rows.filter(
      (f) =>
        f.faq_question.toLowerCase().includes(t) ||
        f.faq_answer.toLowerCase().includes(t)
    );
  }, [data?.faqs, q]);

  const jsonLd = React.useMemo(() => {
    if (!data?.faqs?.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (data.faqs || []).map((f) => ({
        "@type": "Question",
        name: f.faq_question,
        acceptedAnswer: { "@type": "Answer", text: f.faq_answer },
      })),
    };
  }, [data?.faqs]);

  const copyLink = (slug: string) => {
    try {
      const url = new URL(window.location.href);
      url.hash = slug;
      navigator.clipboard?.writeText(url.toString());
      setCopied(slug);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="space-y-5" itemScope itemType="https://schema.org/FAQPage">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-1">
        <Link href="/">الرئيسية</Link>
        <span className="mx-1">/</span>
        <Link href={`/${locale}/about/faqs`}>الأسئلة الشائعة</Link>
      </nav>

      {/* Loading / Error */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <PropagateLoader
            color="#4A5568"
            loading
            size={15}
            aria-label="Loading Spinner"
          />
        </div>
      ) : isError ? (
        <ErrorComponent error={error} />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {data?.faqs_title ?? "الأسئلة الشائعة"}
              </h1>
              {data?.faqs_description && (
                <div
                  className="text-muted-foreground mt-1"
                  dangerouslySetInnerHTML={{ __html: data.faqs_description }}
                />
              )}
            </div>

            {/* Count */}
            <Badge variant="secondary" className="h-8">
              {(data?.faqs?.length ?? 0).toLocaleString("ar")} سؤال
            </Badge>
          </div>

          <Separator />

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-[420px]">
              <Search className="absolute top-2.5 end-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="ابحث في الأسئلة (كلمات مفتاحية)…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pe-9"
              />
            </div>
            {q && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQ("")}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                مسح البحث
              </Button>
            )}
          </div>

          {/* Results */}
          {!list.length ? (
            <div className="rounded-lg border bg-card p-6 text-muted-foreground">
              لا توجد نتائج مطابقة لبحثك. جرّب كلمات أقصر أو مختلفة.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {list.map((faq, idx) => {
                const slug = slugify(faq.faq_question);
                const key = faq.id ? `faq-${faq.id}` : `${slug}-${idx}`;
                return (
                  <AccordionItem
                    key={key}
                    value={key}
                    id={slug}
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                  >
                    <AccordionTrigger className="text-right">
                      <div className="flex items-start gap-2 w-full">
                        <span className="p-2 rounded-lg bg-teal-100 text-teal-700">
                          <HelpCircle className="w-5 h-5" />
                        </span>
                        <h3
                          className="text-base font-semibold flex-1"
                          itemProp="name"
                        >
                          {highlight(faq.faq_question, q)}
                        </h3>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLink(slug);
                          }}
                          className="ms-2 text-muted-foreground hover:text-foreground"
                          title="نسخ رابط السؤال"
                          aria-label="نسخ رابط السؤال"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent
                      className="text-justify leading-relaxed"
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <div itemProp="text">{highlight(faq.faq_answer, q)}</div>
                      {copied === slug && (
                        <div className="text-xs text-emerald-600 mt-2">
                          تم نسخ الرابط ✓
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {/* JSON-LD for SEO */}
          {jsonLd && (
            <script
              type="application/ld+json"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          )}
        </>
      )}
    </div>
  );
}
