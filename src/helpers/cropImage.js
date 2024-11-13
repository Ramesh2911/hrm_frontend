export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export default async function getCroppedImg(
    imageSrc,
    crop,
    type
) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (type === "signature") {
        canvas.width = 400;
        canvas.height = 200;
    } else {
        canvas.width = 200;
        canvas.height = 200;
    }

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );
    // As Base64 string
    return canvas.toDataURL("image/webp", 1);
}