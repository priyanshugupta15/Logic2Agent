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
        nodes: v.any(),
        edges: v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            edges: args.edges,
            nodes: args.nodes,
        });
    },
});
