import db from '../config/db.js';

export const getViewCultivationByDeviceIdService = async (device_id) => {
    try {

        console.log('call here')

        const items = await db.cultivationpot.findMany({
            where: { device_id: parseInt(device_id) },
            include: {
                typepot: {  // ✅ ใช้ชื่อ relation ที่ถูกต้องตาม Prisma schema
                    select: { type_pot_name: true }
                }
            }
        });

        return items;
    } catch (error) {
        throw new Error(error.message);
    }
};

// export const getAllViewCultivationService = async () => {
//     try {
//         const items = await db.cultivationPot.findMany();
//         return items;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }
export const createViewCultivationByIdService = async (data) => {
    try {
        const item = await db.cultivationpot.create({
            data,
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const updateViewCultivationByIdService = async (id, data) => {
    try {
        const item = await db.cultivationpot.update({
            where: { cultivation_pot_id: parseInt(id) }, // ✅ ใช้ `cultivation_pot_id`
            data,
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteViewCultivationByIdService = async (cul_id) => {
    try {
        const item = await db.cultivationpot.delete({
            where: { cultivation_pot_id: parseInt(cul_id) }, // ✅ แก้เป็น `cultivation_pot_id`
        });
        return item;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error("Cultivation not found");
        }
        throw new Error(error.message);
    }
};


export const uploadBase64ImageService = async (cultivation_pot_id, imageBase64) => {
    try {
        const updatedItem = await db.cultivationpot.update({
            where: { cultivation_pot_id: parseInt(cultivation_pot_id) },
            data: { image_base64: imageBase64 },
        });

        return updatedItem;
    } catch (error) {
        throw new Error(error.message);
    }
};


export default db;
