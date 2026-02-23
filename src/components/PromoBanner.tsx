import { Truck, Shield, Clock, Phone } from "lucide-react";

const features = [
  { icon: Truck, title: "Worldwide Delivery", desc: "Mainly within Uganda" },
  { icon: Clock, title: "Open 24/7", desc: "Always available for you" },
  { icon: Shield, title: "Quality Guaranteed", desc: "Premium fabrics only" },
  { icon: Phone, title: "Easy Ordering", desc: "Via website or WhatsApp" },
];

const PromoBanner = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-foreground">{f.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
