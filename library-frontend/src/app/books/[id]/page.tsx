"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Star, BookOpen, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";

import { getRandomBookCover } from "@/lib/images";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  availableCopies: number;
  description: string; // Assuming API returns this, if not we'll use placeholder
  coverColor: string;
  isbn: string;
  publishedYear: number;
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBookDetails(params.id as string);
    }
  }, [params.id]);

  const fetchBookDetails = async (id: string) => {
    try {
      const response = await api.get(`/Books/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error("Failed to load book details");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!book) return;
    setBorrowing(true);
    try {
      await api.post("/Borrow", { bookId: book.id });
      toast.success("Book borrowed successfully!");
      fetchBookDetails(book.id); // Refresh details
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to borrow book");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Back Button */}
        <div className="fixed top-6 left-6 z-50">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-background/50 backdrop-blur-md border border-border hover:bg-background/80">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </div>

        {/* Hero Section with Blur Background */}
        <div className="relative w-full h-[50vh] lg:h-[60vh] overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110"
                style={{ backgroundColor: book.coverColor || '#0f172a' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
            
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge variant="secondary" className="mb-4 text-lg px-4 py-1">{book.genre}</Badge>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight leading-tight">
                        {book.title}
                    </h1>
                    <div className="flex items-center gap-6 text-lg md:text-xl text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {book.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            {book.rating}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {book.publishedYear || "2024"}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Cover Image */}
                <div className="lg:col-span-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 group"
                    >
                        <Image 
                            src={getRandomBookCover(book.title)} 
                            alt={book.title} 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    <div className="mt-8 space-y-4">
                        <Button 
                            size="lg" 
                            className="w-full text-lg h-14 font-semibold shadow-lg shadow-primary/25"
                            disabled={book.availableCopies === 0 || borrowing}
                            onClick={handleBorrow}
                        >
                            <BookOpen className="mr-2 h-5 w-5" />
                            {borrowing ? "Processing..." : book.availableCopies > 0 ? "Borrow Now" : "Out of Stock"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            {book.availableCopies} copies available
                        </div>
                    </div>
                </div>

                {/* Right Column: Description & Details */}
                <div className="lg:col-span-8 space-y-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="prose prose-invert max-w-none"
                    >
                        <h3 className="text-2xl font-semibold mb-4">Synopsis</h3>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {book.description || "No description available for this book. Imagine a captivating story that takes you on a journey through time and space, exploring the depths of human emotion and the wonders of the universe. This book is a masterpiece of its genre, acclaimed by critics and loved by readers worldwide."}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-border">
                        <div className="bg-card p-6 rounded-xl border border-border/50">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">ISBN</h4>
                            <p className="text-xl font-mono">{book.isbn || "978-3-16-148410-0"}</p>
                        </div>
                        <div className="bg-card p-6 rounded-xl border border-border/50">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Publisher</h4>
                            <p className="text-xl">Penguin Random House</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
