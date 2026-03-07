import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const defaultSettings: Record<string, string> = {
  hero_title: "Nusurah The Lingerie Vendor",
  hero_subtitle: "Elegant Lingerie & Nightwear",
  contact_phone: "+256 709 449823",
  contact_email: "nusurahthelingerievendor@gmail.com",
  delivery_policy: "Worldwide Delivery Available",
  business_hours: "Open 24/7",
  tiktok_link: "https://www.tiktok.com/@nusurah.queen",
  google_map_location: "Gayaza Road, Kasangati, Uganda",
  address: "Gayaza Road, Kasangati, Uganda",
};

const ContentAdmin = () => {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const s = { ...defaultSettings };
        data.forEach((row: any) => { s[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value); });
        setSettings(s);
      }
    };
    fetchSettings();
  }, []);

  const save = async () => {
    setLoading(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("site_settings").upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: "key" });
    }
    setLoading(false);
    toast({ title: "Settings saved!" });
  };

  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Content Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Homepage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Hero Title</label><Input value={settings.hero_title} onChange={(e) => update("hero_title", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Hero Subtitle</label><Input value={settings.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Phone</label><Input value={settings.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Email</label><Input value={settings.contact_email} onChange={(e) => update("contact_email", e.target.value)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Business Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">Business Hours</label><Input value={settings.business_hours} onChange={(e) => update("business_hours", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Address</label><Input value={settings.address} onChange={(e) => update("address", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Google Map Location</label><Input value={settings.google_map_location} onChange={(e) => update("google_map_location", e.target.value)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Social & Policies</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium">TikTok Link</label><Input value={settings.tiktok_link} onChange={(e) => update("tiktok_link", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Delivery Policy</label><Textarea value={settings.delivery_policy} onChange={(e) => update("delivery_policy", e.target.value)} /></div>
          </CardContent>
        </Card>
      </div>
      <Button onClick={save} disabled={loading} size="lg">
        <Save className="h-4 w-4 mr-2" />{loading ? "Saving..." : "Save All Changes"}
      </Button>
    </div>
  );
};

export default ContentAdmin;
