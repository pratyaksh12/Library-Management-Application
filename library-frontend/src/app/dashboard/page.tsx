"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, BookOpen, LogOut, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

import { getRandomBookCover } from "@/lib/images";
import Image from "next/image";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  availableCopies: number;
  coverColor: string;
  description?: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/Books?PageSize=20");
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  const featuredBook = books.length > 0 ? books[0] : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Midnight Library</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/my-books">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  My Books
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {/* Featured Section */}
          {featuredBook && !search && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-background border border-white/5 p-8 md:p-12"
            >
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1 text-sm uppercase tracking-wider">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Featured Book
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                            {featuredBook.title}
                        </h2>
                        <p className="text-lg text-muted-foreground line-clamp-3">
                            {featuredBook.description || "Discover this masterpiece in our collection. A compelling narrative that weaves together complex characters and stunning landscapes."}
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="text-lg px-8 shadow-lg shadow-primary/20" onClick={() => router.push(`/books/${featuredBook.id}`)}>
                                View Details
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center perspective-1000">
                        <motion.div 
                            whileHover={{ rotateY: -10, rotateX: 5 }}
                            className="relative w-64 aspect-[2/3] rounded-lg shadow-2xl shadow-primary/20 bg-card border border-white/10 flex items-center justify-center text-6xl font-bold text-white/10 overflow-hidden"
                            style={{ backgroundColor: featuredBook.coverColor }}
                        >
                            <Image 
                                src={getRandomBookCover(featuredBook.title)} 
                                alt={featuredBook.title} 
                                fill 
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
          )}

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 py-4 bg-background/95 backdrop-blur-sm -mx-4 px-4 md:mx-0 md:px-0">
            <h3 className="text-2xl font-bold">Discover Books</h3>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="pl-10 h-12 bg-muted/50 border-white/10 focus:border-primary/50 focus:bg-background transition-all" 
                placeholder="Search by title, author, or genre..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Book Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted/20 rounded-2xl animate-pulse" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book, index) => (
                <Link href={`/books/${book.id}`} key={book.id}>
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group h-full"
                    >
                    <Card className="h-full flex flex-col bg-card/50 border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300">
                        <div 
                        className="aspect-[2/3] w-full bg-muted relative overflow-hidden"
                        style={{ backgroundColor: book.coverColor }}
                        >
                        <Image 
                            src={getRandomBookCover(book.title)} 
                            alt={book.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/20 text-white shadow-lg">
                                View Details
                            </Button>
                        </div>
                        </div>
                        <CardHeader className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors" title={book.title}>{book.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">{book.genre}</Badge>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-sm font-medium">{book.rating}</span>
                            </div>
                        </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${book.availableCopies > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {book.availableCopies > 0 ? `${book.availableCopies} Available` : "Out of Stock"}
                            </div>
                        </CardFooter>
                    </Card>
                    </motion.div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
