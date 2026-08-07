"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Library,
  Plus,
  Search,
  Book,
  FileText,
  Edit,
  Trash2,
  DollarSign,
  Loader2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth";
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  uploadMaterialFile,
  TutorMaterial,
} from "@/services/materials";

export default function InstructorMaterialsPage() {
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<TutorMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<TutorMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    fileUrl: "",
    coverImageUrl: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE_MB = 100;

  useEffect(() => {
    if (user?.id) {
      fetchMaterials();
    }
  }, [user?.id]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials({ tutorId: user?.id });
      setMaterials(data);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? m.isActive : !m.isActive;
    return matchesSearch && matchesStatus;
  });

  const resetFileState = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
    setIsDragging(false);
  };

  const openAddModal = () => {
    setEditingMaterial(null);
    resetFileState();
    setFormData({
      title: "",
      description: "",
      price: "",
      fileUrl: "",
      coverImageUrl: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (material: TutorMaterial) => {
    setEditingMaterial(material);
    resetFileState();
    setFormData({
      title: material.title,
      description: material.description,
      price: (material.price / 100).toString(),
      fileUrl: material.fileUrl,
      coverImageUrl: material.coverImageUrl || "",
      isActive: material.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large. Max allowed size is ${MAX_FILE_SIZE_MB}MB. Your file: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadMaterialFile(file, (pct) => setUploadProgress(pct));
      setFormData((prev) => ({ ...prev, fileUrl: result.url }));
      setUploadSuccess(true);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || "Upload failed. Please try again.");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Failed to delete material:", error);
      alert("Failed to delete material.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      alert("Please fill in the title, description, and price.");
      return;
    }
    if (!formData.fileUrl) {
      alert("Please upload a file or enter a file URL before saving.");
      return;
    }
    if (isUploading) {
      alert("Please wait for the file upload to complete.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100), // convert dollars to cents
        fileUrl: formData.fileUrl,
        coverImageUrl: formData.coverImageUrl || undefined,
        isActive: formData.isActive,
      };

      if (editingMaterial) {
        const updated = await updateMaterial(editingMaterial._id, payload);
        setMaterials((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      } else {
        const created = await createMaterial(payload);
        setMaterials([created, ...materials]);
      }

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save material:", error);
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Failed to save material. Backend error: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Materials & Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your digital products, PDFs, and books available for students to purchase.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Material
        </button>
      </div>

      {/* Stats/Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <div className="col-span-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="w-full h-12 px-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium cursor-pointer appearance-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem top 50%",
              backgroundSize: "0.65rem auto"
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Hidden Only</option>
          </select>
        </div>
        <div className="col-span-1 bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-3 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Library className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Total Listed
              </p>
              <p className="text-lg font-extrabold">{materials.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
          <p className="text-sm font-semibold text-muted-foreground mt-4">
            Loading materials...
          </p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center px-4 border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Book className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No materials found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-2">
            {searchQuery
              ? "No materials match your search query."
              : "You haven't listed any materials or notes for sale yet. Click 'Add Material' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredMaterials.map((material) => (
              <motion.div
                key={material._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-xl shadow-foreground/5 flex flex-col h-full hover:border-primary/30 transition-all duration-300"
              >
                {/* Image / Cover */}
                <div className="aspect-[4/3] bg-muted relative overflow-hidden flex items-center justify-center">
                  {material.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={material.coverImageUrl}
                      alt={material.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground/30" />
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm border bg-background/80 border-border/50">
                    {material.isActive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Hidden
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-base text-foreground line-clamp-2 leading-tight mb-1">
                    {material.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {material.description || "No description provided."}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span>{(material.price / 100).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(material)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Material"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete Material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
                <h2 className="text-lg font-bold">
                  {editingMaterial ? "Edit Material" : "Add New Material"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="material-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Complete React Notes 2026"
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Describe what's included..."
                      className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Price (USD) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="9.99"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Status
                      </label>
                      <select
                        value={formData.isActive ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm appearance-none"
                      >
                        <option value="true">Active (Visible in Shop)</option>
                        <option value="false">Hidden (Draft)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <Upload className="w-4 h-4 text-primary" /> Files & Assets
                    </h4>

                    {/* File Upload Zone */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Upload File (PDF, ZIP, etc.) * — Max {MAX_FILE_SIZE_MB}MB
                      </label>

                      {/* Drop Zone */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-all ${
                          isDragging
                            ? "border-primary bg-primary/10 scale-[1.01]"
                            : uploadSuccess
                            ? "border-green-500/50 bg-green-500/5"
                            : uploadError
                            ? "border-red-500/50 bg-red-500/5"
                            : "border-border/60 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.zip,.doc,.docx,.ppt,.pptx"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileSelect(f);
                            e.target.value = "";
                          }}
                        />

                        {isUploading ? (
                          <div className="w-full space-y-3 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                            <p className="text-sm font-semibold text-foreground">
                              Uploading {uploadedFile?.name}...
                            </p>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ ease: "linear" }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                          </div>
                        ) : uploadSuccess && uploadedFile ? (
                          <div className="text-center space-y-1">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                            <p className="text-sm font-bold text-green-600">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB — uploaded to ImageKit
                            </p>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); resetFileState(); setFormData(prev => ({ ...prev, fileUrl: "" })); }}
                              className="text-xs text-primary underline mt-1"
                            >
                              Replace file
                            </button>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                            <p className="text-sm font-semibold text-foreground">
                              Drag & drop your file here, or{" "}
                              <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, ZIP, DOC, PPT — up to {MAX_FILE_SIZE_MB}MB
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Upload Error */}
                      {uploadError && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-red-600">{uploadError}</p>
                        </div>
                      )}

                      {/* Manual URL fallback */}
                      <details className="group">
                        <summary className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none">
                          <LinkIcon className="w-3 h-3" />
                          Or enter a direct URL instead
                        </summary>
                        <div className="mt-2 space-y-1">
                          <input
                            type="url"
                            value={formData.fileUrl}
                            onChange={(e) => {
                              setUploadSuccess(false);
                              setUploadedFile(null);
                              setFormData({ ...formData, fileUrl: e.target.value });
                            }}
                            placeholder="https://example.com/my-notes.pdf"
                            className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                          />
                          <p className="text-[10px] text-muted-foreground">
                            Use a public Google Drive, Dropbox, or self-hosted URL.
                          </p>
                        </div>
                      </details>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Cover Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.coverImageUrl}
                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                        placeholder="https://example.com/cover.jpg"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-border/50 bg-muted/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl font-semibold hover:bg-muted text-muted-foreground transition-all disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="material-form"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center min-w-[120px] bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    "Save Material"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
