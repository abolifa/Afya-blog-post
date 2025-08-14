"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Printer, ChevronDown, Users2, Building2 } from "lucide-react";
import clsx from "clsx";
import { OrgNode } from "@/lib/types";
import { OrgStructure } from "@/constant/data";

function normalizeTree(node?: OrgNode): OrgNode | null {
  if (!node || !node.name) return null;
  return {
    ...node,
    children: Array.isArray(node.children)
      ? (node.children
          .filter(Boolean)
          .map(normalizeTree)
          .filter(Boolean) as OrgNode[])
      : [],
  };
}

function matches(node: OrgNode, q: string) {
  if (!q) return true;
  const t = q.trim();
  const hay = `${node.name} ${node.leader?.name ?? ""} ${
    node.leader?.title ?? ""
  }`.toLowerCase();
  return hay.includes(t.toLowerCase());
}

function filterTree(node: OrgNode, q: string): OrgNode | null {
  if (!q) return node;
  const kids = (node.children ?? [])
    .map((c) => filterTree(c, q))
    .filter(Boolean) as OrgNode[];
  if (matches(node, q) || kids.length) return { ...node, children: kids };
  return null;
}

function countDescendants(node?: OrgNode): number {
  if (!node) return 0;
  return (node.children ?? []).reduce(
    (sum, c) => sum + 1 + countDescendants(c),
    0
  );
}

function TypeBadge({ type }: { type?: OrgNode["type"] }) {
  if (!type) return null;
  const map: Record<string, string> = {
    authority: "bg-teal-100 text-teal-700",
    directorate: "bg-sky-100 text-sky-700",
    department: "bg-amber-100 text-amber-800",
    unit: "bg-violet-100 text-violet-700",
  };
  return (
    <Badge
      className={clsx(
        "rounded-md font-normal",
        map[type] ?? "bg-muted text-foreground"
      )}
    >
      {type === "authority"
        ? "الهيئة"
        : type === "directorate"
        ? "إدارة"
        : type === "department"
        ? "قسم"
        : type === "unit"
        ? "وحدة"
        : type}
    </Badge>
  );
}

function OrgTree({
  node,
  level = 0,
  defaultOpen = true,
}: {
  node: OrgNode;
  level?: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <li className="relative ps-4">
      <span
        className="absolute start-0 top-5 bottom-0 border-s border-muted"
        aria-hidden="true"
      />
      <div className="relative">
        <Card className="border bg-card/80 hover:bg-card transition-colors">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  {level === 0 ? (
                    <Building2 className="w-5 h-5" />
                  ) : (
                    <Users2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{node.name}</h3>
                    <TypeBadge type={node.type} />
                    {node.children?.length ? (
                      <Badge variant="secondary" className="rounded-md">
                        {node.children.length} فرع
                      </Badge>
                    ) : null}
                  </div>
                  {node.leader?.name && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {node.leader.name}
                      {node.leader.title ? ` — ${node.leader.title}` : ""}
                      {node.leader.phone ? ` • ${node.leader.phone}` : ""}
                    </p>
                  )}
                  {node.leader?.email && (
                    <p className="text-xs text-muted-foreground mt-0.5 ltr:font-mono">
                      {node.leader.email}
                    </p>
                  )}
                </div>
              </div>

              {node.children?.length ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpen((v) => !v)}
                  className="gap-1"
                  aria-expanded={open}
                  aria-controls={`children-${node.id}`}
                >
                  {open ? "إخفاء الفروع" : "إظهار الفروع"}
                  <ChevronDown
                    className={clsx(
                      "h-4 w-4 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {node.children?.length ? (
        <ul
          id={`children-${node.id}`}
          className={clsx(
            "ms-6 mt-3 space-y-3 border-s border-muted ps-4",
            !open && "hidden"
          )}
        >
          {node.children.map((child) => (
            <OrgTree
              key={child.id}
              node={child}
              level={level + 1}
              defaultOpen={false}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function OrgStructurePage() {
  const [q, setQ] = React.useState("");
  const [expandAll, setExpandAll] = React.useState(false);

  const data = OrgStructure;

  const root = React.useMemo(() => normalizeTree(data?.root), [data?.root]);
  const filtered = React.useMemo(
    () => (root ? filterTree(root, q) : null),
    [root, q]
  );
  const updatedAt = data?.updated_at ?? root?.updated_at;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <nav className="text-sm text-muted-foreground mb-1">
            <Link href="/">الرئيسية</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">الهيكل التنظيمي</span>
          </nav>
          <h1 className="text-2xl font-bold">الهيكل التنظيمي للهيئة</h1>
          {updatedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              آخر تحديث: {new Date(updatedAt).toLocaleDateString("ar-LY")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <Separator />

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between print:hidden">
        <Input
          placeholder="ابحث عن إدارة/قسم/وحدة أو اسم المسؤول…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full md:w-96"
        />
        {root && (
          <div className="text-sm text-muted-foreground">
            إجمالي الوحدات: {1 + countDescendants(root)}
          </div>
        )}
      </div>

      {/* Content */}
      {!filtered ? (
        <div className="text-muted-foreground">لا توجد بيانات متاحة.</div>
      ) : (
        <div className="rounded-2xl border bg-card/80 p-4">
          <ul className="space-y-3">
            <div className="flex items-center justify-end mb-2 gap-2 print:hidden">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setExpandAll((v) => !v)}
              >
                {expandAll ? "طيّ الكل" : "توسيع الكل"}
              </Button>
            </div>
            <div key={expandAll ? "expand" : "collapse"}>
              <OrgTree node={filtered} defaultOpen={expandAll || !q} />
            </div>
          </ul>
        </div>
      )}

      {filtered?.children?.length ? (
        <>
          <h2 className="text-xl font-bold mt-6">إدارات وأقسام رئيسية</h2>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.children.map((c) => (
              <Card
                key={c.id}
                id={c.slug ?? undefined}
                className="border bg-card/80"
              >
                <CardHeader>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  {c.leader?.name && <div>المسؤول: {c.leader.name}</div>}
                  {c.leader?.title && <div>الصفة: {c.leader.title}</div>}
                  {c.leader?.phone && <div>الهاتف: {c.leader.phone}</div>}
                  {c.leader?.email && <div>البريد: {c.leader.email}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          header,
          nav {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .border {
            border-color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
}
