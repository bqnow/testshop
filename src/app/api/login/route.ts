import { NextResponse } from 'next/server';
import { users } from '@/lib/data';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            return NextResponse.json({
                success: true,
                token: "mock-jwt-token-123456",
                user: { id: user.id, username: user.username }
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
