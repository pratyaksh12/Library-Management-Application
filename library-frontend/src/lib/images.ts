export const BOOK_COVERS = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495640388908-05fa85217e6d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519681393798-3828fb4090bb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800&auto=format&fit=crop"
];

export const LIBRARY_ILLUSTRATIONS = [
    "https://images.unsplash.com/photo-1507842217121-9e93c8aaf27c?q=80&w=2670&auto=format&fit=crop", // Classic dark library
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2828&auto=format&fit=crop", // Bookshelf close up
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop", // Library aisle
];

export function getRandomBookCover(seed?: string): string {
    if (seed) {
        // Deterministic selection based on seed string
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % BOOK_COVERS.length;
        return BOOK_COVERS[index];
    }
    // Truly random
    return BOOK_COVERS[Math.floor(Math.random() * BOOK_COVERS.length)];
}

export function getLoginImage(): string {
    return LIBRARY_ILLUSTRATIONS[0];
}

export function getRegisterImage(): string {
    return LIBRARY_ILLUSTRATIONS[1];
}
