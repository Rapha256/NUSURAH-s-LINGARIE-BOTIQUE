import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const BulkOrders = () => {
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    location: "",
    quantity: "",
    contact: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMsg = encodeURIComponent(
      `BULK ORDER INQUIRY\n\nName: ${form.fullName}\nBusiness: ${form.businessName}\nLocation: ${form.location}\nQuantity: ${form.quantity}\nContact: ${form.contact}\n\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/256709449823?text=${whatsappMsg}`, "_blank");
    toast.success("Inquiry sent! We'll also reach out via WhatsApp.");
    setForm({ fullName: "", businessName: "", location: "", quantity: "", contact: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Bulk Orders
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Interested in wholesale? Fill in the form and we'll get back to you with the best prices.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { key: "fullName", label: "Full Name", type: "text" },
              { key: "businessName", label: "Business Name", type: "text" },
              { key: "location", label: "Location", type: "text" },
              { key: "quantity", label: "Quantity", type: "text" },
              { key: "contact", label: "Phone / Email", type: "text" },
            ].map((field) => (
              <input
                key={field.key}
                type={field.type}
                placeholder={field.label}
                required
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            ))}
            <textarea
              placeholder="Message / Product Details"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
            />
            <Button type="submit" size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Submit Inquiry
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BulkOrders;
