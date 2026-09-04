import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!file) {
            return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 });
        }

        const imgbbForm = new FormData();
        imgbbForm.append("image", file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API}`, {
            method: "POST",
            body: imgbbForm
        });
        const result = await res.json();
        // console.log("imgbb result:", result);

        if (!result.success) {
            return NextResponse.json({ success: false, message: "Image upload failed" }, { status: 500 });
        }

        return NextResponse.json({ success: true, url: result.data.display_url });
    } catch (error) {
        console.error("upload-image error:", error);
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}
