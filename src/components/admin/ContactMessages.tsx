import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean | null;
  created_at: string | null;
}

const ContactMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const { error } = await (supabase as any)
      .from("contact_messages")
      .update({ read: !msg.read })
      .eq("id", msg.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      loadMessages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await (supabase as any)
      .from("contact_messages")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      loadMessages();
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Contact Messages
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
        <Button variant="outline" onClick={loadMessages}>Refresh</Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No messages yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <div key={msg.id} className={`${!msg.read ? "bg-primary/5" : ""}`}>
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setExpandedId(expandedId === msg.id ? null : msg.id);
                    if (!msg.read) toggleRead(msg);
                  }}
                >
                  <div className="flex-shrink-0">
                    {msg.read ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${!msg.read ? "text-foreground font-semibold" : "text-foreground"}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {msg.subject ? `${msg.subject} — ` : ""}{msg.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
                  </span>
                  <div className="flex-shrink-0">
                    {expandedId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                {expandedId === msg.id && (
                  <div className="px-4 pb-4 pl-11">
                    {msg.subject && <p className="text-sm font-semibold text-foreground mb-1">Subject: {msg.subject}</p>}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">{msg.message}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); toggleRead(msg); }}>
                        {msg.read ? <><Mail className="w-3 h-3 mr-1" /> Mark Unread</> : <><MailOpen className="w-3 h-3 mr-1" /> Mark Read</>}
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}>
                        <Trash2 className="w-3 h-3 mr-1 text-destructive" /> Delete
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${msg.email}`} onClick={(e) => e.stopPropagation()}>
                          Reply via Email
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ContactMessages;
