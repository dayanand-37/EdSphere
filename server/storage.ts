// Reference: PostgreSQL database blueprint and Replit Auth blueprint
import {
  users,
  courses,
  enrollments,
  testimonials,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type UpdateCourse,
  type Enrollment,
  type InsertEnrollment,
  type Testimonial,
  type InsertTestimonial,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: UpdateCourse): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;

  // Enrollment operations
  getEnrollments(userId: string): Promise<Array<Enrollment & { course: Course }>>;
  getEnrollmentByCourse(userId: string, courseId: string): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(id: string, progress: number): Promise<Enrollment | undefined>;

  // Testimonial operations
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Admin operations
  getAdminStats(): Promise<{
    totalCourses: number;
    totalEnrollments: number;
    totalStudents: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.enrolledCount));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(courseData)
      .returning();
    return course;
  }

  async updateCourse(id: string, courseData: UpdateCourse): Promise<Course | undefined> {
    const [course] = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Enrollment operations
  async getEnrollments(userId: string): Promise<Array<Enrollment & { course: Course }>> {
    const results = await db
      .select()
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));

    return results.map((row) => ({
      ...row.enrollments,
      course: row.courses!,
    }));
  }

  async getEnrollmentByCourse(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    // Create enrollment
    const [enrollment] = await db
      .insert(enrollments)
      .values(enrollmentData)
      .returning();

    // Update course enrolled count
    await db
      .update(courses)
      .set({
        enrolledCount: sql`${courses.enrolledCount} + 1`,
      })
      .where(eq(courses.id, enrollmentData.courseId));

    return enrollment;
  }

  async updateEnrollmentProgress(id: string, progress: number): Promise<Enrollment | undefined> {
    const updateData: any = { progress };
    if (progress === 100) {
      updateData.completedAt = new Date();
    }

    const [enrollment] = await db
      .update(enrollments)
      .set(updateData)
      .where(eq(enrollments.id, id))
      .returning();
    return enrollment;
  }

  // Testimonial operations
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isApproved, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(testimonialData)
      .returning();
    return testimonial;
  }

  // Admin operations
  async getAdminStats(): Promise<{
    totalCourses: number;
    totalEnrollments: number;
    totalStudents: number;
  }> {
    const [coursesCount] = await db
      .select({ count: count() })
      .from(courses);

    const [enrollmentsCount] = await db
      .select({ count: count() })
      .from(enrollments);

    const [studentsCount] = await db
      .select({ count: count() })
      .from(users);

    return {
      totalCourses: coursesCount?.count || 0,
      totalEnrollments: enrollmentsCount?.count || 0,
      totalStudents: studentsCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
