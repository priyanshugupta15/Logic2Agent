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
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            const userId = await ctx.db.insert('UserTable', {
                name: args.name,
                email: args?.email,
                token: 5000,
                lastLoginAt: now,
                sessionExpiresAt: now + twentyFourHours
            })
            return await ctx.db.get(userId);
        }

        // Update existing user's session timestamps
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        await ctx.db.patch(user[0]._id, {
            lastLoginAt: now,
            sessionExpiresAt: now + twentyFourHours
        });

        return await ctx.db.get(user[0]._id);
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

export const UpdateLastLogin = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('UserTable')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();

        if (user) {
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            await ctx.db.patch(user._id, {
                lastLoginAt: now,
                sessionExpiresAt: now + twentyFourHours
            });

            return await ctx.db.get(user._id);
        }

        return null;
    }
})

export const CheckSessionValidity = query({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('UserTable')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();

        if (!user) {
            return { isValid: false, reason: 'User not found' };
        }

        // If sessionExpiresAt is not set (old users), consider session valid
        if (!user.sessionExpiresAt) {
            return { isValid: true, reason: 'Legacy user - no expiration set' };
        }

        const now = Date.now();
        const isValid = now < user.sessionExpiresAt;

        return {
            isValid,
            reason: isValid ? 'Session active' : 'Session expired',
            expiresAt: user.sessionExpiresAt,
            timeRemaining: user.sessionExpiresAt - now
        };
    }
})