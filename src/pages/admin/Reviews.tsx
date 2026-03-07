import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, X, MessageSquare, Star, Trash2 } from "lucide-react";

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*, products(title)").order("created_at", { ascending: false });
    setReviews(data || []);
  };

  useEffect(() => { fetchReviews(); }, []);

  const approve = async (id: string) => {
    await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
    toast({ title: "Review approved" });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    toast({ title: "Review deleted" });
    fetchReviews();
  };

  const submitReply = async (id: string) => {
    await supabase.from("reviews").update({ admin_reply: replyText }).eq("id", id);
    toast({ title: "Reply saved" });
    setReplyingTo(null);
    setReplyText("");
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Reviews</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{(r as any).products?.title || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <p>{r.comment}</p>
                    {r.admin_reply && <p className="text-xs text-primary mt-1">Reply: {r.admin_reply}</p>}
                    {replyingTo === r.id && (
                      <div className="flex gap-2 mt-2">
                        <Input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Your reply..." />
                        <Button size="sm" onClick={() => submitReply(r.id)}>Send</Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${r.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!r.is_approved && (
                        <Button variant="ghost" size="icon" onClick={() => approve(r.id)}><Check className="h-4 w-4 text-green-600" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => { setReplyingTo(r.id); setReplyText(r.admin_reply || ""); }}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteReview(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No reviews yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
