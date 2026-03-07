import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const emptyPromo = {
  code: "", discount_percentage: 0, is_site_wide: false, is_flash_sale: false,
  banner_text: "", starts_at: "", expires_at: "", is_active: true,
};

const Promotions = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyPromo);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
    setPromos(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    const { error } = await supabase.from("promotions").insert({
      code: form.code || null,
      discount_percentage: form.discount_percentage,
      is_site_wide: form.is_site_wide,
      is_flash_sale: form.is_flash_sale,
      banner_text: form.banner_text || null,
      starts_at: form.starts_at || new Date().toISOString(),
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Promotion created!" });
    setIsOpen(false);
    setForm(emptyPromo);
    fetch();
  };

  const deletePromo = async (id: string) => {
    await supabase.from("promotions").delete().eq("id", id);
    toast({ title: "Promotion deleted" });
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Promotions</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Promotion</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Promotion</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Discount Code</label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Discount %</label><Input type="number" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: Number(e.target.value) })} /></div>
              <div><label className="text-sm font-medium">Banner Text</label><Input value={form.banner_text} onChange={(e) => setForm({ ...form, banner_text: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Starts</label><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Expires</label><Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_site_wide} onCheckedChange={(v) => setForm({ ...form, is_site_wide: v })} /> Site-wide</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_flash_sale} onCheckedChange={(v) => setForm({ ...form, is_flash_sale: v })} /> Flash Sale</label>
              <Button onClick={save} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono">{p.code || "—"}</TableCell>
                  <TableCell>{p.discount_percentage}%</TableCell>
                  <TableCell>{p.is_flash_sale ? "Flash Sale" : p.is_site_wide ? "Site-wide" : "Code"}</TableCell>
                  <TableCell className="text-xs">{p.expires_at ? new Date(p.expires_at).toLocaleDateString() : "No expiry"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deletePromo(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {promos.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No promotions yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Promotions;
