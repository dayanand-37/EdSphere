import { db } from "./db";
import { courses, testimonials } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Check if courses already exist
  const existingCourses = await db.select().from(courses);
  if (existingCourses.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  // Seed courses
  const coursesData = [
    {
      title: "IIT-JEE Complete Preparation",
      description: "Comprehensive coaching for JEE Main & Advanced. Covering Physics, Chemistry, and Mathematics with experienced faculty, daily practice sessions, and regular mock tests.",
      category: "IIT-JEE",
      thumbnail: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&auto=format&fit=crop",
      price: "12999",
      originalPrice: "24999",
      discount: 48,
      rating: "4.8",
      enrolledCount: 342,
      reviewCount: 156,
      isBestseller: true,
      isNewBatch: false,
      features: [
        "Live interactive classes",
        "Recorded lectures",
        "Daily practice problems",
        "Weekly mock tests",
        "Doubt clearing sessions",
        "Study materials included"
      ],
    },
    {
      title: "NEET Biology Mastery",
      description: "Master Biology for NEET with comprehensive coverage of Botany and Zoology. Expert faculty, visual learning, and practice-oriented approach.",
      category: "NEET",
      thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop",
      price: "9999",
      originalPrice: "19999",
      discount: 50,
      rating: "4.7",
      enrolledCount: 278,
      reviewCount: 124,
      isBestseller: false,
      isNewBatch: true,
      features: [
        "Visual learning modules",
        "NCERT coverage",
        "Previous year papers",
        "Mock tests",
        "Biology practical sessions"
      ],
    },
    {
      title: "UPSC CSE General Studies",
      description: "Complete General Studies preparation for UPSC Civil Services. Covers GS Papers 1-4 with current affairs, answer writing practice, and expert guidance.",
      category: "UPSC CSE",
      thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop",
      price: "15999",
      originalPrice: "29999",
      discount: 47,
      rating: "4.9",
      enrolledCount: 189,
      reviewCount: 98,
      isBestseller: true,
      isNewBatch: false,
      features: [
        "Complete GS coverage",
        "Current affairs daily",
        "Answer writing practice",
        "Essay writing",
        "Prelims & Mains focus",
        "Interview guidance"
      ],
    },
    {
      title: "JEE Advanced Physics",
      description: "Specialized Physics coaching for JEE Advanced. Deep conceptual understanding with problem-solving techniques and regular assessments.",
      category: "IIT-JEE",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
      price: "8999",
      originalPrice: "14999",
      discount: 40,
      rating: "4.6",
      enrolledCount: 215,
      reviewCount: 87,
      isBestseller: false,
      isNewBatch: true,
      features: [
        "Advanced problem solving",
        "Conceptual clarity",
        "IIT professor guidance",
        "Practice sheets",
        "Mock tests"
      ],
    },
    {
      title: "NEET Chemistry Complete",
      description: "Complete Chemistry preparation for NEET covering Physical, Organic, and Inorganic Chemistry with extensive practice and revision.",
      category: "NEET",
      thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop",
      price: "9499",
      originalPrice: "17999",
      discount: 47,
      rating: "4.8",
      enrolledCount: 298,
      reviewCount: 142,
      isBestseller: true,
      isNewBatch: false,
      features: [
        "All chemistry branches",
        "Reaction mechanisms",
        "Named reactions",
        "Practice problems",
        "Quick revision notes"
      ],
    },
    {
      title: "UPSC Optional - History",
      description: "Complete History optional preparation for UPSC CSE. Ancient, Medieval, Modern and World History with answer writing practice.",
      category: "UPSC CSE",
      thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop",
      price: "12999",
      originalPrice: "22999",
      discount: 43,
      rating: "4.7",
      enrolledCount: 156,
      reviewCount: 72,
      isBestseller: false,
      isNewBatch: true,
      features: [
        "Complete history coverage",
        "Map work",
        "Answer writing",
        "Source analysis",
        "Previous year papers"
      ],
    },
  ];

  await db.insert(courses).values(coursesData);
  console.log("✓ Courses seeded");

  // Seed testimonials
  const testimonialsData = [
    {
      name: "Rajesh Kumar",
      role: "IIT Bombay, Computer Science",
      content: "EdSphere's coaching helped me crack JEE Advanced with AIR 142! The faculty is excellent and the study materials are top-notch.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
      courseCategory: "IIT-JEE",
      isApproved: true,
    },
    {
      name: "Priya Sharma",
      role: "AIIMS Delhi, MBBS",
      content: "I secured AIR 89 in NEET thanks to EdSphere's comprehensive Biology and Chemistry courses. The mock tests were extremely helpful!",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
      courseCategory: "NEET",
      isApproved: true,
    },
    {
      name: "Amit Patel",
      role: "IAS Officer, 2024 Batch",
      content: "EdSphere's UPSC preparation program is outstanding. I cleared the exam with Rank 24 in my second attempt. Highly recommended!",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop",
      courseCategory: "UPSC CSE",
      isApproved: true,
    },
    {
      name: "Sneha Reddy",
      role: "GMC Mumbai, MBBS",
      content: "The live doubt-clearing sessions and personalized attention made all the difference. Achieved AIR 156 in NEET. Thank you EdSphere!",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
      courseCategory: "NEET",
      isApproved: true,
    },
  ];

  await db.insert(testimonials).values(testimonialsData);
  console.log("✓ Testimonials seeded");

  console.log("Database seeding completed!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
