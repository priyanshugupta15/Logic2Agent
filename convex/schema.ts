import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
        token: v.number()
    }),

    AgentTable: defineTable({
        agentId: v.string(),
        name: v.string(),
        config: v.optional(v.any()),
        nodes: v.optional(v.any()),
        edges: v.optional(v.any()),
        agentToolConfig: v.optional(v.any()),
        published: v.boolean(),
        starred: v.optional(v.boolean()),
        userId: v.id("UserTable"),
    }),

    ChatHistoryTable: defineTable({
        agentId: v.string(),
        sessionId: v.string(),
        userId: v.id("UserTable"),
        messages: v.array(v.object({
            id: v.string(),
            role: v.string(),
            content: v.string(),
            timestamp: v.number()
        })),
        createdAt: v.number(),
        updatedAt: v.number()
    })
});
