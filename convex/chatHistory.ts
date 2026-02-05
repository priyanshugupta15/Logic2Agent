import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new chat session
export const createSession = mutation({
    args: {
        agentId: v.string(),
        sessionId: v.string(),
        userId: v.id("UserTable")
    },
    handler: async (ctx, args) => {
        const sessionId = await ctx.db.insert("ChatHistoryTable", {
            agentId: args.agentId,
            sessionId: args.sessionId,
            userId: args.userId,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return sessionId;
    }
});

// Save a message to a session
export const saveMessage = mutation({
    args: {
        agentId: v.string(),
        sessionId: v.string(),
        userId: v.id("UserTable"),
        message: v.object({
            id: v.string(),
            role: v.string(),
            content: v.string(),
            timestamp: v.number()
        })
    },
    handler: async (ctx, args) => {
        // Find existing session
        const existingSession = await ctx.db
            .query("ChatHistoryTable")
            .filter(q =>
                q.and(
                    q.eq(q.field("agentId"), args.agentId),
                    q.eq(q.field("sessionId"), args.sessionId),
                    q.eq(q.field("userId"), args.userId)
                )
            )
            .first();

        if (existingSession) {
            // Update existing session
            await ctx.db.patch(existingSession._id, {
                messages: [...existingSession.messages, args.message],
                updatedAt: Date.now()
            });
            return existingSession._id;
        } else {
            // Create new session
            const sessionId = await ctx.db.insert("ChatHistoryTable", {
                agentId: args.agentId,
                sessionId: args.sessionId,
                userId: args.userId,
                messages: [args.message],
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
            return sessionId;
        }
    }
});

// Get session history
export const getSessionHistory = query({
    args: {
        agentId: v.string(),
        sessionId: v.string(),
        userId: v.id("UserTable")
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("ChatHistoryTable")
            .filter(q =>
                q.and(
                    q.eq(q.field("agentId"), args.agentId),
                    q.eq(q.field("sessionId"), args.sessionId),
                    q.eq(q.field("userId"), args.userId)
                )
            )
            .first();

        return session?.messages || [];
    }
});

// Clear session history
export const clearSession = mutation({
    args: {
        agentId: v.string(),
        sessionId: v.string(),
        userId: v.id("UserTable")
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("ChatHistoryTable")
            .filter(q =>
                q.and(
                    q.eq(q.field("agentId"), args.agentId),
                    q.eq(q.field("sessionId"), args.sessionId),
                    q.eq(q.field("userId"), args.userId)
                )
            )
            .first();

        if (session) {
            await ctx.db.delete(session._id);
            return true;
        }
        return false;
    }
});
