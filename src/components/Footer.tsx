import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-2">Nusurah</h3>
            <p className="text-primary-foreground/60 text-xs tracking-widest uppercase mb-4">
              The Lingerie Vendor
            </p>
            <p className="text-primary-foreground/70 text-sm italic">
              "If others can, then even me I can."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Shop</h4>
            <div className="flex flex-col gap-2">
              {["Nightwear", "Lingerie", "Innerwear", "New Arrivals"].map((cat) => (
                <Link
                  key={cat}
                  to="/shop"
                  className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+256709449823" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> +256 709 449823
              </a>
              <a href="tel:+256765608475" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> +256 765 608475
              </a>
              <a href="mailto:nusurahthelingerievendor@gmail.com" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">nusurahthelingerievendor@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Information</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Gayaza Road, Kasangati, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Open 24/7</span>
              </div>
              <p>🌍 Worldwide Delivery</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2026 Nusurah The Lingerie Vendor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.tiktok.com/@nusurah.queen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://wa.me/256709449823"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
