import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("bulk_inquiries").select("*").order("created_at", { ascending: false }).then(({ data }) => setInquiries(data || []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Bulk Inquiries</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium">{inq.business_name}</TableCell>
                  <TableCell>
                    <p>{inq.contact_name}</p>
                    <p className="text-xs text-muted-foreground">{inq.email}</p>
                    <p className="text-xs text-muted-foreground">{inq.phone}</p>
                  </TableCell>
                  <TableCell>{inq.quantity || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{inq.message || "—"}</TableCell>
                  <TableCell className="text-xs">{new Date(inq.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {inq.email && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${inq.email}`}><Mail className="h-4 w-4" /></a>
                        </Button>
                      )}
                      {inq.phone && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`https://wa.me/${inq.phone?.replace(/\D/g, "")}`} target="_blank"><MessageSquare className="h-4 w-4" /></a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {inquiries.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No inquiries yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inquiries;
