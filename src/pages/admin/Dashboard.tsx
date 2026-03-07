import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Star, DollarSign, MessageSquare, TrendingUp, Clock } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalReviews: number;
  revenue: number;
  bulkInquiries: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0,
    totalUsers: 0, totalReviews: 0, revenue: 0, bulkInquiries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [products, orders, reviews, inquiries, profiles] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, status, total_amount"),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("bulk_inquiries").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const orderData = orders.data || [];
      setStats({
        totalProducts: products.count || 0,
        totalOrders: orderData.length,
        pendingOrders: orderData.filter((o) => o.status === "pending").length,
        completedOrders: orderData.filter((o) => o.status === "delivered").length,
        totalUsers: profiles.count || 0,
        totalReviews: reviews.count || 0,
        revenue: orderData.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
        bulkInquiries: inquiries.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Products", value: stats.totalProducts, icon: Package, color: "text-primary" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-500" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "text-yellow-500" },
    { title: "Completed Orders", value: stats.completedOrders, icon: TrendingUp, color: "text-green-500" },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-500" },
    { title: "Total Reviews", value: stats.totalReviews, icon: Star, color: "text-orange-500" },
    { title: "Revenue", value: `UGX ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
    { title: "Bulk Inquiries", value: stats.bulkInquiries, icon: MessageSquare, color: "text-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
