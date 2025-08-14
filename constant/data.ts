export const OrgStructure = {
  updated_at: "2025-08-10T10:00:00Z",
  root: {
    id: "root",
    name: "الهيئة الوطنية لأمراض الكلى",
    type: "authority",
    slug: "authority",
    updated_at: "2025-08-10T09:55:00Z",
    leader: {
      name: "د. مصطفى الزوي",
      title: "رئيس الهيئة",
      phone: "091-2345678",
      email: "president@nkda.example.ly",
    },
    children: [
      {
        id: "dir-medical",
        name: "الإدارة العامة للشؤون الطبية",
        type: "directorate",
        slug: "medical-directorate",
        leader: {
          name: "د. آمنة البرعصي",
          title: "مدير الإدارة",
          phone: "092-1122334",
          email: "amedical@nkda.example.ly",
        },
        children: [
          {
            id: "dep-dialysis-centers",
            name: "قسم مراكز الغسيل",
            type: "department",
            slug: "dialysis-centers",
            leader: {
              name: "م. عادل بن موسى",
              title: "رئيس القسم",
              phone: "091-5566778",
              email: "centers@nkda.example.ly",
            },
            children: [
              {
                id: "unit-quality",
                name: "وحدة الاعتماد والجودة",
                type: "unit",
                slug: "quality-unit",
                leader: {
                  name: "م. هبة علي",
                  title: "مشرف الوحدة",
                  phone: "094-7788990",
                  email: "quality@nkda.example.ly",
                },
              },
              {
                id: "unit-followup",
                name: "وحدة المتابعة الميدانية",
                type: "unit",
                slug: "field-followup-unit",
              },
            ],
          },
          {
            id: "dep-pharma-supply",
            name: "قسم الإمداد الدوائي",
            type: "department",
            slug: "pharma-supply",
            leader: {
              name: "د. وليد قنيدي",
              title: "رئيس القسم",
              phone: "091-4455667",
              email: "supply@nkda.example.ly",
            },
            children: [
              {
                id: "unit-tenders",
                name: "وحدة المناقصات",
                type: "unit",
                slug: "tenders-unit",
              },
              {
                id: "unit-warehouses",
                name: "وحدة المخازن",
                type: "unit",
                slug: "warehouses-unit",
              },
            ],
          },
          {
            id: "dep-registry",
            name: "قسم السجلات والبيانات",
            type: "department",
            slug: "registry",
            leader: {
              name: "أ. ابتسام الشريف",
              title: "رئيس القسم",
              phone: "092-6677889",
              email: "registry@nkda.example.ly",
            },
          },
        ],
      },
      {
        id: "dir-admin-finance",
        name: "الإدارة العامة للشؤون الإدارية والمالية",
        type: "directorate",
        slug: "admin-finance",
        leader: {
          name: "أ. محمد الختالي",
          title: "مدير الإدارة",
          phone: "091-9988776",
          email: "adminfinance@nkda.example.ly",
        },
        children: [
          {
            id: "dep-hr",
            name: "قسم الموارد البشرية",
            type: "department",
            slug: "hr",
            children: [
              {
                id: "unit-recruitment",
                name: "وحدة التوظيف",
                type: "unit",
                slug: "recruitment-unit",
              },
              {
                id: "unit-training",
                name: "وحدة التدريب والتطوير",
                type: "unit",
                slug: "training-unit",
              },
            ],
          },
          {
            id: "dep-procurement",
            name: "قسم المشتريات",
            type: "department",
            slug: "procurement",
          },
          {
            id: "dep-finance",
            name: "قسم الشؤون المالية",
            type: "department",
            slug: "finance",
          },
        ],
      },
      {
        id: "dir-it",
        name: "الإدارة العامة لتقنية المعلومات والتحول الرقمي",
        type: "directorate",
        slug: "it",
        leader: {
          name: "م. عائشة بالشعير",
          title: "مدير الإدارة",
          phone: "092-3344556",
          email: "it@nkda.example.ly",
        },
        children: [
          {
            id: "dep-apps",
            name: "قسم الأنظمة والتطبيقات",
            type: "department",
            slug: "apps",
            children: [
              {
                id: "unit-portal",
                name: "وحدة البوابة الإلكترونية",
                type: "unit",
                slug: "portal-unit",
              },
            ],
          },
          {
            id: "dep-infra",
            name: "قسم البنية التحتية والشبكات",
            type: "department",
            slug: "infrastructure",
          },
          {
            id: "dep-cyber",
            name: "قسم الأمن السيبراني",
            type: "department",
            slug: "cybersecurity",
          },
        ],
      },
      {
        id: "dep-media-awareness",
        name: "مكتب الإعلام والتوعية",
        type: "department",
        slug: "media-awareness",
        leader: {
          name: "أ. سناء بن عمران",
          title: "مدير المكتب",
          phone: "091-2211334",
          email: "media@nkda.example.ly",
        },
      },
      {
        id: "dep-legal",
        name: "المكتب القانوني",
        type: "department",
        slug: "legal-office",
        leader: {
          name: "أ. فاطمة القاضي",
          title: "المستشارة القانونية",
          phone: "092-4455667",
          email: "legal@nkda.example.ly",
        },
      },
    ],
  },
};
