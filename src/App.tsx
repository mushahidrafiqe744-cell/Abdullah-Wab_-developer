import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Check, 
  Briefcase, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  X, 
  Sliders, 
  Eye, 
  ChevronRight, 
  Download, 
  Laptop, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Settings,
  Globe,
  Github,
  Code2,
  Linkedin,
  FileText,
  ExternalLink,
  Link as LinkIcon,
  RefreshCw,
  Edit
} from "lucide-react";

// Inline High-Fidelity SVG WordPress Icon Component
const WordPressIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.158 12.786l-2.698 7.84a11.964 11.964 0 005.11-.47l-2.412-7.37zM2.083 12c0 2.274.633 4.398 1.733 6.213L8.68 5.753c-.024-.01-.047-.024-.07-.035C4.78 7.33 2.083 9.352 2.083 12zm18.334 0c0-1.802-.634-3.056-1.185-4.008-.551-.951-1.07-1.742-1.07-2.678 0 1.053.42 1.833.911 2.703.456.81.996 1.768.996 3.197 0 1.052-.228 2.14-.648 3.275l1.631-4.908c.24-.768.36-1.284.36-1.581zm-9.043-.6c0-.528.23-.888.431-1.235.3-.505.59-.937.59-1.573 0-.745-.551-1.429-1.32-1.429a1.325 1.325 0 00-.733.204l1.62 4.433c.412-.4.412-.4.412-.4zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.3 16.5c0-.12-.024-.264-.048-.408-.096-.528-.48-1.56-.48-1.56s-.192-.552-.192-.768c0-.36.264-.672.576-.672.312 0 .528.24.528.528s-.024.504-.024.504c.144.912.864 2.832.864 3.48a9.914 9.914 0 01-5.11 1.472l1.692-4.932s.36-1.032.552-1.632c.12-.336.24-.48.456-.48.216 0 .408.144.408.408s-.024.528-.024.528c-.144.912-.864 2.832-.864 3.48a9.92 9.92 0 01-1.336.084z" />
  </svg>
);

// Portfolio project structure
interface Project {
  id: string;
  title: string;
  category: "Frontend" | "Full-Stack" | "E-Commerce" | "UI/UX" | "APIs";
  image: string; // Base64 data URI or external URL
  description: string;
  client: string;
  year: string;
  deliverables: string[];
  websiteUrl?: string; // Live website link
}

// Client proposal tracking structure
interface Proposal {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  budget: number;
  complexity: string;
  message: string;
  status: "Reviewing" | "Proposal Sent" | "In Progress" | "Completed";
  date: string;
}

export default function App() {
  // --- States ---
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [activeTech, setActiveTech] = useState<string>("React");

  // Cost Estimator State
  const [estimatorService, setEstimatorService] = useState<string>("Full-Stack SaaS");
  const [estimatorPages, setEstimatorPages] = useState<number>(3);
  const [estimatorTurnaround, setEstimatorTurnaround] = useState<"Standard" | "Express">("Standard");
  const [estimatorCost, setEstimatorCost] = useState<number>(1200);

  // Dynamic Portfolio & Proposals State
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Form states for new project upload
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCat, setNewProjCat] = useState<"Frontend" | "Full-Stack" | "E-Commerce" | "UI/UX" | "APIs">("Frontend");
  const [newProjImg, setNewProjImg] = useState("");
  const [newProjUrl, setNewProjUrl] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjClient, setNewProjClient] = useState("");
  const [newProjYear, setNewProjYear] = useState(new Date().getFullYear().toString());
  const [newProjDeliverables, setNewProjDeliverables] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Contact form states
  const [newProposalName, setNewProposalName] = useState("");
  const [newProposalEmail, setNewProposalEmail] = useState("");
  const [newProposalMessage, setNewProposalMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [trackedProposalId, setTrackedProposalId] = useState<string>("");
  const [searchTrackId, setSearchTrackId] = useState("");
  const [trackedProposalResult, setTrackedProposalResult] = useState<Proposal | null>(null);

  // Hover states for interactive experience stats boxes
  const [hoverProjects, setHoverProjects] = useState(false);
  const [hoverYears, setHoverYears] = useState(false);
  const [hoverSatisfaction, setHoverSatisfaction] = useState(false);

  // Custom UI & Confirmation states (To bypass Sandboxed iframe native prompt limits)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroImg, setHeroImg] = useState<string>("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80");
  const [heroImgStyle, setHeroImgStyle] = useState<"arch" | "circle" | "rounded">("arch");
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("923000000000");
  
  // Custom Social Profiles states (inspired by high fidelity circular dark icon card)
  const [githubUrl, setGithubUrl] = useState("https://github.com/abdullah");
  const [githubUsername, setGithubUsername] = useState("github.com/abdullah");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/abdullah");
  const [linkedinUsername, setLinkedinUsername] = useState("linkedin.com/in/abdullah");
  const [wordpressUrl, setWordPressUrl] = useState("https://wordpress.org");
  const [wordpressUsername, setWordPressUsername] = useState("wordpress.org");

  // Helper to trigger elegant non-blocking toasts
  const triggerToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Monitor scroll for scroll-to-top FAB
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fallback initial projects (grounded in beautiful, modern placeholders)
  const defaultProjects: Project[] = [
    {
      id: "proj-1",
      title: "Nova SaaS Analytics Dashboard",
      category: "Full-Stack",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      websiteUrl: "https://vercel.com",
      description: "A high-performance business intelligence SaaS dashboard with secure API proxy routes, real-time metrics visualizer, and custom JWT authentication. Includes PostgreSQL database and Next.js SSR configurations.",
      client: "Nova Analytics Inc.",
      year: "2024",
      deliverables: ["Next.js App Router Setup", "PostgreSQL Database Schema", "Express API Proxy Server", "Chart.js Custom Theme Integration"]
    },
    {
      id: "proj-2",
      title: "Zenith E-Commerce Marketplace",
      category: "E-Commerce",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
      websiteUrl: "https://stripe.com",
      description: "A full-featured digital storefront with real-time inventory synchronizer, dynamic multi-tier shopping cart, search filter widgets, and Stripe Payment gateway. Built for high conversion.",
      client: "Zenith Apparel Group",
      year: "2024",
      deliverables: ["React Context State Controller", "Tailwind Fluid Layouts", "Stripe API Integration", "Client Admin Product Panel"]
    },
    {
      id: "proj-3",
      title: "Vivid UI/UX Design System",
      category: "UI/UX",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80",
      websiteUrl: "https://tailwindcss.com",
      description: "A comprehensive designer component system configured with Figma, compiled with custom design tokens, and coded beautifully in React + Tailwind. Tailored for scalable multi-app setups.",
      client: "Vivid Softworks",
      year: "2024",
      deliverables: ["Figma Design Token Export", "Tailwind Theme Extensions", "Accessible WAI-ARIA React Widgets", "Clean Storybook Documentation"]
    },
    {
      id: "proj-4",
      title: "Aura Creative Portfolio Engine",
      category: "Frontend",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
      websiteUrl: "https://react.dev",
      description: "A lightning-fast, sleek modular creative portfolio template showcasing fluid layouts, deep custom styling hooks, responsive grids, and clean visual storytelling rules.",
      client: "Aura Studios",
      year: "2024",
      deliverables: ["Single Page Application Structure", "Lucide Icon Integration", "Custom Client Configurator Panel", "Optimized Web Vitals Scoring"]
    },
    {
      id: "proj-5",
      title: "Secure RESTful Authentication Gateway",
      category: "APIs",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
      websiteUrl: "https://supabase.com",
      description: "An isolated enterprise grade authentication microservice proxy supporting OAuth logins, secure cookie sessions, request rate-limiting safeguards, and database credential encryption.",
      client: "Shield Cybernetics",
      year: "2024",
      deliverables: ["Node.js API Microservice", "OAuth 2.0 Auth Flow Setup", "Redis Token Backing Layer", "Comprehensive Postman Documentation Suite"]
    }
  ];

  // Tech stack details dictionary
  const techDetails: Record<string, { full: string; rating: string; projects: string; note: string; color: string; tip: string }> = {
    "React": {
      full: "React SPA & Frameworks",
      rating: "96%",
      projects: "140+ Projects",
      note: "Expert in building complex dynamic client UIs, managing state using Hooks, Context API, and state containers like Redux, with optimal rendering performance.",
      color: "bg-teal-900 border-teal-500 text-teal-300",
      tip: "Pro Tip: Always leverage custom hook structures and useCallback/useMemo controllers to bypass duplicate rendering overhead."
    },
    "Next.js": {
      full: "Next.js SSR & Server Actions",
      rating: "92%",
      projects: "75+ Websites",
      note: "Implementing fast Server-Side Rendering (SSR), Static Site Generation (SSG), search-engine friendly meta-tags, incremental builds, and Server Actions.",
      color: "bg-slate-900 border-slate-500 text-slate-300",
      tip: "Pro Tip: Combine Next.js App Router layouts with server-side pre-fetching to maximize both Lighthouse SEO and dynamic interaction response times."
    },
    "TypeScript": {
      full: "TypeScript Typed Codebases",
      rating: "94%",
      projects: "160+ App builds",
      note: "Enforcing static type safety, custom interface declarations, enterprise design patterns, and robust API call parameter constraints for high reliability.",
      color: "bg-blue-900 border-blue-500 text-blue-300",
      tip: "Pro Tip: Leverage advanced union type guards and partial generic properties to establish flexible database-to-UI component mapping schemas."
    },
    "Tailwind CSS": {
      full: "Tailwind CSS Utility Styling",
      rating: "98%",
      projects: "220+ Web pages",
      note: "Architecting bespoke visual themes, utility-first clean responsive code, dark mode variants, fluid grids, custom CSS token extensions, and zero clutter UI layouts.",
      color: "bg-sky-950 border-sky-500 text-sky-300",
      tip: "Pro Tip: Rely on custom Tailwind spacing grids and component tokens to enforce aesthetic spacing rules without heavy inline style overrides."
    },
    "Node & APIs": {
      full: "Node.js RESTful & GraphQL Backends",
      rating: "90%",
      projects: "95+ Microservices",
      note: "Creating secure, rate-limited backend web APIs, proxy endpoints, database models, express routes, and custom authentication handlers.",
      color: "bg-emerald-950 border-emerald-500 text-emerald-300",
      tip: "Pro Tip: Implement standard CORS configurations and validate incoming requests using JSON schemas to block potential database security leaks."
    }
  };

  // --- Initial Load & Sync ---
  useEffect(() => {
    // 0. Hero Image
    const savedHeroImg = localStorage.getItem("abdullah_hero_img");
    if (savedHeroImg) {
      setHeroImg(savedHeroImg);
    }

    // 1. Projects
    const savedProjects = localStorage.getItem("abdullah_portfolio_items");
    if (savedProjects) {
      try {
        const parsed: Project[] = JSON.parse(savedProjects);
        const upgraded = parsed.map((p, idx) => {
          if (!p.websiteUrl && defaultProjects[idx]) {
            return { ...p, websiteUrl: defaultProjects[idx].websiteUrl, image: defaultProjects[idx].image };
          }
          return p;
        });
        setProjects(upgraded);
        localStorage.setItem("abdullah_portfolio_items", JSON.stringify(upgraded));
      } catch {
        setProjects(defaultProjects);
        localStorage.setItem("abdullah_portfolio_items", JSON.stringify(defaultProjects));
      }
    } else {
      setProjects(defaultProjects);
      localStorage.setItem("abdullah_portfolio_items", JSON.stringify(defaultProjects));
    }

    // 2. Proposals
    const savedProposals = localStorage.getItem("abdullah_proposals");
    if (savedProposals) {
      setProposals(JSON.parse(savedProposals));
    } else {
      const seed: Proposal[] = [
        {
          id: "ABD-9812",
          clientName: "Siddique Ahmad",
          clientEmail: "siddique@ventures.co",
          serviceType: "Full-Stack SaaS",
          budget: 1800,
          complexity: "Next.js Platform Setup",
          message: "Looking for an elegant SaaS client dashboard with real-time customer data tracking widgets.",
          status: "In Progress",
          date: "2026-09-12"
        },
        {
          id: "ABD-4432",
          clientName: "Esha Malik",
          clientEmail: "esha@malikdesigns.com",
          serviceType: "E-Commerce Store",
          budget: 1400,
          complexity: "Stripe Storefront Layout",
          message: "Need a premium Shopify or custom React storefront to list luxury clothing articles.",
          status: "Completed",
          date: "2026-09-20"
        }
      ];
      setProposals(seed);
      localStorage.setItem("abdullah_proposals", JSON.stringify(seed));
    }

    // 3. Skills List
    const savedSkills = localStorage.getItem("abdullah_skills");
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    } else {
      const defaultSkills = [
        "React & Next.js SSR",
        "TypeScript Architecture",
        "Tailwind CSS Layouts",
        "Node.js & Express APIs",
        "PostgreSQL & MongoDB",
        "REST & GraphQL APIs",
        "Git & GitHub Workflow",
        "WordPress Development",
        "CI/CD Cloud Deployment"
      ];
      setSkills(defaultSkills);
      localStorage.setItem("abdullah_skills", JSON.stringify(defaultSkills));
    }

    // 3.5 Hero Image Style
    const savedHeroStyle = localStorage.getItem("abdullah_hero_img_style");
    if (savedHeroStyle) {
      setHeroImgStyle(savedHeroStyle as "arch" | "circle" | "rounded");
    }

    // 4. WhatsApp Number
    const savedWhatsapp = localStorage.getItem("abdullah_whatsapp");
    if (savedWhatsapp) {
      setWhatsappNumber(savedWhatsapp);
    } else {
      setWhatsappNumber("923000000000");
      localStorage.setItem("abdullah_whatsapp", "923000000000");
    }

    // 5. Custom Social Links
    const savedGithubUrl = localStorage.getItem("abdullah_github_url");
    if (savedGithubUrl) setGithubUrl(savedGithubUrl);
    const savedGithubUser = localStorage.getItem("abdullah_github_user");
    if (savedGithubUser) setGithubUsername(savedGithubUser);

    const savedLinkedinUrl = localStorage.getItem("abdullah_linkedin_url");
    if (savedLinkedinUrl) setLinkedinUrl(savedLinkedinUrl);
    const savedLinkedinUser = localStorage.getItem("abdullah_linkedin_user");
    if (savedLinkedinUser) setLinkedinUsername(savedLinkedinUser);

    const savedWordPressUrl = localStorage.getItem("abdullah_wordpress_url");
    if (savedWordPressUrl) setWordPressUrl(savedWordPressUrl);
    const savedWordPressUser = localStorage.getItem("abdullah_wordpress_user");
    if (savedWordPressUser) setWordPressUsername(savedWordPressUser);
  }, []);

  // --- Dynamic Calculator ---
  useEffect(() => {
    let basePrice = 400;
    if (estimatorService === "Frontend Page") basePrice = 300;
    if (estimatorService === "Full-Stack SaaS") basePrice = 800;
    if (estimatorService === "E-Commerce Store") basePrice = 600;
    if (estimatorService === "API Setup") basePrice = 400;
    if (estimatorService === "UI/UX Prototyping") basePrice = 250;

    let total = basePrice * (1 + (estimatorPages - 1) * 0.35); // base price + 35% for each additional layout page/microservice
    if (estimatorTurnaround === "Express") {
      total = Math.round(total * 1.35); // 35% rush fee
    } else {
      total = Math.round(total);
    }
    setEstimatorCost(total);
  }, [estimatorService, estimatorPages, estimatorTurnaround]);

  // --- Handle Custom Image Upload (Base64 Reader) ---
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProjImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handle Custom Hero Image Change ---
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Img = reader.result as string;
        setHeroImg(base64Img);
        localStorage.setItem("abdullah_hero_img", base64Img);
        triggerToast("Homepage profile picture updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to construct high-res live homepage screenshot URL from any website link
  const getWebsiteScreenshotUrl = (rawUrl: string) => {
    let clean = rawUrl.trim();
    if (!clean) return "";
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = "https://" + clean;
    }
    // WordPress mShots produces reliable, high-resolution live captures of any website's homepage
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(clean)}?w=1000`;
  };

  const handleFetchHomepageScreenshot = (urlToFetch?: string) => {
    const targetUrl = urlToFetch || newProjUrl;
    if (!targetUrl || !targetUrl.trim()) {
      triggerToast("Please enter a website link first!", "error");
      return;
    }
    const screenshotUrl = getWebsiteScreenshotUrl(targetUrl);
    setNewProjImg(screenshotUrl);
    triggerToast("Website homepage screenshot captured successfully!", "success");
  };

  // Helper to open project in edit mode (change image or website URL)
  const handleOpenEditProject = (item: Project) => {
    setEditingProject(item);
    setNewProjTitle(item.title);
    setNewProjCat(item.category);
    setNewProjImg(item.image);
    setNewProjUrl(item.websiteUrl || "");
    setNewProjDesc(item.description);
    setNewProjClient(item.client);
    setNewProjYear(item.year);
    setNewProjDeliverables(item.deliverables ? item.deliverables.join(", ") : "");
    setIsCustomizerOpen(true);
  };

  // Helper to open project customizer in new project mode
  const handleOpenNewProject = () => {
    setEditingProject(null);
    setNewProjTitle("");
    setNewProjCat("Frontend");
    setNewProjImg("");
    setNewProjUrl("");
    setNewProjDesc("");
    setNewProjClient("");
    setNewProjYear(new Date().getFullYear().toString());
    setNewProjDeliverables("");
    setIsCustomizerOpen(true);
  };

  // --- Create or Update Project ---
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || (!newProjImg && !newProjUrl) || !newProjDesc) {
      triggerToast("Please provide a Title, Description, and an Image or Website Link!", "error");
      return;
    }

    // If no custom image uploaded, auto-generate homepage screenshot from the website URL
    let finalImg = newProjImg;
    if (!finalImg && newProjUrl) {
      finalImg = getWebsiteScreenshotUrl(newProjUrl);
    }

    let cleanUrl = newProjUrl.trim();
    if (cleanUrl && !cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    if (editingProject) {
      // Update existing project
      const updatedList = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: newProjTitle,
            category: newProjCat,
            image: finalImg,
            websiteUrl: cleanUrl || undefined,
            description: newProjDesc,
            client: newProjClient || p.client,
            year: newProjYear || p.year,
            deliverables: newProjDeliverables 
              ? newProjDeliverables.split(",").map(item => item.trim()) 
              : p.deliverables
          };
        }
        return p;
      });
      setProjects(updatedList);
      localStorage.setItem("abdullah_portfolio_items", JSON.stringify(updatedList));
      if (selectedProject?.id === editingProject.id) {
        setSelectedProject(updatedList.find(p => p.id === editingProject.id) || null);
      }
      setIsCustomizerOpen(false);
      setEditingProject(null);
      triggerToast("Project & Homepage Image updated successfully!", "success");
      return;
    }

    // Create new project
    const newProjectItem: Project = {
      id: `proj-${Date.now()}`,
      title: newProjTitle,
      category: newProjCat,
      image: finalImg,
      websiteUrl: cleanUrl || undefined,
      description: newProjDesc,
      client: newProjClient || "Self-Initiated Project",
      year: newProjYear || new Date().getFullYear().toString(),
      deliverables: newProjDeliverables 
        ? newProjDeliverables.split(",").map(item => item.trim()) 
        : ["Custom Code Implementation", "Responsive Design Tests", "API Performance Audit"]
    };

    const updatedProjects = [newProjectItem, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem("abdullah_portfolio_items", JSON.stringify(updatedProjects));

    // Clear Form & Close Panel
    setNewProjTitle("");
    setNewProjImg("");
    setNewProjUrl("");
    setNewProjDesc("");
    setNewProjClient("");
    setNewProjDeliverables("");
    setEditingProject(null);
    setIsCustomizerOpen(false);
    triggerToast("Project successfully added with live homepage display!", "success");
  };

  // --- Delete Project ---
  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(item => item.id !== id);
    setProjects(updated);
    localStorage.setItem("abdullah_portfolio_items", JSON.stringify(updated));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    triggerToast("Project permanently removed from local cache.", "info");
  };

  // --- Skills Helpers ---
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillText.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      triggerToast("This skill is already in your list!", "info");
      return;
    }
    const updated = [...skills, trimmed];
    setSkills(updated);
    localStorage.setItem("abdullah_skills", JSON.stringify(updated));
    setNewSkillText("");
    triggerToast(`Added skill: ${trimmed}`, "success");
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const updated = skills.filter(s => s !== skillToDelete);
    setSkills(updated);
    localStorage.setItem("abdullah_skills", JSON.stringify(updated));
    triggerToast(`Removed skill: ${skillToDelete}`, "info");
  };

  // --- Restore Default Projects Demo ---
  const handleResetProjects = () => {
    setProjects(defaultProjects);
    localStorage.setItem("abdullah_portfolio_items", JSON.stringify(defaultProjects));
    triggerToast("Portfolio reset to premium developer layouts!", "success");
  };

  // --- Submit Client Proposal Form ---
  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposalName || !newProposalEmail) {
      triggerToast("Name and Email address are required fields!", "error");
      return;
    }

    const trackingId = `ABD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: Proposal = {
      id: trackingId,
      clientName: newProposalName,
      clientEmail: newProposalEmail,
      serviceType: estimatorService,
      budget: estimatorCost,
      complexity: estimatorTurnaround === "Express" ? "Express Turnaround" : "Standard Development Schedule",
      message: newProposalMessage || "Let's construct something outstanding!",
      status: "Reviewing",
      date: new Date().toISOString().split('T')[0]
    };

    const updatedList = [newRecord, ...proposals];
    setProposals(updatedList);
    localStorage.setItem("abdullah_proposals", JSON.stringify(updatedList));

    // Formulate a beautiful bolded WhatsApp message text
    const waText = `*🔥 NEW CLIENT PROPOSAL - ABDULLAH PORTFOLIO*\n` +
      `----------------------------------------\n` +
      `*📌 Project Code:* ${trackingId}\n` +
      `*👤 Client Name:* ${newProposalName}\n` +
      `*📧 Email:* ${newProposalEmail}\n` +
      `*💼 Service:* ${estimatorService}\n` +
      `*💰 Est. Budget:* $${estimatorCost}\n` +
      `*⚡ Urgency:* ${estimatorTurnaround === "Express" ? "🚀 Express (Rush)" : "📅 Standard Schedule"}\n` +
      `*📝 Project Message / Brief:*\n"${newProposalMessage || "Let's construct something outstanding!"}"\n` +
      `----------------------------------------\n` +
      `Hi Abdullah! I just calculated my project budget estimate on your portfolio. Let's chat and launch this project! 🚀`;

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;

    // Focus tracking ID & display success state
    setTrackedProposalId(trackingId);
    setNewProposalName("");
    setNewProposalEmail("");
    setNewProposalMessage("");
    setSuccessMessage(true);
    triggerToast(`Proposal Received! Code: ${trackingId}`, "success");

    // Open direct WhatsApp Chat channel with Abdullah in a new tab
    window.open(whatsappLink, "_blank");

    setTimeout(() => {
      setSuccessMessage(false);
    }, 8000);
  };

  // --- Track Client Project Progress ---
  const handleTrackProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTrackId.trim().toUpperCase();
    const match = proposals.find(p => p.id === query || p.clientEmail.toLowerCase() === query.toLowerCase());
    if (match) {
      setTrackedProposalResult(match);
      triggerToast("Proposal found and loaded successfully!", "success");
    } else {
      setTrackedProposalResult(null);
      triggerToast("No proposal matching that ID Code or Email found. Try 'ABD-4432'!", "error");
    }
  };

  // --- Client Delete Proposal ---
  const handleDeleteProposal = (id: string) => {
    const updated = proposals.filter(p => p.id !== id);
    setProposals(updated);
    localStorage.setItem("abdullah_proposals", JSON.stringify(updated));
    if (trackedProposalResult?.id === id) {
      setTrackedProposalResult(null);
    }
    triggerToast("Proposal deleted from client dashboard queue.", "info");
  };

  // Portfolio list filter
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-400 selection:text-emerald-950 font-sans">
      
      {/* HEADER CONTRAST ZONE */}
      <header className="sticky top-0 z-40 w-full bg-[#F4F4F0]/90 backdrop-blur-md border-b border-emerald-950/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Brand Logo Identity with the custom circular badge from image */}
          <a href="#" className="flex items-center gap-3 group">
            {/* Native High-Fidelity SVG Circular Logo Badge */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 shrink-0 overflow-visible transition-transform duration-500 group-hover:rotate-12">
              <path id="headerLogoTextPath" d="M 50,50 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0" fill="none" />
              <circle cx="50" cy="50" r="47" fill="none" stroke="#C29F5C" strokeWidth="0.75" opacity="0.4" />
              <circle cx="50" cy="50" r="37" fill="#0D2C1D" stroke="#C29F5C" strokeWidth="1.2" />
              <text className="font-serif font-extrabold fill-amber-600" style={{ fontSize: '4.8px', letterSpacing: '2.5px' }}>
                <textPath href="#headerLogoTextPath" startOffset="0%">
                  PORTFOLIO · AA ABDULLAH · PREMIUM ·
                </textPath>
              </text>
              <text x="50" y="44" textAnchor="middle" className="font-serif font-black fill-amber-400" style={{ fontSize: '22px' }}>A</text>
              <text x="50" y="53" textAnchor="middle" className="font-sans font-bold fill-white" style={{ fontSize: '8px' }}>Abdullah</text>
              <text x="50" y="61" textAnchor="middle" className="font-sans font-extrabold fill-amber-400" style={{ fontSize: '4.5px', letterSpacing: '1px' }}>ENGINEER</text>
              <g transform="translate(44, 66) scale(0.5)" stroke="#C29F5C" fill="none" strokeWidth="1.5">
                <rect x="2" y="3" width="18" height="11" rx="1" />
                <line x1="0" y1="16" x2="22" y2="16" />
              </g>
            </svg>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-emerald-950 leading-none group-hover:text-amber-600 transition-colors">
                Abdullah
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-950/70 font-semibold mt-1 leading-none">
                WEB DEVELOPER
              </span>
            </div>
          </a>

          {/* Nav elements */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-widest text-emerald-950/80">
            <a href="#about" className="hover:text-amber-600 transition-colors">ABOUT ME</a>
            <a href="#services" className="hover:text-amber-600 transition-colors">SERVICES & TECH</a>
            <a href="#portfolio" className="hover:text-amber-600 transition-colors">PORTFOLIO</a>
            <a href="#estimator" className="hover:text-amber-600 transition-colors">ESTIMATOR</a>
            <a href="#contact" className="hover:text-amber-600 transition-colors">CONTACT</a>
            <button 
              onClick={() => setIsCvModalOpen(true)} 
              className="text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              MY CV
            </button>
          </nav>

          {/* Call-to-action & Social Links */}
          <div className="flex items-center gap-3">
            {/* Social Icons inside Navbar */}
            <div className="hidden sm:flex items-center gap-2 mr-1">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-950/5 flex items-center justify-center text-emerald-950 hover:bg-emerald-950 hover:text-white transition-all shadow-sm"
                title="GitHub Link"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-950/5 flex items-center justify-center text-emerald-950 hover:bg-emerald-950 hover:text-white transition-all shadow-sm"
                title="LinkedIn Link"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={wordpressUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-950/5 flex items-center justify-center text-emerald-950 hover:bg-emerald-950 hover:text-white transition-all shadow-sm"
                title="WordPress Link"
              >
                <WordPressIcon className="w-4 h-4 fill-current" />
              </a>
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-emerald-950/5 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                title="WhatsApp Link"
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.502 1.157 3.473L6.5 19.5l4.241-.922c.942.457 2.001.718 3.121.718 3.18 0 5.766-2.586 5.767-5.766.002-3.181-2.584-5.766-5.767-5.766L12.031 6.172zm3.896 8.354c-.161.453-.836.852-1.242.903-.361.045-.815.064-1.332-.102-.324-.104-.737-.258-1.258-.484-2.221-.962-3.649-3.21-3.76-3.359-.111-.148-.901-1.2-1.01-2.35-.11-1.15.485-1.742.727-1.984.242-.242.53-.303.707-.303.177 0 .354.002.508.01.161.008.379-.062.593.454.222.535.758 1.848.824 1.98.066.132.11.286.022.463-.088.177-.132.286-.264.44l-.396.484c-.132.154-.27.32-.116.583.154.264.685 1.129 1.47 1.83.992.887 1.826 1.16 2.09 1.292.264.132.418.11.572-.066.154-.176.66-.77.836-1.035.176-.264.352-.22.595-.132.242.088 1.542.727 1.806.859.264.132.44.198.506.309.066.111.066.64-.095 1.093z"/>
                </svg>
              </a>
            </div>

            {/* Mobile CV Button */}
            <button 
              onClick={() => setIsCvModalOpen(true)} 
              className="lg:hidden text-amber-600 hover:text-amber-700 font-bold text-xs tracking-wider transition-colors mr-2 cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              CV
            </button>

            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-emerald-950 hover:bg-emerald-900 text-white flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs tracking-wider transition-all font-semibold shadow hover:scale-102 cursor-pointer"
            >
              <span className="hidden sm:inline">LET'S TALK</span>
              <span className="sm:hidden">TALK</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION WITH GOLD STAR AND DECORATIVE EMBELLISHMENTS */}
      <section className="relative overflow-hidden bg-[#F4F4F0] py-16 lg:py-24 px-6 border-b border-emerald-950/5">
        
        {/* Aesthetic Background Accents */}
        <div className="absolute top-1/4 left-0 w-32 lg:w-48 opacity-20 pointer-events-none transform -translate-x-12 select-none">
          <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0D2C1D] stroke-current stroke-[1.5]">
            <path d="M0,10 Q30,50 10,120 Q5,150 0,180" />
            <path d="M10,40 Q50,20 80,10 Q60,40 10,40 Z" fill="#0D2C1D" fillOpacity="0.1" />
            <path d="M12,70 Q60,60 90,50 Q70,80 12,70 Z" fill="#0D2C1D" fillOpacity="0.1" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Bio Texts */}
          <div className="lg:col-span-7 z-10">
            <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold tracking-[0.2em] uppercase">
              HELLO, I'M <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>

            <div className="mt-4 relative">
              <h1 
                onMouseEnter={() => setIsNameHovered(true)}
                onMouseLeave={() => setIsNameHovered(false)}
                className="font-serif text-6xl lg:text-8xl font-black text-emerald-950 leading-none tracking-tight select-none cursor-default flex flex-row items-center overflow-visible"
              >
                {"Abdullah".split("").map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:text-amber-500"
                    style={{
                      color: isNameHovered ? "#d97706" : undefined,
                      transitionDelay: isNameHovered ? `${index * 60}ms` : '0ms'
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
              <div className="flex flex-wrap items-center -mt-1 gap-x-4 animate-float">
                <span className="font-serif text-5xl lg:text-7xl text-amber-600 italic">
                  Premium Web
                </span>
                <span className="font-sans text-lg lg:text-2xl font-light tracking-[0.35em] text-emerald-950 uppercase pt-2">
                  DEVELOPER
                </span>
              </div>
            </div>

            <div className="mt-8">
              <span className="bg-emerald-950 text-white text-[10px] md:text-xs uppercase tracking-[0.18em] px-4 py-2 rounded-full inline-block font-bold shadow-sm">
                ENGINEERING SECURE, HIGH-PERFORMANCE WEB APPLICATIONS.
              </span>
            </div>

            <p className="mt-6 text-sm lg:text-base text-emerald-950/80 max-w-lg leading-relaxed font-normal">
              I specialize in React SPA design, robust full-stack workflows, scalable databases, and bespoke interface configurations that empower dynamic business performance.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#portfolio"
                className="bg-emerald-950 hover:bg-emerald-900 text-white flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider transition-all shadow"
              >
                EXPLORE MY APPS
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <button 
                onClick={() => {
                  const element = document.getElementById('estimator');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-emerald-950/20 hover:border-emerald-950 text-emerald-950 hover:bg-emerald-950/5 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                COST ESTIMATOR
              </button>
            </div>

            {/* INTERACTIVE EXPERIENCE STATS CARD FOR HERO */}
            <div className="mt-10 pt-8 border-t border-emerald-950/10 grid grid-cols-3 gap-4">
              {/* Stat 1: Projects Delivered */}
              <div 
                onMouseEnter={() => setHoverProjects(true)}
                onMouseLeave={() => setHoverProjects(false)}
                className="group cursor-default p-4 bg-white/40 hover:bg-white rounded-3xl border border-emerald-950/5 hover:border-amber-500/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between min-h-[120px]"
              >
                <div className="font-serif text-3xl lg:text-4xl font-bold text-emerald-950 transition-transform duration-300 transform group-hover:scale-108 origin-left">
                  {hoverProjects ? "140+" : "0+"}
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-950/70 group-hover:text-emerald-950 tracking-tight leading-snug flex items-center gap-0.5 transition-colors">
                  <span>Projects Delivered</span>
                  <span className="text-amber-600 transition-transform duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </div>
              </div>

              {/* Stat 2: Years Experience */}
              <div 
                onMouseEnter={() => setHoverYears(true)}
                onMouseLeave={() => setHoverYears(false)}
                className="group cursor-default p-4 bg-white/40 hover:bg-white rounded-3xl border border-emerald-950/5 hover:border-amber-500/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <div className="font-serif text-3xl lg:text-4xl font-bold text-emerald-950 transition-transform duration-300 transform group-hover:scale-108 origin-left leading-none">
                    {hoverYears ? "5+" : "0+"}
                  </div>
                  <div className="font-serif text-[10px] font-bold text-emerald-950/50 leading-none mt-1 group-hover:text-emerald-950/70 transition-colors">
                    Years
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-950/70 group-hover:text-emerald-950 tracking-tight leading-snug flex items-center gap-0.5 transition-colors">
                  <span>Experience</span>
                  <span className="text-amber-600 transition-transform duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </div>
              </div>

              {/* Stat 3: Satisfaction */}
              <div 
                onMouseEnter={() => setHoverSatisfaction(true)}
                onMouseLeave={() => setHoverSatisfaction(false)}
                className="group cursor-default p-4 bg-white/40 hover:bg-white rounded-3xl border border-emerald-950/5 hover:border-amber-500/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between min-h-[120px]"
              >
                <div className="font-serif text-3xl lg:text-4xl font-bold text-emerald-950 transition-transform duration-300 transform group-hover:scale-108 origin-left">
                  {hoverSatisfaction ? "100%" : "0%"}
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-950/70 group-hover:text-emerald-950 tracking-tight leading-snug flex items-center gap-0.5 transition-colors">
                  <span>Satisfaction</span>
                  <span className="text-amber-600 transition-transform duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Portrait Arch containing beautiful graphic */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Ambient Backing Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 lg:w-96 h-80 lg:h-96 rounded-full border border-amber-500/20 -z-0"></div>
            
            <div className="relative z-10 w-72 lg:w-80 animate-float">
              {/* Top Star Ornament */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500">
                <Sparkles className="w-6 h-6 fill-amber-500" />
              </div>

              {/* Dynamic Portrait Frame containing high-tech code/graphics visual */}
              <div className={`transition-all duration-500 overflow-hidden border-[10px] border-[#ECEAE1] shadow-2xl relative bg-emerald-950 group ${
                heroImgStyle === "circle"
                  ? "w-72 h-72 lg:w-80 lg:h-80 rounded-full mx-auto"
                  : heroImgStyle === "rounded"
                  ? "w-full h-[380px] lg:h-[420px] rounded-[2.5rem]"
                  : "w-full h-[380px] lg:h-[420px] rounded-t-full"
              }`}>
                <img 
                  src={heroImg} 
                  alt="Abdullah - Premium Web Developer" 
                  className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Floating "Change Photo / Add Image" Action button */}
                <div className="absolute top-4 right-4 z-20 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleHeroImageChange}
                    className="hidden" 
                    id="hero-img-uploader"
                  />
                  <label 
                    htmlFor="hero-img-uploader"
                    className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-[10px] tracking-wider px-3 py-2 rounded-xl uppercase cursor-pointer flex items-center gap-1 shadow-lg transition-all border border-emerald-950/10"
                    title="Upload Custom Profile Photo"
                  >
                    <Plus className="w-3 h-3" />
                    Add Image
                  </label>
                </div>
                
                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                  <p className="font-mono text-[10px] sm:text-xs text-amber-400">const developer = {"{"}</p>
                  <p className="font-mono text-[10px] sm:text-xs text-slate-300 ml-4">name: 'Abdullah',</p>
                  <p className="font-mono text-[10px] sm:text-xs text-slate-300 ml-4 font-semibold">skills: 'Web Developer'</p>
                  <p className="font-mono text-[10px] sm:text-xs text-amber-400">{"};"}</p>
                </div>
              </div>

              {/* Dynamic Image Style Switcher Button Group */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-emerald-950/5 shadow-md">
                <span className="text-[9px] font-extrabold text-emerald-950/50 uppercase tracking-widest pl-2 pr-1">Frame Style:</span>
                <button
                  type="button"
                  onClick={() => {
                    setHeroImgStyle("arch");
                    localStorage.setItem("abdullah_hero_img_style", "arch");
                    triggerToast("Classical Arch frame applied!", "success");
                  }}
                  className={`px-2.5 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                    heroImgStyle === "arch"
                      ? "bg-emerald-950 text-white shadow-sm"
                      : "text-emerald-950/60 hover:text-emerald-950"
                  }`}
                >
                  Arch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroImgStyle("circle");
                    localStorage.setItem("abdullah_hero_img_style", "circle");
                    triggerToast("Modern Circular frame applied!", "success");
                  }}
                  className={`px-2.5 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                    heroImgStyle === "circle"
                      ? "bg-emerald-950 text-white shadow-sm"
                      : "text-emerald-950/60 hover:text-emerald-950"
                  }`}
                >
                  Circle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroImgStyle("rounded");
                    localStorage.setItem("abdullah_hero_img_style", "rounded");
                    triggerToast("Premium Rounded Card applied!", "success");
                  }}
                  className={`px-2.5 py-1.5 text-[9px] font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                    heroImgStyle === "rounded"
                      ? "bg-emerald-950 text-white shadow-sm"
                      : "text-emerald-950/60 hover:text-emerald-950"
                  }`}
                >
                  Rounded
                </button>
              </div>

              {/* Premium Social Credentials Float Card (Styled exactly like the requested Pinterest/TikTok/Instagram style) */}
              <div className="relative mt-10 mx-auto lg:absolute lg:mt-0 lg:-bottom-10 lg:-left-40 xl:-left-48 bg-white border border-emerald-950/5 text-emerald-950 p-5 rounded-[2rem] shadow-2xl w-72 text-left z-20 group/social hover:scale-102 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-emerald-950/5 pb-2.5 mb-4">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.15em]">
                    CONNECT WITH ME:
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                
                <div className="flex flex-col gap-4">
                  {/* GitHub Profile */}
                  <a 
                    href={githubUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3.5 group/item cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-950 text-white flex items-center justify-center shrink-0 group-hover/item:bg-amber-500 group-hover/item:text-emerald-950 transition-all duration-300 shadow-md">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-serif font-bold text-emerald-950 uppercase tracking-wide leading-none mb-1">
                        GitHub Profile
                      </h5>
                      <span className="text-[10px] text-emerald-950/60 font-semibold font-sans tracking-tight hover:text-amber-600 transition-colors block break-all">
                        {githubUsername}
                      </span>
                    </div>
                  </a>

                  {/* LinkedIn Profile */}
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3.5 group/item cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-950 text-white flex items-center justify-center shrink-0 group-hover/item:bg-amber-500 group-hover/item:text-emerald-950 transition-all duration-300 shadow-md">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-serif font-bold text-emerald-950 uppercase tracking-wide leading-none mb-1">
                        LinkedIn Profile
                      </h5>
                      <span className="text-[10px] text-emerald-950/60 font-semibold font-sans tracking-tight hover:text-amber-600 transition-colors block break-all">
                        {linkedinUsername}
                      </span>
                    </div>
                  </a>

                  {/* WordPress Site */}
                  <a 
                    href={wordpressUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3.5 group/item cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-950 text-white flex items-center justify-center shrink-0 group-hover/item:bg-amber-500 group-hover/item:text-emerald-950 transition-all duration-300 shadow-md">
                      <WordPressIcon className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h5 className="text-xs font-serif font-bold text-emerald-950 uppercase tracking-wide leading-none mb-1">
                        WordPress Site
                      </h5>
                      <span className="text-[10px] text-emerald-950/60 font-semibold font-sans tracking-tight hover:text-amber-600 transition-colors block break-all">
                        {wordpressUsername}
                      </span>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="bg-emerald-950 py-16 lg:py-24 px-6 text-white relative">
        <div className="absolute top-12 right-12 w-24 h-24 text-amber-500 opacity-10 pointer-events-none select-none hidden md:block">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="text-sm">✦</span>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Biography details */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase block">
              ABOUT ME
            </span>
            <div className="relative inline-block">
              <h2 className="text-4xl lg:text-5xl font-serif font-medium text-white tracking-tight">
                I'm Abdullah.
              </h2>
              <div className="h-0.5 w-full bg-amber-500 mt-2.5 rounded-full"></div>
            </div>

            <p className="text-slate-300 text-sm lg:text-base leading-relaxed font-normal pt-2">
              I am an energetic Web Developer and Full-Stack Architect focused on building scalable cloud-native architectures, beautiful React web layouts, high-performance database schemas, and tailored integrations. My objective is to build clean, functional, and secure software solutions that deliver high real-world value.
            </p>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl max-w-md backdrop-blur-sm mt-8">
              <p className="text-xs italic text-slate-300">
                "High quality engineering doesn't just mean code that doesn't crash. It's about designing silent technical bridges that carry data beautifully, optimize server overhead, and translate client visions into secure user experiences."
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-[1px] w-5 bg-amber-500"></div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-500">Abdullah</span>
              </div>
            </div>
          </div>

          {/* Professional Credentials Badge & Details */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-6">
              
              {/* Row 1: Work Style */}
              <div className="flex items-center gap-4 group hover:translate-x-2.5 transition-all duration-300 cursor-default">
                <div className="w-11 h-11 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-emerald-950 group-hover:scale-110 group-hover:rotate-6 border border-white/10 group-hover:border-amber-500 flex items-center justify-center text-amber-500 shrink-0 transition-all duration-300 shadow-md">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-amber-500 tracking-wider uppercase transition-colors">WORK STYLE</p>
                  <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors tracking-wide">Full-Time Freelancer & Architect</p>
                </div>
              </div>

              {/* Row 2: Location */}
              <div className="flex items-center gap-4 group hover:translate-x-2.5 transition-all duration-300 cursor-default">
                <div className="w-11 h-11 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-emerald-950 group-hover:scale-110 group-hover:rotate-6 border border-white/10 group-hover:border-amber-500 flex items-center justify-center text-amber-500 shrink-0 transition-all duration-300 shadow-md">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-amber-500 tracking-wider uppercase transition-colors">LOCATION</p>
                  <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors tracking-wide">Pakistan (Remote Worldwide)</p>
                </div>
              </div>

              {/* Row 3: Email */}
              <a href="mailto:abdullah.dev.pro@gmail.com" className="flex items-center gap-4 group hover:translate-x-2.5 transition-all duration-300 block">
                <div className="w-11 h-11 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-emerald-950 group-hover:scale-110 group-hover:rotate-6 border border-white/10 group-hover:border-amber-500 flex items-center justify-center text-amber-500 shrink-0 transition-all duration-300 shadow-md">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-amber-500 tracking-wider uppercase transition-colors">EMAIL ADDRESS</p>
                  <p className="text-sm font-bold text-white/90 group-hover:text-amber-400 transition-colors tracking-wide truncate">
                    abdullah.dev.pro@gmail.com
                  </p>
                </div>
              </a>

              {/* Row 4: Phone / Availability */}
              <div className="flex items-center gap-4 group hover:translate-x-2.5 transition-all duration-300 cursor-default">
                <div className="w-11 h-11 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-emerald-950 group-hover:scale-110 group-hover:rotate-6 border border-white/10 group-hover:border-amber-500 flex items-center justify-center text-amber-500 shrink-0 transition-all duration-300 shadow-md">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-amber-500 tracking-wider uppercase transition-colors">AVAILABILITY</p>
                  <p className="text-sm font-bold text-white/90 group-hover:text-white transition-colors tracking-wide">Available (Hours: 9 AM - 9 PM PST)</p>
                </div>
              </div>

            </div>

            {/* Circular Rotating Badge */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-44 h-44 rounded-full border border-amber-500/30 flex items-center justify-center p-3">
                
                {/* SVG Rotating Text */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_30s_linear_infinite] opacity-80 pointer-events-none">
                  <defs>
                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="text-[6.5px] tracking-[4px] fill-amber-500 uppercase font-semibold">
                    <textPath href="#circlePath">ABDULLAH PREMIUM PORTFOLIO • ABDULLAH WEB DEVELOPER • </textPath>
                  </text>
                </svg>

                {/* Central Monogram */}
                <div className="w-32 h-32 rounded-full border border-amber-500/20 flex flex-col items-center justify-center bg-[#071911] shadow-xl text-center">
                  <span className="font-serif text-4xl font-extrabold text-amber-500 leading-none">A</span>
                  <span className="font-serif text-xs text-white mt-1 leading-none tracking-wide">Abdullah</span>
                  <span className="text-[7px] uppercase tracking-[0.25em] text-amber-500 mt-1">ENGINEER</span>
                  
                  <div className="mt-2 text-amber-500/60">
                    <Laptop className="w-4 h-4 mx-auto" />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SERVICES, SKILLS GRID */}
      <section id="services" className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Column 1: Core Services */}
        <div className="bg-[#ECEAE1] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-emerald-950/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-emerald-950 tracking-tight">
              My Services
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { title: "React SPA Apps", desc: "Constructing modular dynamic frontend clients with flawless responsive scaling." },
              { title: "Full-Stack SaaS Setup", desc: "Setting up database schemas, user login structures, and client analytics widgets." },
              { title: "E-Commerce Stores", desc: "Stripe secure checkouts, product customizers, and cart state controllers." },
              { title: "Secure REST APIs", desc: "Architecting proxy routes, JSON parameter validations, and authorization microservices." },
              { title: "Responsive Layouts", desc: "Designing elegant landing pages from scratch with pristine typographic grids." },
              { title: "Performance Optimizations", desc: "Compressing static assets, tuning render trees, and getting 95+ Lighthouse scores." }
            ].map((service, index) => (
              <div 
                key={index} 
                className="group flex gap-4 p-4 rounded-2xl hover:bg-[#DFDCCE]/70 hover:translate-x-2 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-950 group-hover:bg-amber-500 text-white group-hover:text-emerald-950 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm font-sans">
                  <span className="text-[11px] font-black">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-emerald-950 tracking-wider uppercase mb-1.5 group-hover:text-amber-700 transition-colors">{service.title}</h3>
                  <p className="text-xs text-emerald-950/70 group-hover:text-emerald-950 transition-colors leading-relaxed font-normal">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Interactive Developer Tech Stack */}
        <div className="bg-[#F4F4F0] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-emerald-950/10 space-y-8">
          
          {/* Web Development Mastery Dashboard (Styled precisely like your uploaded image with custom logos) */}
          <div className="bg-[#f4f1e8] p-6 rounded-[2rem] border border-emerald-950/10 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-emerald-950/10 pb-3 mb-5">
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-950/90 uppercase">
                WEB DEVELOPMENT MASTERY
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] text-amber-600 uppercase">
                5 CORE SKILLS
              </span>
            </div>

            <div className="space-y-4">
              {/* Tool 1: React & Next.js */}
              <div className="group bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-sm hover:scale-[1.02] hover:translate-x-1.5 hover:shadow-md hover:border-emerald-950/15 transition-all duration-300 cursor-default">
                <div className="flex items-start gap-3.5">
                  {/* React Icon */}
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#0a192f] flex items-center justify-center border border-[#61dafb]/30 shadow-sm group-hover:scale-108 group-hover:rotate-6 transition-transform duration-300">
                    <svg viewBox="0 0 100 100" className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }}>
                      <ellipse cx="50" cy="50" rx="8" ry="28" fill="none" stroke="#61dafb" strokeWidth="2.5" transform="rotate(30 50 50)" />
                      <ellipse cx="50" cy="50" rx="8" ry="28" fill="none" stroke="#61dafb" strokeWidth="2.5" transform="rotate(90 50 50)" />
                      <ellipse cx="50" cy="50" rx="8" ry="28" fill="none" stroke="#61dafb" strokeWidth="2.5" transform="rotate(150 50 50)" />
                      <circle cx="50" cy="50" r="4.5" fill="#61dafb" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-emerald-950 tracking-tight group-hover:text-amber-700 transition-colors">React & Next.js</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-950/50 bg-[#F4F4F0] group-hover:bg-amber-500/10 group-hover:text-amber-800 px-1.5 py-0.5 rounded-md transition-colors">96%</span>
                        <span className="text-[9px] font-extrabold text-[#112a1f] bg-[#61dafb]/10 text-sky-800 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:scale-105 transition-transform">Expert</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-950/70 group-hover:text-emerald-950/90 mt-1 leading-relaxed transition-colors">
                      Single Page Applications (SPAs), Server-Side Rendering (SSR), responsive interactive state architectures.
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-3.5 w-full h-1.5 bg-[#e8e5d9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-950 to-[#C29F5C] rounded-full group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500" style={{ width: "96%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 2: TypeScript */}
              <div className="group bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-sm hover:scale-[1.02] hover:translate-x-1.5 hover:shadow-md hover:border-emerald-950/15 transition-all duration-300 cursor-default">
                <div className="flex items-start gap-3.5">
                  {/* TypeScript Icon */}
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#00273f] flex items-center justify-center border border-[#3178c6]/40 shadow-sm group-hover:scale-108 group-hover:rotate-6 transition-transform duration-300">
                    <span className="text-xs font-black text-[#3178c6] tracking-tight font-serif leading-none">TS</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-emerald-950 tracking-tight group-hover:text-amber-700 transition-colors">TypeScript</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-950/50 bg-[#F4F4F0] group-hover:bg-amber-500/10 group-hover:text-amber-800 px-1.5 py-0.5 rounded-md transition-colors">92%</span>
                        <span className="text-[9px] font-extrabold text-[#112a1f] bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:scale-105 transition-transform">Advanced</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-950/70 group-hover:text-emerald-950/90 mt-1 leading-relaxed transition-colors">
                      Static type safety, robust scalable schemas, compilation pipelines, error-free interfaces.
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-3.5 w-full h-1.5 bg-[#e8e5d9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-950 to-[#C29F5C] rounded-full group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 3: Tailwind CSS */}
              <div className="group bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-sm hover:scale-[1.02] hover:translate-x-1.5 hover:shadow-md hover:border-emerald-950/15 transition-all duration-300 cursor-default">
                <div className="flex items-start gap-3.5">
                  {/* Tailwind Icon */}
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#0b232e] flex items-center justify-center border border-[#38bdf8]/30 shadow-sm group-hover:scale-108 group-hover:rotate-6 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-none stroke-[#38bdf8]" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3c-1.2 0-2.4.6-3.6 1.8L3.6 9.6c-1.2 1.2-1.8 2.4-1.8 3.6 0 1.2.6 2.4 1.8 3.6l4.8 4.8c1.2 1.2 2.4 1.8 3.6 1.8 1.2 0 2.4-.6 3.6-1.8l4.8-4.8c1.2-1.2 1.8-2.4 1.8-3.6 0-1.2-.6-2.4-1.8-3.6L15.6 4.8C14.4 3.6 13.2 3 12 3z" />
                      <path d="M12 9c-.6 0-1.2.3-1.8.9l-2.4 2.4c-.6.6-.9 1.2-.9 1.8 0 .6.3 1.2.9 1.8l2.4 2.4c.6.6 1.2.9 1.8.9.6 0 1.2-.3 1.8-.9l2.4-2.4c.6-.6.9-1.2.9-1.8 0-.6-.3-1.2-.9-1.8L13.8 9.9c-.6-.6-1.2-.9-1.8-.9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-emerald-950 tracking-tight group-hover:text-amber-700 transition-colors">Tailwind CSS</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-950/50 bg-[#F4F4F0] group-hover:bg-amber-500/10 group-hover:text-amber-800 px-1.5 py-0.5 rounded-md transition-colors">95%</span>
                        <span className="text-[9px] font-extrabold text-[#112a1f] bg-[#38bdf8]/10 text-cyan-800 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:scale-105 transition-transform">Expert</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-950/70 group-hover:text-emerald-950/90 mt-1 leading-relaxed transition-colors">
                      Utility-first configurations, beautiful responsive grids, micro-interactions, custom brand design systems.
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-3.5 w-full h-1.5 bg-[#e8e5d9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-950 to-[#C29F5C] rounded-full group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 4: Node.js & APIs */}
              <div className="group bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-sm hover:scale-[1.02] hover:translate-x-1.5 hover:shadow-md hover:border-emerald-950/15 transition-all duration-300 cursor-default">
                <div className="flex items-start gap-3.5">
                  {/* Node.js Icon */}
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#14251c] flex items-center justify-center border border-[#398239]/40 shadow-sm group-hover:scale-108 group-hover:rotate-6 transition-transform duration-300">
                    <span className="text-[10px] font-black text-[#43a047] tracking-tighter leading-none uppercase">Node</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-emerald-950 tracking-tight group-hover:text-amber-700 transition-colors">Node.js & Express</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-950/50 bg-[#F4F4F0] group-hover:bg-amber-500/10 group-hover:text-amber-800 px-1.5 py-0.5 rounded-md transition-colors">90%</span>
                        <span className="text-[9px] font-extrabold text-[#112a1f] bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:scale-105 transition-transform">Advanced</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-950/70 group-hover:text-emerald-950/90 mt-1 leading-relaxed transition-colors">
                      High-performance backend routing, REST API microservices, middleware controllers, secure auth tokens.
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-3.5 w-full h-1.5 bg-[#e8e5d9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-950 to-[#C29F5C] rounded-full group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 5: WordPress & PHP */}
              <div className="group bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-sm hover:scale-[1.02] hover:translate-x-1.5 hover:shadow-md hover:border-emerald-950/15 transition-all duration-300 cursor-default">
                <div className="flex items-start gap-3.5">
                  {/* WordPress Icon */}
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#0b2434] flex items-center justify-center border border-[#21759b]/40 shadow-sm group-hover:scale-108 group-hover:rotate-6 transition-transform duration-300">
                    <span className="text-lg font-serif font-black text-[#21759b] leading-none">W</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-emerald-950 tracking-tight group-hover:text-amber-700 transition-colors">WordPress & PHP</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-950/50 bg-[#F4F4F0] group-hover:bg-amber-500/10 group-hover:text-amber-800 px-1.5 py-0.5 rounded-md transition-colors">94%</span>
                        <span className="text-[9px] font-extrabold text-[#112a1f] bg-[#21759b]/10 text-cyan-800 px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:scale-105 transition-transform">Expert</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-950/70 group-hover:text-emerald-950/90 mt-1 leading-relaxed transition-colors">
                      Bespoke themes, theme editor customization, dynamic hooks, custom database integrations.
                    </p>
                    {/* Progress Bar */}
                    <div className="mt-3.5 w-full h-1.5 bg-[#e8e5d9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-950 to-[#C29F5C] rounded-full group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500" style={{ width: "94%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>
      </section>

      {/* PORTFOLIO WORK ZONE & ABDULLAH'S FILE-TO-BASE64 CUSTOMIZER */}
      <section id="portfolio" className="bg-[#ECEAE1] py-16 px-6 border-b border-emerald-950/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase block">LIVE WEB APPLICATIONS</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-emerald-950 tracking-tight mt-1">
                Portfolio Showcase
              </h2>
              <p className="text-xs text-emerald-950/70 mt-1">
                Interact with layouts and add your own screenshot mockups dynamically!
              </p>
            </div>

            {/* Filter segmented controller & Customizer buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 bg-white p-1 rounded-xl border border-emerald-950/5">
                {["All", "Frontend", "Full-Stack", "E-Commerce", "UI/UX", "APIs"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-[11px] font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                      activeCategory === cat 
                        ? "bg-emerald-950 text-white shadow-sm" 
                        : "text-emerald-950/60 hover:text-emerald-950"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Custmizer Launcher Action */}
              <button
                onClick={handleOpenNewProject}
                className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-[11px] tracking-wider px-4 py-2.5 rounded-xl uppercase flex items-center gap-1.5 cursor-pointer shadow-md transition-all scale-102 hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Website & Image
              </button>
            </div>
          </div>

          {/* Dynamic Grid Layout showing projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedProject(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-emerald-950/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer flex flex-col"
              >
                
                {/* Text Details Header on Top */}
                <div className="p-4 flex items-center justify-between bg-white border-b border-emerald-950/5">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-emerald-950 truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-950/50 mt-1 font-semibold">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.year}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {item.websiteUrl ? (
                      <div className="flex items-center gap-1">
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          title="Open Live Website in New Tab"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        <button
                          onClick={() => {
                            const newUrl = prompt("Paste or type the website URL for this project:", item.websiteUrl || "");
                            if (newUrl !== null) {
                              const cleanUrl = newUrl.trim();
                              const updated = projects.map(p => {
                                if (p.id === item.id) {
                                  return { ...p, websiteUrl: cleanUrl || undefined };
                                }
                                return p;
                              });
                              setProjects(updated);
                              localStorage.setItem("abdullah_portfolio_items", JSON.stringify(updated));
                              if (selectedProject?.id === item.id) {
                                setSelectedProject(prev => prev ? { ...prev, websiteUrl: cleanUrl || undefined } : null);
                              }
                              triggerToast("Website URL link updated successfully!", "success");
                            }
                          }}
                          className="text-[10px] font-bold text-emerald-950/60 hover:text-emerald-950 p-1 bg-emerald-950/5 hover:bg-emerald-950/10 rounded-md transition-all cursor-pointer"
                          title="Edit Website URL Link"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          const newUrl = prompt("Paste or type the website URL for this project:", "");
                          if (newUrl !== null) {
                            const cleanUrl = newUrl.trim();
                            const updated = projects.map(p => {
                              if (p.id === item.id) {
                                return { ...p, websiteUrl: cleanUrl || undefined };
                              }
                              return p;
                            });
                            setProjects(updated);
                            localStorage.setItem("abdullah_portfolio_items", JSON.stringify(updated));
                            if (selectedProject?.id === item.id) {
                              setSelectedProject(prev => prev ? { ...prev, websiteUrl: cleanUrl || undefined } : null);
                            }
                            triggerToast("Website URL link updated successfully!", "success");
                          }
                        }}
                        className="text-[9px] font-extrabold text-emerald-950/80 hover:text-white flex items-center gap-1 bg-amber-500 hover:bg-emerald-950 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-sm"
                        title="Paste or Change Project Link"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Paste Link</span>
                      </button>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Project Image Box below the details */}
                <div className="aspect-[4/3] bg-emerald-950 overflow-hidden relative flex-1">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Live Website Badge */}
                  {item.websiteUrl && (
                    <a
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 left-3 z-30 bg-emerald-950/90 hover:bg-amber-500 hover:text-emerald-950 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition-all border border-white/10 hover:scale-105"
                      title={`Visit Live Website: ${item.websiteUrl}`}
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Site</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </a>
                  )}

                  <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white text-emerald-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Change Image / Edit Project button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditProject(item);
                    }}
                    className="absolute top-3 right-12 z-30 bg-emerald-950/90 hover:bg-amber-500 hover:text-emerald-950 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer shadow-md border border-white/10 hover:scale-105"
                    title="Change Image or Website Link"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Absolute delete button overlay visible to Abdullah */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(item.id);
                    }}
                    className="absolute top-3 right-3 z-30 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                    title="Delete Project item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Reset projects utility helper */}
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-emerald-950/60 italic leading-relaxed">
              * Click any card to expand full specs, or click "Live Site" to open the project directly. Use "Add Website & Image" to add links and automatically capture homepage screenshots!
            </p>
            <button
              onClick={handleResetProjects}
              className="text-[10px] tracking-widest uppercase font-bold text-emerald-950/45 hover:text-emerald-950 transition-colors"
            >
              Reset Portfolio Grid to Default Demos
            </button>
          </div>

        </div>
      </section>

      {/* ESTIMATOR & CLIENT DASHBOARD */}
      <section id="estimator" className="bg-[#F4F4F0] py-16 px-6 border-b border-emerald-950/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase block">
              DYNAMIC ESTIMATOR & QUEUE CONSOLE
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-950 mt-2 tracking-tight">
              Web Architecture Planner
            </h2>
            <p className="text-xs lg:text-sm text-emerald-950/70 mt-3 max-w-lg mx-auto leading-relaxed">
              Plan your development milestones, estimate standard package budgets, and submit requests to trace your project progress in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Price Calculator (Col-span-7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-lg border border-emerald-950/5 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-emerald-950/5">
                  <Sliders className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xs font-bold text-emerald-950 tracking-wider uppercase">
                    1. Plan Layout Requirements & Estimator
                  </h3>
                </div>

                <form onSubmit={handleCreateProposal} className="space-y-5">
                  
                  {/* Service selector buttons */}
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-2">
                      SELECT WORK CATEGORY
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Frontend Page",
                        "Full-Stack SaaS",
                        "E-Commerce Store",
                        "API Setup",
                        "UI/UX Prototyping"
                      ].map((serv) => (
                        <button
                          key={serv}
                          type="button"
                          onClick={() => setEstimatorService(serv)}
                          className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold tracking-wider text-center transition-all cursor-pointer ${
                            estimatorService === serv 
                              ? "bg-emerald-950 text-white border-emerald-950 shadow-sm" 
                              : "bg-[#F4F4F0] border-emerald-950/5 text-emerald-950/70 hover:bg-[#ECEAE1]"
                          }`}
                        >
                          {serv}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range Layout Slider */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-2">
                        PAGES / SUITE ENDPOINTS ({estimatorPages})
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="8" 
                        value={estimatorPages}
                        onChange={(e) => setEstimatorPages(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#ECEAE1] rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[9px] text-emerald-950/45 font-semibold mt-1">
                        <span>1 Concept Layout</span>
                        <span>4 Pages</span>
                        <span>8 Enterprise (Max)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-2">
                        PRIORITY DELIVERY
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEstimatorTurnaround("Standard")}
                          className={`py-2 rounded-xl border text-[11px] font-bold tracking-wider text-center transition-all cursor-pointer ${
                            estimatorTurnaround === "Standard" 
                              ? "bg-emerald-950 text-white border-emerald-950" 
                              : "bg-[#F4F4F0] border-emerald-950/5 text-emerald-950/70"
                          }`}
                        >
                          Standard Setup
                        </button>
                        <button
                          type="button"
                          onClick={() => setEstimatorTurnaround("Express")}
                          className={`py-2 rounded-xl border text-[11px] font-bold tracking-wider text-center transition-all cursor-pointer ${
                            estimatorTurnaround === "Express" 
                              ? "bg-emerald-950 text-white border-emerald-950" 
                              : "bg-[#F4F4F0] border-emerald-950/5 text-emerald-950/70"
                          }`}
                        >
                          Express Rush (+35%)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="pt-4 border-t border-emerald-950/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                        CLIENT NAME
                      </label>
                      <input 
                        type="text" 
                        required
                        value={newProposalName}
                        onChange={(e) => setNewProposalName(e.target.value)}
                        placeholder="e.g. Mus'haf Rafiq"
                        className="w-full bg-[#F4F4F0] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                        EMAIL ADDRESS
                      </label>
                      <input 
                        type="email" 
                        required
                        value={newProposalEmail}
                        onChange={(e) => setNewProposalEmail(e.target.value)}
                        placeholder="e.g. client@agency.com"
                        className="w-full bg-[#F4F4F0] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                      BRIEF FUNCTIONAL REQUIREMENTS
                    </label>
                    <textarea 
                      rows={3}
                      value={newProposalMessage}
                      onChange={(e) => setNewProposalMessage(e.target.value)}
                      placeholder="e.g. Needs interactive auth gateway, custom graphs, responsive layout tables..."
                      className="w-full bg-[#F4F4F0] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                    ></textarea>
                  </div>

                </form>
              </div>

              {/* Estimate calculation box */}
              <div className="mt-6 bg-emerald-950 text-white p-4.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider block">
                    DYNAMIC ESTIMATE
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-amber-400 tabular-nums">${estimatorCost}</span>
                    <span className="text-xs text-slate-300">USD</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCreateProposal}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-emerald-950 font-extrabold text-[11px] tracking-wider px-5 py-3 rounded-xl uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all scale-102 hover:scale-105"
                >
                  SUBMIT TO QUEUE
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Client Tracker Panel (Col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-emerald-950/5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-950/5">
                    <Clock className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="text-xs font-bold text-emerald-950 tracking-wider uppercase">
                      2. Live Development Queue Tracker
                    </h3>
                  </div>

                  <p className="text-xs text-emerald-950/70 mb-4 leading-relaxed">
                    Search your assigned ID (try <strong className="font-mono">ABD-4432</strong> or <strong className="font-mono">ABD-9812</strong>) or submitted email to audit repository revision cycles:
                  </p>

                  <form onSubmit={handleTrackProposal} className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. ABD-4432"
                      value={searchTrackId}
                      onChange={(e) => setSearchTrackId(e.target.value)}
                      className="flex-1 bg-[#F4F4F0] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none text-emerald-950 uppercase placeholder:normal-case"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-950 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider cursor-pointer"
                    >
                      TRACK
                    </button>
                  </form>

                  {/* Render Track Result */}
                  {trackedProposalResult ? (
                    <div className="mt-4 bg-[#F4F4F0] border border-emerald-950/5 rounded-2xl p-4 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-white bg-emerald-950 px-2 py-0.5 rounded-md font-mono">
                          {trackedProposalResult.id}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-950/50 italic">
                          {trackedProposalResult.date}
                        </span>
                      </div>

                      <div className="border-t border-emerald-950/5 pt-2">
                        <h4 className="text-xs font-bold text-emerald-950">{trackedProposalResult.clientName}</h4>
                        <p className="text-[10px] text-emerald-950/55">{trackedProposalResult.clientEmail}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-950/5">
                        <div>
                          <span className="text-[9px] text-emerald-950/40 block font-bold">TYPE</span>
                          <span className="text-xs font-bold text-emerald-950">{trackedProposalResult.serviceType}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-emerald-950/40 block font-bold">ESTIMATE</span>
                          <span className="text-xs font-bold text-emerald-950">${trackedProposalResult.budget}</span>
                        </div>
                      </div>

                      {/* Timeline Bar representation */}
                      <div>
                        <span className="text-[9px] text-emerald-950/40 block font-bold mb-2">DEVELOPMENT PIPELINE</span>
                        <div className="relative flex items-center justify-between mt-3 px-1">
                          <div className="absolute left-0 right-0 top-1.5 h-[3px] bg-emerald-950/10 -z-0"></div>
                          <div className="absolute left-0 top-1.5 h-[3px] bg-amber-500 -z-0 transition-all" style={{
                            width: trackedProposalResult.status === "Reviewing" ? "10%" 
                              : trackedProposalResult.status === "Proposal Sent" ? "40%" 
                              : trackedProposalResult.status === "In Progress" ? "70%" : "100%"
                          }}></div>

                          {[
                            { label: "Brief" },
                            { label: "API Mock" },
                            { label: "Code Dev" },
                            { label: "Deploy" }
                          ].map((step, sIdx) => {
                            const isDone = (sIdx === 0) || 
                              (sIdx === 1 && ["Proposal Sent", "In Progress", "Completed"].includes(trackedProposalResult.status)) ||
                              (sIdx === 2 && ["In Progress", "Completed"].includes(trackedProposalResult.status)) ||
                              (sIdx === 3 && trackedProposalResult.status === "Completed");
                            return (
                              <div key={sIdx} className="flex flex-col items-center relative z-10">
                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
                                  isDone ? "bg-amber-500 text-emerald-950" : "bg-white border border-emerald-950/20 text-emerald-950/40"
                                }`}>
                                  {isDone ? "✓" : ""}
                                </div>
                                <span className="text-[8px] font-bold text-emerald-950/60 mt-1">{step.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dynamic Queue Status Note */}
                      <p className="text-[10px] leading-relaxed text-emerald-950 bg-white/40 p-2.5 rounded-xl border border-emerald-950/5">
                        <span className="font-bold text-amber-600 block mb-0.5">Pipeline Logs:</span>
                        {trackedProposalResult.status === "Reviewing" && "We received your requirements safely. Currently setting up repository boilerplate structures and designing system schemas."}
                        {trackedProposalResult.status === "Proposal Sent" && "Cost & layout scope mapped. Proposal sent to client queue. Awaiting milestone approval to trigger code branches."}
                        {trackedProposalResult.status === "In Progress" && "Currently active in development cycle. Reviewing responsive layout grids, compiling components, and writing test suits."}
                        {trackedProposalResult.status === "Completed" && "All components successfully compiled, passed unit tests, and pushed to production build host. Thanks for choosing Abdullah!"}
                      </p>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteProposal(trackedProposalResult.id)}
                          className="text-red-600 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <Trash2 className="w-3 h-3" />
                          REMOVE PROPOSAL
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="mt-4 bg-[#F4F4F0] border border-dashed border-emerald-950/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <Clock className="w-8 h-8 text-emerald-950/20 mb-2.5" />
                      <p className="text-[11px] font-bold text-emerald-950/50">
                        No Proposal Active
                      </p>
                      <p className="text-[9px] text-emerald-950/40 mt-1">
                        Submit a new request or search for <span className="font-bold">ABD-4432</span> to inspect sample timelines.
                      </p>
                    </div>
                  )}

                </div>

                {successMessage && (
                  <div className="p-3.5 mt-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed animate-fadeIn">
                    <span className="font-bold block">✓ Proposal Received!</span>
                    Your custom tracking code is: <strong className="font-mono underline select-all">{trackedProposalId}</strong>. Track project phases in real-time above!
                  </div>
                )}
              </div>

              {/* Developer welcome onboarding package */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/10">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 tracking-widest uppercase mb-1.5">
                      Client Welcome Package
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Planning a SaaS project? Download Abdullah's premium welcome package containing custom layout frameworks, code checklist templates, and sample agreements.
                    </p>
                    <button
                      onClick={() => triggerToast("Downloading Abdullah_Developer_Welcome_Kit_2026.pdf (Triggered safely)", "success")}
                      className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-[10px] tracking-wider px-4 py-2.5 rounded-xl uppercase flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer shadow-md"
                    >
                      DOWNLOAD KIT (PDF)
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER & SITEMAP */}
      <footer id="contact" className="bg-emerald-950 text-white pt-16 pb-12 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Bio info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                Abdullah
              </span>
              <span className="text-amber-500">
                <Sparkles className="w-5 h-5 fill-amber-500" />
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Premium client applications, Stripe integrations, dynamic CMS databases, and responsive layout architectures engineered to high commercial standards.
            </p>
            <p className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} Abdullah. All rights reserved.
            </p>
          </div>

          {/* Column 2: Tech */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">TECH SPECIALTIES</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>React & Next.js SSR</li>
              <li>Stripe E-Commerce checkout</li>
              <li>PostgreSQL database integrations</li>
              <li>API microservice proxies</li>
              <li>High Performance configurations</li>
            </ul>
          </div>

          {/* Column 3: Navigation Sitemap */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">SITEMAP</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#about" className="hover:text-amber-400">Biography</a></li>
              <li><a href="#services" className="hover:text-amber-400">Specialties</a></li>
              <li><a href="#portfolio" className="hover:text-amber-400">Mockups</a></li>
              <li><a href="#estimator" className="hover:text-amber-400">Estimator</a></li>
            </ul>
          </div>

          {/* Column 4: Location details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">GET IN TOUCH</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Pakistan</span>
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <a href="mailto:abdullah.dev.pro@gmail.com" className="hover:text-amber-500">abdullah.dev.pro@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Available for Projects</span>
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 pb-4 text-center">
          <p className="font-serif text-lg md:text-xl text-white tracking-wide">
            ✦ Let's Build <span className="font-serif italic text-amber-400 ml-1">Your Application</span> Together. ✦
          </p>
        </div>
      </footer>

      {/* --- MOCKUP EXPANSION LIGHTBOX OVERLAY --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative bg-white text-emerald-950 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#ECEAE1] text-emerald-950 hover:bg-emerald-950 hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Text Meta Column - Renders first on mobile, right side on desktop */}
              <div className="md:col-span-5 p-6 lg:p-8 flex flex-col justify-between md:order-2">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">
                      {selectedProject.category}
                    </span>
                    <span className="text-emerald-950/20 text-xs">•</span>
                    <span className="text-[10px] font-bold text-emerald-950/50 tracking-widest uppercase font-mono">
                      {selectedProject.year}
                    </span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-emerald-950 mb-4 leading-tight">
                    {selectedProject.title}
                  </h3>

                  <p className="text-xs text-emerald-950/75 leading-relaxed font-normal mb-6">
                    {selectedProject.description}
                  </p>

                  {/* Project Details */}
                  <div className="border-t border-emerald-950/5 pt-4 mb-6">
                    <span className="text-[10px] text-emerald-950/40 block font-bold uppercase mb-2">
                      CLIENT SYSTEM CREDITS
                    </span>
                    <p className="text-xs font-bold text-emerald-950">
                      {selectedProject.client}
                    </p>
                  </div>

                  {/* Deliverables checklist */}
                  <div className="border-t border-emerald-950/5 pt-4">
                    <span className="text-[10px] text-emerald-950/40 block font-bold uppercase mb-3">
                      DELIVERABLES COMMITTED
                    </span>
                    <div className="space-y-2">
                      {selectedProject.deliverables.map((del, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />
                          <span className="text-xs font-semibold text-emerald-950/85">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Live Website link block */}
                  {selectedProject.websiteUrl && (
                    <div className="border-t border-emerald-950/5 pt-4">
                      <span className="text-[10px] text-emerald-950/40 block font-bold uppercase mb-2">
                        LIVE HOMEPAGE & APPLICATION
                      </span>
                      <a 
                        href={selectedProject.websiteUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-xl transition-all border border-amber-500/20"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{selectedProject.websiteUrl}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-emerald-950/5 flex flex-wrap gap-2.5">
                  {selectedProject.websiteUrl ? (
                    <a
                      href={selectedProject.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[140px] bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase text-center cursor-pointer shadow hover:scale-101 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Globe className="w-4 h-4" />
                      <span>VISIT LIVE WEBSITE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        setIsContactModalOpen(true);
                      }}
                      className="flex-1 min-w-[140px] bg-emerald-950 hover:bg-emerald-900 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-center cursor-pointer shadow hover:scale-101 transition-all"
                    >
                      INQUIRE WORK
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const projToEdit = selectedProject;
                      setSelectedProject(null);
                      handleOpenEditProject(projToEdit);
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-emerald-950/15 hover:bg-emerald-950/5 text-emerald-950 text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Change image or website link for this project"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Change</span>
                  </button>
                  <button
                    onClick={() => triggerToast(`Custom blueprint checklist download started for: ${selectedProject.title}`, "success")}
                    className="px-3 py-2.5 rounded-xl border border-emerald-950/10 hover:bg-emerald-950/5 text-emerald-950 text-xs font-bold uppercase flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image Column - Renders second on mobile, left side on desktop */}
              <div className="md:col-span-7 bg-[#ECEAE1] relative overflow-hidden flex items-center justify-center p-6 md:p-10 border-t md:border-t-0 md:border-r border-emerald-950/5 min-h-[300px] md:order-1">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- ABDULLAH'S IMAGE UPLOADER / CUSTOMIZER PANEL MODAL --- */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative bg-[#F4F4F0] text-emerald-950 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-950/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header banner */}
            <div className="bg-emerald-950 text-white p-6 relative">
              <button
                onClick={() => setIsCustomizerOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase block mb-1">
                PORTFOLIO MEDIA & LINK MANAGER
              </span>
              <h3 className="text-xl lg:text-2xl font-serif font-bold">
                {editingProject ? "Update Project & Website Link" : "Add Website Project"}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Enter your live website URL to automatically display its live homepage image, or upload custom screenshots!
              </p>
            </div>

            {/* Customizer Upload Form */}
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  PROJECT TITLE
                </label>
                <input 
                  type="text" 
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Dynamic SaaS Web Platform"
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                />
              </div>

              {/* WEBSITE LINK / LIVE URL INPUT WITH HOMEPAGE SCREENSHOT FETCHER */}
              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>WEBSITE LINK (LIVE URL)</span>
                  <span className="text-amber-600 font-bold lowercase text-[10px]">auto-fetches homepage image</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-950/40" />
                    <input 
                      type="url" 
                      value={newProjUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setNewProjUrl(url);
                        // If user types or pastes a valid URL and hasn't uploaded a custom base64 image, auto-preview homepage
                        if (url.trim().length > 7 && !newProjImg.startsWith("data:")) {
                          const screen = getWebsiteScreenshotUrl(url);
                          setNewProjImg(screen);
                        }
                      }}
                      placeholder="https://example.com"
                      className="w-full bg-[#ECEAE1] border border-emerald-950/5 pl-9 pr-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFetchHomepageScreenshot(newProjUrl)}
                    className="bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold text-[10px] tracking-wider px-3.5 py-2.5 rounded-xl uppercase flex items-center gap-1.5 shrink-0 shadow cursor-pointer transition-all hover:scale-102"
                    title="Capture and show live homepage screenshot of this website"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Fetch Homepage</span>
                  </button>
                </div>
                <p className="text-[9px] text-emerald-950/55 mt-1">
                  🌐 Enter any website link. The image below will automatically show the live homepage of that website!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                    WORK CATEGORY
                  </label>
                  <select
                    value={newProjCat}
                    onChange={(e) => setNewProjCat(e.target.value as any)}
                    className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="APIs">APIs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                    DEVELOPMENT YEAR
                  </label>
                  <input 
                    type="text" 
                    value={newProjYear}
                    onChange={(e) => setNewProjYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & HOMEPAGE PREVIEW BOX */}
              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>PROJECT IMAGE (HOMEPAGE PREVIEW)</span>
                  {newProjImg && (
                    <button
                      type="button"
                      onClick={() => setNewProjImg("")}
                      className="text-red-600 hover:text-red-700 text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Clear Image
                    </button>
                  )}
                </label>
                <div className="bg-[#ECEAE1] border border-dashed border-emerald-950/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  {newProjImg ? (
                    <div className="w-full space-y-3">
                      <div className="aspect-[16/9] w-full max-h-48 rounded-xl overflow-hidden border border-emerald-950/10 shadow-sm relative group bg-emerald-950">
                        <img 
                          src={newProjImg} 
                          alt="Homepage Preview" 
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/85 backdrop-blur-sm text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            {newProjImg.includes("mshots") ? "Website Homepage Screenshot Active" : "Image Loaded"}
                          </span>
                          {newProjUrl && (
                            <span className="text-amber-400 truncate max-w-[140px]">{newProjUrl}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden" 
                          id="project-image-file"
                        />
                        <label 
                          htmlFor="project-image-file"
                          className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-[10px] tracking-wider px-3.5 py-2 rounded-lg uppercase cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Upload Different Image
                        </label>
                        {newProjUrl && (
                          <button
                            type="button"
                            onClick={() => handleFetchHomepageScreenshot(newProjUrl)}
                            className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-[10px] tracking-wider px-3 py-2 rounded-lg uppercase flex items-center gap-1 cursor-pointer shadow"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Refresh Website Screenshot
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden" 
                        id="project-image-file"
                      />
                      <label 
                        htmlFor="project-image-file"
                        className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-[10px] tracking-wider px-3.5 py-2 rounded-lg uppercase cursor-pointer inline-flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Select Local Image File
                      </label>
                      <p className="text-[10px] text-emerald-950/60 mt-2 font-medium">
                        Or enter a Website Link above to automatically render its live homepage screenshot!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  CLIENT / CREDIT NAME
                </label>
                <input 
                  type="text" 
                  value={newProjClient}
                  onChange={(e) => setNewProjClient(e.target.value)}
                  placeholder="e.g. Horizon Labs"
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  PROJECT SPECIFICATIONS / DETAILS
                </label>
                <textarea 
                  rows={3}
                  required
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Explain system details, API routes, database structures..."
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  DELIVERABLES (COMMA SEPARATED)
                </label>
                <input 
                  type="text" 
                  value={newProjDeliverables}
                  onChange={(e) => setNewProjDeliverables(e.target.value)}
                  placeholder="e.g. Express Route, Unit Tests, Tailwind Grid"
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                />
              </div>

              <div className="border-t border-emerald-950/10 pt-4 mt-2">
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  WHATSAPP CHAT PHONE NUMBER
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={whatsappNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
                      setWhatsappNumber(val);
                      localStorage.setItem("abdullah_whatsapp", val);
                    }}
                    placeholder="e.g. 923000000000"
                    className="flex-1 bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                  />
                  <button
                    type="button"
                    onClick={() => triggerToast(`WhatsApp number saved: +${whatsappNumber}`, "success")}
                    className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    SAVE
                  </button>
                </div>
                <p className="text-[9px] text-emerald-950/40 mt-1 leading-normal">
                  Include country code (e.g. 92 for Pakistan) and do not write any + or space symbols.
                </p>
              </div>

              {/* High-fidelity Circular Logo Social Media Config fields (GitHub, LinkedIn, WordPress) */}
              <div className="border-t border-emerald-950/10 pt-4 mt-2">
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>SOCIAL PROFILES CONFIG (CONNECTED LOGOS)</span>
                  <button 
                    type="button"
                    onClick={() => triggerToast("All social profile coordinates synced successfully!", "success")}
                    className="text-amber-600 font-bold uppercase text-[9px] hover:underline"
                  >
                    Sync All
                  </button>
                </label>
                
                <div className="space-y-3">
                  {/* GitHub Config */}
                  <div>
                    <label className="block text-[9px] font-bold text-emerald-950/40 uppercase mb-1">
                      GITHUB PROFILE (URL & DISPLAY HANDLE)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={githubUrl}
                        onChange={(e) => {
                          setGithubUrl(e.target.value);
                          localStorage.setItem("abdullah_github_url", e.target.value);
                        }}
                        placeholder="https://github.com/your-username"
                        className="flex-1 bg-[#ECEAE1] border border-emerald-950/5 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                      <input 
                        type="text" 
                        value={githubUsername}
                        onChange={(e) => {
                          setGithubUsername(e.target.value);
                          localStorage.setItem("abdullah_github_user", e.target.value);
                        }}
                        placeholder="github.com/your-username"
                        className="w-1/3 bg-[#ECEAE1] border border-emerald-950/5 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                    </div>
                  </div>

                  {/* LinkedIn Config */}
                  <div>
                    <label className="block text-[9px] font-bold text-emerald-950/40 uppercase mb-1">
                      LINKEDIN PROFILE (URL & DISPLAY HANDLE)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={linkedinUrl}
                        onChange={(e) => {
                          setLinkedinUrl(e.target.value);
                          localStorage.setItem("abdullah_linkedin_url", e.target.value);
                        }}
                        placeholder="https://linkedin.com/in/your-username"
                        className="flex-1 bg-[#ECEAE1] border border-emerald-950/5 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                      <input 
                        type="text" 
                        value={linkedinUsername}
                        onChange={(e) => {
                          setLinkedinUsername(e.target.value);
                          localStorage.setItem("abdullah_linkedin_user", e.target.value);
                        }}
                        placeholder="linkedin.com/in/your-username"
                        className="w-1/3 bg-[#ECEAE1] border border-emerald-950/5 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                    </div>
                  </div>

                  {/* WordPress Config */}
                  <div>
                    <label className="block text-[9px] font-bold text-emerald-950/40 uppercase mb-1">
                      WORDPRESS SITE (URL & DISPLAY DOMAIN)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={wordpressUrl}
                        onChange={(e) => {
                          setWordPressUrl(e.target.value);
                          localStorage.setItem("abdullah_wordpress_url", e.target.value);
                        }}
                        placeholder="https://your-wordpress-site.org"
                        className="flex-1 bg-[#ECEAE1] border border-emerald-950/5 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                      <input 
                        type="text" 
                        value={wordpressUsername}
                        onChange={(e) => {
                          setWordPressUsername(e.target.value);
                          localStorage.setItem("abdullah_wordpress_user", e.target.value);
                        }}
                        placeholder="yourdomain.org"
                        className="w-1/3 bg-[#ECEAE1] border border-emerald-950/5 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomizerOpen(false)}
                  className="flex-1 bg-white border border-emerald-950/15 text-emerald-950 text-xs font-bold py-3 rounded-xl uppercase hover:bg-emerald-950/5"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer text-center"
                >
                  {editingProject ? "SAVE CHANGES & UPDATE" : "ADD PROJECT"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- CONTACT MODAL --- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative bg-[#F4F4F0] text-emerald-950 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-950/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-emerald-950 text-white p-6 relative">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase block mb-1">
                LET'S CONSTRUCT OUTSTANDING SOFTWARE
              </span>
              <h3 className="text-xl lg:text-2xl font-serif font-bold">
                Let's Work!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Have an ambitious web application layout or backend system integration in mind? Submit your contact coordinates. Abdullah will get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleCreateProposal} className="p-6 space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  YOUR NAME
                </label>
                <input 
                  type="text" 
                  required
                  value={newProposalName}
                  onChange={(e) => setNewProposalName(e.target.value)}
                  placeholder="e.g. Mus'haf Rafiq"
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input 
                  type="email" 
                  required
                  value={newProposalEmail}
                  onChange={(e) => setNewProposalEmail(e.target.value)}
                  placeholder="e.g. client@agency.com"
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  WHAT ARE YOU PLANNING TO CONSTRUCT?
                </label>
                <select 
                  value={estimatorService}
                  onChange={(e) => setEstimatorService(e.target.value)}
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                >
                  <option value="Frontend Page">Frontend Page Layout</option>
                  <option value="Full-Stack SaaS">Full-Stack SaaS Setup</option>
                  <option value="E-Commerce Store">E-Commerce Checkout Suite</option>
                  <option value="API Setup">Microservice API Setup</option>
                  <option value="UI/UX Prototyping">UI/UX Layout Prototyping</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-emerald-950/50 uppercase tracking-wider mb-1.5">
                  DETAILED BRIEF / NOTES
                </label>
                <textarea 
                  rows={4}
                  required
                  value={newProposalMessage}
                  onChange={(e) => setNewProposalMessage(e.target.value)}
                  placeholder="Outline key functions, API layouts, color ideas, timeline expectations..."
                  className="w-full bg-[#ECEAE1] border border-emerald-950/5 px-4 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                ></textarea>
              </div>

              <div className="bg-emerald-950 text-white p-4 rounded-2xl flex items-center justify-between shadow">
                <div>
                  <span className="text-[9px] text-amber-400 block font-bold uppercase tracking-wider">
                    BUDGET DYNAMIC ESTIMATE
                  </span>
                  <span className="text-xl font-black text-amber-400 tabular-nums">
                    ${estimatorCost} USD
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs tracking-wider px-5 py-2.5 rounded-xl uppercase flex items-center gap-2 shadow"
                >
                  SEND PROPOSAL
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- SKILLS / EXPERTISE MODAL --- */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative bg-white text-emerald-950 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-950/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header banner */}
            <div className="bg-emerald-950 text-white p-6 relative">
              <button
                onClick={() => setIsSkillsModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1">
                <Laptop className="w-4 h-4 text-amber-400" />
                PROFESSIONAL SKILLS PORTFOLIO
              </div>
              <h3 className="text-2xl font-serif font-bold">
                Abdullah's Technical Stack
              </h3>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Expertise in modern web frontend, database design, and API microservices
              </p>
            </div>

            {/* Content Viewport */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6 text-left">
              
              {/* Dynamic Skills Checklist */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-3.5">
                  Dynamic Engineering Skills
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 p-2.5 bg-[#F4F4F0] rounded-xl border border-emerald-950/5 group/modal-skill">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="text-xs font-semibold text-emerald-950 truncate">{skill}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-500/10 cursor-pointer opacity-0 group-hover/modal-skill:opacity-100 transition-opacity"
                        title={`Delete ${skill}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Inline Adder inside Modal */}
                <form onSubmit={handleAddSkill} className="mt-4 flex gap-2">
                  <input 
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    placeholder="Add custom skill (e.g. NextJS)..."
                    className="flex-1 bg-[#F4F4F0] border border-emerald-950/5 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-emerald-950"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    + ADD
                  </button>
                </form>

                {/* Suggested presets inside modal */}
                <div className="mt-5 pt-4 border-t border-emerald-950/10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-extrabold text-[#0D2C1D]/60 uppercase tracking-wider">
                      ⚡ Quick Web Developer Stack Presets:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const webDevStack = [
                          "React & Next.js SSR",
                          "HTML5 & CSS3 Layouts",
                          "Tailwind CSS Utility",
                          "JavaScript (ES6+)",
                          "TypeScript Typed",
                          "Node.js & Express APIs",
                          "PostgreSQL Database",
                          "MongoDB NoSQL",
                          "WordPress Customization",
                          "REST & GraphQL APIs",
                          "Git & GitHub Versioning",
                          "CI/CD Cloud Deployment"
                        ];
                        setSkills(webDevStack);
                        localStorage.setItem("abdullah_skills", JSON.stringify(webDevStack));
                        triggerToast("Full Web Developer Stack loaded successfully!", "success");
                      }}
                      className="text-[10px] font-extrabold text-amber-600 hover:text-amber-700 uppercase tracking-wider cursor-pointer hover:underline flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg transition-colors"
                    >
                      ⚡ Load Web Developer Stack
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "React & Next.js SSR",
                      "Tailwind CSS Utility",
                      "TypeScript Typed",
                      "Node.js & Express APIs",
                      "PostgreSQL Database",
                      "WordPress Customization",
                      "REST & GraphQL APIs",
                      "Git & GitHub Versioning"
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (skills.includes(tag)) {
                            triggerToast(`"${tag}" is already added!`, "info");
                            return;
                          }
                          const updated = [...skills, tag];
                          setSkills(updated);
                          localStorage.setItem("abdullah_skills", JSON.stringify(updated));
                          triggerToast(`Added preset skill: ${tag}`, "success");
                        }}
                        className="text-[10px] font-bold text-emerald-950 bg-[#F4F4F0] hover:bg-amber-500 hover:text-emerald-950 px-2.5 py-1.5 rounded-xl border border-emerald-950/5 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Technologies & Proficiency levels */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-3.5">
                  Tech Proficiency Levels
                </h4>
                <div className="space-y-3">
                  {[
                    { name: "React SPA Development", rating: "96%", desc: "Expert in hook patterns, state lifecycle, Context API, and heavy modular component visual architectures." },
                    { name: "Next.js & SSR Engines", rating: "92%", desc: "Advanced server routing structures, secure server-actions implementation, and high Lighthouse speed audits." },
                    { name: "TypeScript Typed Architecture", rating: "94%", desc: "Designing bulletproof static type interfaces and safe DB schema mappings for stable applications." },
                    { name: "Tailwind CSS Fluid Layouts", rating: "98%", desc: "Utility styling, fully responsive zero-pixel layouts, dark mode switches, and elegant visual spacing configurations." },
                    { name: "Node.js & Microservice APIs", rating: "90%", desc: "Secure proxy routing, request rate-limit defenses, standard CORS validations, and encrypted JWT tokens." }
                  ].map((tech, idx) => (
                    <div key={idx} className="bg-[#F4F4F0] p-3 rounded-2xl border border-emerald-950/5 text-xs">
                      <div className="flex justify-between items-center font-bold text-emerald-950">
                        <span>{tech.name}</span>
                        <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">{tech.rating}</span>
                      </div>
                      <p className="text-[11px] text-emerald-950/65 mt-1 leading-normal font-normal">{tech.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer containing massive green WhatsApp message button */}
            <div className="bg-[#F4F4F0] p-6 border-t border-emerald-950/10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-950">Hire Abdullah for your next project!</p>
                  <p className="text-[10px] text-emerald-950/50">Send an instant WhatsApp text with your project draft details.</p>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi%20Abdullah,%20I%20reviewed%20your%20skills%20on%20your%20skills%20page%20and%20would%20love%20to%20discuss%20a%20project%20together!`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd59] text-white font-extrabold text-xs py-3 px-6 rounded-xl uppercase flex items-center justify-center gap-2 shadow-md hover:scale-103 transition-transform"
                >
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.502 1.157 3.473L6.5 19.5l4.241-.922c.942.457 2.001.718 3.121.718 3.18 0 5.766-2.586 5.767-5.766.002-3.181-2.584-5.766-5.767-5.766L12.031 6.172zm3.896 8.354c-.161.453-.836.852-1.242.903-.361.045-.815.064-1.332-.102-.324-.104-.737-.258-1.258-.484-2.221-.962-3.649-3.21-3.76-3.359-.111-.148-.901-1.2-1.01-2.35-.11-1.15.485-1.742.727-1.984.242-.242.53-.303.707-.303.177 0 .354.002.508.01.161.008.379-.062.593.454.222.535.758 1.848.824 1.98.066.132.11.286.022.463-.088.177-.132.286-.264.44l-.396.484c-.132.154-.27.32-.116.583.154.264.685 1.129 1.47 1.83.992.887 1.826 1.16 2.09 1.292.264.132.418.11.572-.066.154-.176.66-.77.836-1.035.176-.264.352-.22.595-.132.242.088 1.542.727 1.806.859.264.132.44.198.506.309.066.111.066.64-.095 1.093z"/>
                  </svg>
                  MESSAGE ON WHATSAPP
                </a>
              </div>
              <button
                type="button"
                onClick={() => setIsSkillsModalOpen(false)}
                className="w-full bg-white border border-emerald-950/15 text-emerald-950 text-xs font-bold py-2.5 rounded-xl uppercase hover:bg-emerald-950/5 cursor-pointer text-center"
              >
                CLOSE VIEW
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- CV / RESUME MODAL --- */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative bg-white text-emerald-950 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-950/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header banner */}
            <div className="bg-emerald-950 text-white p-6 relative">
              <button
                onClick={() => setIsCvModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-1">
                <FileText className="w-4 h-4 text-amber-400" />
                PROFESSIONAL CURRICULUM VITAE
              </div>
              <h3 className="text-2xl font-serif font-bold">
                Abdullah
              </h3>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
                Lead Full-Stack Web Developer & Solutions Architect
              </p>
            </div>

            {/* CV content scrolling viewport */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6 text-left">
              
              {/* Profile / Summary Section */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-2.5">
                  Professional Summary
                </h4>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Highly efficient and results-driven Full-Stack Web Developer with a strong track record of designing, building, and launching high-performance SaaS engines, dynamic custom marketplaces, and secure rate-limited API systems. Expert in React.js, Next.js, and TypeScript, with extensive knowledge of clean layout styling utilizing Tailwind CSS and scalable backend schemas. Committed to producing pristine, production-grade applications that guarantee high uptime and conversion success.
                </p>
              </div>

              {/* Technical Proficiencies */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-2.5">
                  Technical Core Skills
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>React & Next.js (SSR / SPA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>TypeScript Typed Architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>Tailwind CSS Bespoke Layouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>Node.js, Express & REST APIs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>PostgreSQL & Relational DBs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    <span>Stripe Webhook Commerce</span>
                  </div>
                </div>
              </div>

              {/* Professional History */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-3.5">
                  Work Experience
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-extrabold text-emerald-950">Lead Full-Stack Web Architect</h5>
                      <span className="text-[10px] font-bold text-emerald-950/50">2024 - PRESENT</span>
                    </div>
                    <p className="text-[10px] text-amber-600 font-bold uppercase mt-0.5">Freelance & Remote Solutions</p>
                    <ul className="list-disc pl-4 mt-1.5 text-[11px] text-emerald-950/75 space-y-1">
                      <li>Designed and successfully launched 5+ premium multi-tier enterprise SaaS dashboards.</li>
                      <li>Implemented JWT authorization controllers and optimized database pre-fetch functions for zero loading lags.</li>
                      <li>Engineered client e-commerce platforms handling Stripe payments securely with 100% data integrity.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-extrabold text-emerald-950">Frontend Developer & Designer</h5>
                      <span className="text-[10px] font-bold text-emerald-950/50">2022 - 2024</span>
                    </div>
                    <p className="text-[10px] text-amber-600 font-bold uppercase mt-0.5">Vivid Softworks, Agency</p>
                    <ul className="list-disc pl-4 mt-1.5 text-[11px] text-emerald-950/75 space-y-1">
                      <li>Created modular design systems on top of Tailwind CSS for fast visual deployments.</li>
                      <li>Wrote standard unit test configurations and resolved cross-browser layout discrepancies.</li>
                      <li>Cooperated in Figma UI/UX translation phases to boost user experience and visual alignment.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Key Achievements */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-2.5">
                  Major System Highlights
                </h4>
                <div className="space-y-2 text-xs">
                  <p className="text-[11px] text-emerald-950/85">
                    <strong>Nova SaaS:</strong> Compiled responsive layout graphics and secured microservice proxy endpoints with 99.8% client uptime.
                  </p>
                  <p className="text-[11px] text-emerald-950/85">
                    <strong>Zenith Clothing:</strong> Multi-cart state management engine featuring real-time local cache syncing and smooth animation triggers.
                  </p>
                </div>
              </div>

              {/* Contact / Coordinates */}
              <div>
                <h4 className="text-xs font-bold text-amber-600 tracking-wider uppercase border-b border-emerald-950/10 pb-1.5 mb-2.5">
                  Contact Coordinates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-emerald-950/80">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    <span>abdullah.dev.pro@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pakistan (Remote / Worldwide)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer download actions */}
            <div className="bg-[#F4F4F0] p-6 border-t border-emerald-950/10 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCvModalOpen(false)}
                className="flex-1 bg-white border border-emerald-950/15 text-emerald-950 text-xs font-bold py-3 rounded-xl uppercase hover:bg-emerald-950/5 cursor-pointer text-center"
              >
                CLOSE CV
              </button>
              <button
                type="button"
                onClick={() => triggerToast("CV Download Triggered successfully! Abdullah_Resume_FullStack.pdf is ready.", "success")}
                className="flex-1 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4 text-amber-400" />
                DOWNLOAD CV
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- FLOATING TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950 text-white border border-amber-500/20 px-5 py-4 rounded-2xl shadow-2xl animate-slideUp max-w-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-amber-400">NOTIFICATION</p>
            <p className="text-xs text-white/95 font-medium mt-0.5">{toast.text}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="ml-4 text-white/50 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* --- SCROLL TO TOP FLOATING BUTTON --- */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 bg-amber-500 hover:bg-amber-600 text-emerald-950 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border border-emerald-950/10 focus:outline-none"
          title="Scroll back to top"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5 stroke-[3]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}

      {/* --- FLOATING WHATSAPP CHAT FAB --- */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-6 z-40 bg-[#25D366] hover:bg-[#1ebd59] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-emerald-950/10"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-6.5 h-6.5 fill-current">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.502 1.157 3.473L6.5 19.5l4.241-.922c.942.457 2.001.718 3.121.718 3.18 0 5.766-2.586 5.767-5.766.002-3.181-2.584-5.766-5.767-5.766L12.031 6.172zm3.896 8.354c-.161.453-.836.852-1.242.903-.361.045-.815.064-1.332-.102-.324-.104-.737-.258-1.258-.484-2.221-.962-3.649-3.21-3.76-3.359-.111-.148-.901-1.2-1.01-2.35-.11-1.15.485-1.742.727-1.984.242-.242.53-.303.707-.303.177 0 .354.002.508.01.161.008.379-.062.593.454.222.535.758 1.848.824 1.98.066.132.11.286.022.463-.088.177-.132.286-.264.44l-.396.484c-.132.154-.27.32-.116.583.154.264.685 1.129 1.47 1.83.992.887 1.826 1.16 2.09 1.292.264.132.418.11.572-.066.154-.176.66-.77.836-1.035.176-.264.352-.22.595-.132.242.088 1.542.727 1.806.859.264.132.44.198.506.309.066.111.066.64-.095 1.093z"/>
        </svg>
      </a>

    </div>
  );
}
