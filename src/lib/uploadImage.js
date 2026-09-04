export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData
    });
    const result = await res.json();
    // console.log("uploadImage result:", result);

    if (!result.success) {
        throw new Error(result.message || "Image upload failed");
    }

    return result.url;
};
