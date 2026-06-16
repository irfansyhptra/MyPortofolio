import { getDb } from "../config/db";
import { CreateTestimonialInput } from "../validators/testimonial.validator";
import { randomUUID } from "crypto";

export interface TestimonialRow {
  id: string;
  name: string;
  position: string;
  company: string | null;
  avatar: string | null;
  message: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
  updated_at: Date;
}

export class TestimonialRepository {
  private async getCollection() {
    const db = await getDb();
    return db.collection<any>("testimonials");
  }

  private mapDocument(doc: any): TestimonialRow {
    return {
      id: doc._id,
      name: doc.name,
      position: doc.position,
      company: doc.company,
      avatar: doc.avatar,
      message: doc.message,
      rating: doc.rating,
      status: doc.status,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  }

  async create(data: CreateTestimonialInput): Promise<TestimonialRow> {
    const col = await this.getCollection();
    const newDoc = {
      _id: randomUUID(),
      name: data.name,
      position: data.position,
      company: data.company || null,
      avatar: data.avatar || null,
      message: data.message,
      rating: data.rating,
      status: "pending" as const,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await col.insertOne(newDoc);
    return this.mapDocument(newDoc);
  }

  async findApproved(limit: number, offset: number): Promise<TestimonialRow[]> {
    const col = await this.getCollection();
    const docs = await col
      .find({ status: "approved" })
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
    return docs.map(this.mapDocument);
  }

  async findAll(
    statusFilter: string | null,
    limit: number,
    offset: number
  ): Promise<TestimonialRow[]> {
    const col = await this.getCollection();
    const query: any = {};
    if (statusFilter) {
      query.status = statusFilter;
    }
    const docs = await col
      .find(query)
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
    return docs.map(this.mapDocument);
  }

  async countAll(statusFilter: string | null): Promise<number> {
    const col = await this.getCollection();
    const query: any = {};
    if (statusFilter) {
      query.status = statusFilter;
    }
    return await col.countDocuments(query);
  }

  async findById(id: string): Promise<TestimonialRow | null> {
    const col = await this.getCollection();
    const doc = await col.findOne({ _id: id });
    return doc ? this.mapDocument(doc) : null;
  }

  async updateStatus(
    id: string,
    status: "pending" | "approved" | "rejected"
  ): Promise<TestimonialRow | null> {
    const col = await this.getCollection();
    
    // Perform update and retrieve the updated document
    await col.updateOne(
      { _id: id },
      { $set: { status, updated_at: new Date() } }
    );
    
    const doc = await col.findOne({ _id: id });
    return doc ? this.mapDocument(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const col = await this.getCollection();
    const result = await col.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }
}
