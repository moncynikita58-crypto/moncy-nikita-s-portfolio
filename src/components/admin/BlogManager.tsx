import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit, X, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  date: string | null;
  published: boolean | null;
  created_at: string | null;
}

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  date: "",
  published: true,
};

const BlogManager = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPost);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const update = (field: string, value: string | boolean) =>
    setForm((p) => ({
      ...p,
      [field]: value,
      ...(field === "title" && !editingId ? { slug: generateSlug(value as string) } : {}),
    }));

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      image_url: post.image_url || "",
      date: post.date || "",
      published: post.published ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await (supabase as any).from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      loadPosts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      image_url: form.image_url || null,
      date: form.date || null,
      published: form.published,
    };

    if (editingId) {
      const { error } = await (supabase as any).from("blog_posts").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Post updated" });
    } else {
      const { error } = await (supabase as any).from("blog_posts").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Post created" });
    }
    setForm(emptyPost);
    setShowForm(false);
    setEditingId(null);
    loadPosts();
  };

  const togglePublished = async (post: BlogPost) => {
    await (supabase as any).from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    loadPosts();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Manage Blog Posts</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyPost); }}>
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Post</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <h3 className="font-bold text-foreground">{editingId ? "Edit Post" : "Create New Post"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Title *</label>
              <Input required value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Slug *</label>
              <Input required value={form.slug} onChange={(e) => update("slug", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Date</label>
              <Input value={form.date} onChange={(e) => update("date", e.target.value)} placeholder="e.g. March 2026" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Image URL</label>
              <Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Excerpt</label>
            <Textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Content *</label>
            <Textarea required rows={8} value={form.content} onChange={(e) => update("content", e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} id="published" className="rounded border-input" />
            <label htmlFor="published" className="text-sm font-semibold text-foreground">Published</label>
          </div>
          <div className="flex justify-end">
            <Button type="submit"><Save className="w-4 h-4 mr-1" /> {editingId ? "Update" : "Create"} Post</Button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-foreground">Title</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Slug</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Date</th>
                <th className="text-left p-3 font-semibold text-foreground">Status</th>
                <th className="text-right p-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No blog posts yet</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="border-t border-border">
                  <td className="p-3 text-foreground font-medium">{post.title}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{post.slug}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{post.date || "—"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${post.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => togglePublished(post)} title={post.published ? "Unpublish" : "Publish"}>
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default BlogManager;
