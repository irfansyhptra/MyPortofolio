"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialRepository = void 0;
const db_1 = require("../config/db");
const crypto_1 = require("crypto");
class TestimonialRepository {
    async getCollection() {
        const db = await (0, db_1.getDb)();
        return db.collection("testimonials");
    }
    mapDocument(doc) {
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
    async create(data) {
        const col = await this.getCollection();
        const newDoc = {
            _id: (0, crypto_1.randomUUID)(),
            name: data.name,
            position: data.position,
            company: data.company || null,
            avatar: data.avatar || null,
            message: data.message,
            rating: data.rating,
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        };
        await col.insertOne(newDoc);
        return this.mapDocument(newDoc);
    }
    async findApproved(limit, offset) {
        const col = await this.getCollection();
        const docs = await col
            .find({ status: "approved" })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();
        return docs.map(this.mapDocument);
    }
    async findAll(statusFilter, limit, offset) {
        const col = await this.getCollection();
        const query = {};
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
    async countAll(statusFilter) {
        const col = await this.getCollection();
        const query = {};
        if (statusFilter) {
            query.status = statusFilter;
        }
        return await col.countDocuments(query);
    }
    async findById(id) {
        const col = await this.getCollection();
        const doc = await col.findOne({ _id: id });
        return doc ? this.mapDocument(doc) : null;
    }
    async updateStatus(id, status) {
        const col = await this.getCollection();
        // Perform update and retrieve the updated document
        await col.updateOne({ _id: id }, { $set: { status, updated_at: new Date() } });
        const doc = await col.findOne({ _id: id });
        return doc ? this.mapDocument(doc) : null;
    }
    async delete(id) {
        const col = await this.getCollection();
        const result = await col.deleteOne({ _id: id });
        return (result.deletedCount ?? 0) > 0;
    }
}
exports.TestimonialRepository = TestimonialRepository;
