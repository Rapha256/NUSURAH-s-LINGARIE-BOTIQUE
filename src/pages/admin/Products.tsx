import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  gender: string;
  age_range: string | null;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  images: string[];
  is_new_arrival: boolean | null;
  is_trending: boolean | null;
  is_enabled: boolean | null;
  stock_quantity: number | null;
  tags: string[] | null;
  scheduled_publish_at: string | null;
  reviews_enabled: boolean | null;
}

const emptyProduct = {
  title: "", description: "", category: "Nightwear", gender: "Women", age_range: "",
  price: 0, original_price: 0, discount_percentage: 0, images: [] as string[],
  is_new_arrival: false, is_trending: false, is_enabled: true, stock_quantity: 0,
  tags: [] as string[], scheduled_publish_at: "", reviews_enabled: true,
};

const categories = ["Nightwear", "Innerwear", "Lingerie", "New Arrivals", "Discounted Items"];
const genders = ["Women", "Men", "Children", "Unisex"];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState(emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as any) || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const logActivity = async (action: string, details: any) => {
    await supabase.from("activity_log").insert({ user_id: user?.id, action, details });
  };

  const isVideoUrl = (url: string) => /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|3gp|ogv)(\?|$)/i.test(url);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const newImages = [...form.images];
    for (const file of Array.from(e.target.files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
      if (error) {
        toast({ title: "Upload failed", description: `${file.name}: ${error.message}`, variant: "destructive" });
      } else {
        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        newImages.push(data.publicUrl);
      }
    }
    setForm({ ...form, images: newImages });
    setUploading(false);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      gender: form.gender,
      age_range: form.age_range || null,
      price: form.price,
      original_price: form.original_price || null,
      discount_percentage: form.discount_percentage || 0,
      images: form.images,
      is_new_arrival: form.is_new_arrival,
      is_trending: form.is_trending,
      is_enabled: form.is_enabled,
      stock_quantity: form.stock_quantity,
      tags: form.tags,
      scheduled_publish_at: form.scheduled_publish_at || null,
      reviews_enabled: form.reviews_enabled,
    };

    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("product_updated", { product_id: editingProduct.id, title: form.title });
      toast({ title: "Product updated!" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("product_created", { title: form.title });
      toast({ title: "Product created!" });
    }
    setIsOpen(false);
    setEditingProduct(null);
    setForm(emptyProduct);
    fetchProducts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    await logActivity("product_deleted", { product_id: id, title });
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description || "",
      category: product.category,
      gender: product.gender,
      age_range: product.age_range || "",
      price: product.price,
      original_price: product.original_price || 0,
      discount_percentage: product.discount_percentage || 0,
      images: product.images || [],
      is_new_arrival: product.is_new_arrival || false,
      is_trending: product.is_trending || false,
      is_enabled: product.is_enabled ?? true,
      stock_quantity: product.stock_quantity || 0,
      tags: product.tags || [],
      scheduled_publish_at: product.scheduled_publish_at || "",
      reviews_enabled: product.reviews_enabled ?? true,
    });
    setIsOpen(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingProduct(null); setForm(emptyProduct); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Gender</label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{genders.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Age Range</label>
                <Input value={form.age_range} onChange={(e) => setForm({ ...form, age_range: e.target.value })} placeholder="e.g. 18-25" />
              </div>
              <div>
                <label className="text-sm font-medium">Price (UGX)</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Original Price</label>
                <Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Discount %</label>
                <Input type="number" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Stock Quantity</label>
                <Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Schedule Publish</label>
                <Input type="datetime-local" value={form.scheduled_publish_at} onChange={(e) => setForm({ ...form, scheduled_publish_at: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Images & Videos</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative w-20 h-20">
                      {isVideoUrl(url) ? (
                        <video src={url} className="w-full h-full object-cover rounded" muted />
                      ) : (
                        <img src={url} alt="" className="w-full h-full object-cover rounded" />
                      )}
                      <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-muted">
                  <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Images & Videos"}
                  <input type="file" multiple accept="image/*,video/*,.heic,.heif,.webp,.avif,.svg,.gif,.bmp,.tiff,.mp4,.webm,.mov,.avi,.mkv,.flv,.wmv,.m4v,.3gp,.ogv" className="hidden" onChange={handleMediaUpload} disabled={uploading} />
                </label>
                <p className="text-xs text-muted-foreground mt-1">Supports: JPG, PNG, GIF, WebP, AVIF, SVG, HEIC, BMP, TIFF, MP4, WebM, MOV, AVI, MKV and more</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                  <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs flex items-center gap-1">
                      {tag}
                      <button onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.is_new_arrival} onCheckedChange={(v) => setForm({ ...form, is_new_arrival: v })} /> New Arrival
                </label>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.is_trending} onCheckedChange={(v) => setForm({ ...form, is_trending: v })} /> Trending
                </label>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.is_enabled} onCheckedChange={(v) => setForm({ ...form, is_enabled: v })} /> Enabled
                </label>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.reviews_enabled} onCheckedChange={(v) => setForm({ ...form, reviews_enabled: v })} /> Reviews
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!form.title}>Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.images?.[0] && <img src={product.images[0]} className="w-10 h-10 rounded object-cover" />}
                      <span>{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>UGX {Number(product.price).toLocaleString()}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.is_enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.is_enabled ? "Active" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id, product.title)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
