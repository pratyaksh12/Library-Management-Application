"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Clock, History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { getRandomBookCover } from "@/lib/images";

interface BorrowRecord {
  recordId: string;
  bookTitle: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: number; // 0: Borrowed, 1: Returned, 2: Overdue
}

export default function MyBooksPage() {
  const router = useRouter();
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const response = await api.get("/Borrow/my-books");
      setRecords(response.data);
    } catch (error: any) {
      console.error("Fetch My Books Error:", error);
      toast.error(error.response?.data || "Failed to fetch your books");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (recordId: string) => {
    setReturningId(recordId);
    try {
      await api.post(`/Borrow/return/${recordId}`);
      toast.success("Book returned successfully!");
      fetchMyBooks(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  const activeLoans = records.filter(r => r.status === 0 || r.status === 2);
  const history = records.filter(r => r.status === 1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="hover:bg-primary/10 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">My Books</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1">
                    <TabsTrigger value="active" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        Active Loans ({activeLoans.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                        History ({history.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading your books...</div>
                    ) : activeLoans.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-white/5">
                            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No active loans</h3>
                            <p className="text-muted-foreground mb-6">You haven't borrowed any books yet.</p>
                            <Button onClick={() => router.push("/dashboard")}>Browse Library</Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activeLoans.map((record, index) => (
                                <motion.div
                                    key={record.recordId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden border-white/10 bg-card/50 hover:bg-card/80 transition-colors group">
                                        <div className="flex h-full">
                                            <div className="w-1/3 relative bg-muted">
                                                <Image 
                                                    src={getRandomBookCover(record.bookTitle)} 
                                                    alt={record.bookTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="w-2/3 p-4 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-semibold line-clamp-2 mb-1" title={record.bookTitle}>{record.bookTitle}</h3>
                                                    <p className="text-sm text-muted-foreground mb-3">{record.author}</p>
                                                    
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Borrowed: {formatDate(record.borrowDate)}</span>
                                                        </div>
                                                        <div className={`flex items-center gap-2 font-medium ${record.status === 2 ? 'text-red-500' : 'text-yellow-500'}`}>
                                                            <Clock className="h-3 w-3" />
                                                            <span>Due: {formatDate(record.dueDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Button 
                                                    size="sm" 
                                                    className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                                                    onClick={() => handleReturn(record.recordId)}
                                                    disabled={returningId === record.recordId}
                                                >
                                                    {returningId === record.recordId ? (
                                                        <RotateCcw className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <RotateCcw className="h-4 w-4 mr-2" />
                                                    )}
                                                    {returningId === record.recordId ? "Returning..." : "Return Book"}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-white/5">
                            <History className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No history</h3>
                            <p className="text-muted-foreground">You haven't returned any books yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((record, index) => (
                                <motion.div
                                    key={record.recordId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card/30 border border-white/5 hover:bg-card/50 transition-colors">
                                        <div className="h-16 w-12 relative rounded overflow-hidden flex-shrink-0 bg-muted">
                                            <Image 
                                                src={getRandomBookCover(record.bookTitle)} 
                                                alt={record.bookTitle}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-medium truncate">{record.bookTitle}</h4>
                                            <p className="text-sm text-muted-foreground">{record.author}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 mb-1">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Returned
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                on {record.returnDate ? formatDate(record.returnDate) : "-"}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
