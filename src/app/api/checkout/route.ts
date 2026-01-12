import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Einfache Validierung für Testzwecke
        if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
            return NextResponse.json(
                { success: false, message: "Cart is empty" },
                { status: 400 }
            );
        }

        // Simuliere erfolgreiche Verarbeitung (Mock)
        return NextResponse.json({
            success: true,
            orderId: `ORDER-${Date.now()}`,
            message: "Order placed successfully"
        });
    } catch {
        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
}
