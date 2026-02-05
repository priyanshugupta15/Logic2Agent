import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string()
    },
    handler: async (ctx, args) => {
        //if user already exist
        const user = await ctx.db.query('UserTable')
            .filter((q) => q.eq(q.field('email'), args.email))
            .collect()

        //If Not, Then Create new user
        if (user?.length == 0) {
            const userId = await ctx.db.insert('UserTable', {
                name: args.name,
                email: args?.email,
                token: 5000
            })
            return await ctx.db.get(userId);
        }

        return user[0];
    }
})

export const GetUser = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('UserTable')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();
        return user;
    }
})