import { Id } from "@/convex/_generated/dataModel";

export type Agent = {
    _id: Id<"AgentTable">;
    _creationTime: number;
    name: string;
    agentId: string;
    published: boolean;
    userId: Id<"UserTable">;
    config?: any;
    nodes?: any;
    edges?: any;
    agentToolConfig?: any;
}