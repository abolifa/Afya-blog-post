export type SliderItem = {
  id: number;
  post_id?: number;
  image: string;
  type: "image" | "url" | "post";
  url?: string;
  created_at: string;
  updated_at: string;
};

export type Announce = {
  id: number;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  tags: string[];
  main_image: string | null;
  images?: string[];
  content: string;
  created_at: string;
};

export type LaravelPage<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  to: number | null;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
};

export type Center = {
  id: number;
  name: string;
  phone: string;
  alt_phone?: string;
  street?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

export type Dcotor = {
  id: number;
  name: string;
  phone: string;
  center_id: number;
};

export type Schedule = {
  id: number;
  center_id: number;
  day: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export type Awareness = {
  id: number;
  title: string;
  description: string;
  attachments?: [
    {
      title: string;
      image: string;
    }
  ];
  created_at: string;
  updated_at: string;
};

export type Stats = {
  centers: number;
  patients: number;
  appointments: number;
  orders: number;
  prescriptions: number;
  devices: number;
  doctors: number;
};

export type FormState = {
  name: string;
  phone: string;
  message: string;
};
