/* 
 * Supabase initialization and fallback data
 * We load this using CDN in index.html and admin.html
 */

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

let supabaseClient = null;

if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Fallback constant data in case Supabase isn't hooked up yet
const fallbackPortfolioData = {
    heroGreeting: "Welcome to my digital space",
    heroName: "SUBUHAN",
    heroTitle: "Front-End Engineer &bull; Creative Developer &bull; Vibe Coder",
    aboutTitle: "Bridging Code and Aesthetics.",
    aboutBio1: "I'm Subuhan, a full-stack developer and tech enthusiast who believes that the web should be an <strong>experience</strong>, not just a document. I specialize in building visually stunning, highly interactive applications.",
    aboutBio2: "Drawing inspiration from modern editorial layouts and immersive 3D web experiences, I merge solid software engineering principles with high-end design aesthetics.",
    skills: ["Full-Stack Development", "Creative Coding", "UI/UX Design", "Performance Optimization", "Generative AI Integration"],
    contactEmail: "subuhaaan@gmail.com"
};

// Global function to fetch content
async function getPortfolioData() {
    if (!supabaseClient) {
        console.log("Supabase not configured, using fallback data.");
        return fallbackPortfolioData;
    }

    try {
        const { data, error } = await supabaseClient
            .from('portfolio_content')
            .select('*')
            .single();

        if (error || !data) {
            console.error("Error fetching from Supabase:", error);
            return fallbackPortfolioData;
        }
        
        return data;
    } catch (err) {
        console.error("Critical DB error:", err);
        return fallbackPortfolioData;
    }
}
