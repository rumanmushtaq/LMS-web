import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export const socialLinks = [
  { Icon: Facebook,  hover: "#1877f2", label: "Facebook"  },
  { Icon: Instagram, hover: "#e1306c", label: "Instagram" },
  { Icon: Twitter,   hover: "#0f1419", label: "Twitter"   },
  { Icon: Youtube,   hover: "#ff0000", label: "YouTube"   },
  { Icon: Linkedin,  hover: "#0a66c2", label: "LinkedIn"  },
];

export const education = [
  { degree: "BCA – Bachelor of Computer Applications", meta: "International University  ·  2004 – 2010" },
  { degree: "MCA – Master of Computer Application",   meta: "International University  ·  2010 – 2012" },
  { degree: "Design Communication Visual",            meta: "International University  ·  2012 – 2015" },
];

export const experience = [
  { title: "Web Design & Development Team Leader", meta: "Creative Agency  ·  2013 – 2016"          },
  { title: "Project Manager",                       meta: "Jobcy Technology Pvt. Ltd.  ·  Present"  },
];

export const certBadges = [
  { src: "/cert_badge_1.png", bg: "#fff"     },
  { src: "/cert_badge_2.png", bg: "#1e293b"  },
  { src: "/cert_badge_1.png", bg: "#0ea5e9"  },
  { src: "/cert_badge_2.png", bg: "#fff"     },
];

export const contactItems = [
  { Icon: Mail,   label: "Email",   value: "jennywilson@example.com"              },
  { Icon: MapPin, label: "Address", value: "877 Ferry Street, Huntsville, Alabama" },
  { Icon: Phone,  label: "Phone",   value: "+1 (452) 125-6789"                    },
];
