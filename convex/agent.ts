import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAgent = mutation({
    args: {
        name: v.string(),
        agentId: v.string(),
        userId: v.id("UserTable"),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert("AgentTable", {
            name: args.name,
            agentId: args.agentId,
            published: false,
            userId: args.userId,
        });
        return result;
    }
});

export const getAgentList = query({
    args: {
        userId: v.id("UserTable"),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("AgentTable").filter((q) => q.eq(q.field("userId"), args.userId)).collect();
        return result;
    }
});

export const getAgentById = query({
    args: {
        agentId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("AgentTable")
            .filter((q) => q.eq(q.field("agentId"), args.agentId))
            .first();
        return result;
    }
});
export const UpdateAgentDetail = mutation({
    args: {
        id: v.id("AgentTable"),
        nodes: v.optional(v.any()),
        edges: v.optional(v.any()),
        agentToolConfig: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const updates: any = {};
        if (args.nodes !== undefined) updates.nodes = args.nodes;
        if (args.edges !== undefined) updates.edges = args.edges;
        if (args.agentToolConfig !== undefined) updates.agentToolConfig = args.agentToolConfig;

        await ctx.db.patch(args.id, updates);
    },
});

export const deleteAgent = mutation({
    args: {
        agentId: v.id("AgentTable"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.agentId);
    },
});
