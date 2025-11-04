import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const frameId = searchParams.get("frameId");
    const projectId = searchParams.get("projectId");

    try {
        const frameResult = await db
            .select()
            .from(frameTable)
            .where(eq(frameTable.frameId, frameId!));

        const chatResult = await db
            .select()
            .from(chatTable)
            .where(eq(chatTable.frameId, frameId!));

        const finalResult = {
            ...frameResult[0],
            chatMessages: chatResult[0]?.chatMessages || []
        };

        return NextResponse.json({ finalResult });
    } catch (error) {
        console.error("Error fetching frame:", error);
        return NextResponse.json({ error: "Failed to fetch frame" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { designCode, frameId, projectId } = await req.json();

        console.log("Updating frame:", { frameId, projectId, codeLength: designCode?.length });

        const result = await db
            .update(frameTable)
            .set({
                designCode: designCode,
            })
            .where(
                and(
                    eq(frameTable.frameId, frameId),
                    eq(frameTable.projectId, projectId)
                )
            );

        console.log("Update result:", result);

        return NextResponse.json({
            success: true,
            message: "Design code updated successfully"
        });
    } catch (error) {
        console.error("Error updating frame:", error);
        return NextResponse.json(
            { error: "Failed to update frame" },
            { status: 500 }
        );
    }
}