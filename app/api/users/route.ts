import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();

    // If user already exists
    const userResults = await db
        .select()
        .from(usersTable)
        // @ts-ignore
        .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

    // If not then insert the user
    if (userResults.length === 0) {
        const data = {
            name: user?.fullName ?? "",
            email: user?.primaryEmailAddress?.emailAddress ?? "",
            credits: 5,
        };
        const result = await db.insert(usersTable).values({
            ...data,
        });
        return NextResponse.json({ user: userResults[0] });
    }

    return NextResponse.json({ user: userResults[0] });
}
