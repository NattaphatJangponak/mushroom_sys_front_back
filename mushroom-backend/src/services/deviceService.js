import db from '../config/db.js';

export const getAllDevicesService = async () => {
    try { 
        const items = await db.device.findMany({
            include: {
                farm: true, // include related farm data
            },
            orderBy: {
                device_id: 'asc', // order by device_id ascending
            },
        });
        return items;
    } catch (error) {
        throw new Error(error.message);
    }
};



export const getDeviceByIdService = async (id) => {
    try {
        const item = await db.device.findUnique({
            where: { device_id: parseInt(id) },
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const createDeviceService = async (data) => {
    try {
        const lastDevice = await db.device.findFirst({
            orderBy: { device_id: 'desc' }
        });

        const newId = lastDevice ? lastDevice.device_id + 1 : 1;

        // Convert farm_id to number if it exists
        const item = await db.device.create({
            data: { 
                ...data, 
                device_id: newId,
                farm_id: data.farm_id ? parseInt(data.farm_id) : null
            },
        });

        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const updateDeviceByIdService = async (id, data) => {
    try {
        // Convert all numeric fields from strings to numbers
        const convertedData = {
            ...data,
            device_id: data.device_id ? parseInt(data.device_id) : undefined,
            farm_id: data.farm_id ? parseInt(data.farm_id) : null
        };

        const item = await db.device.update({
            where: { device_id: parseInt(id) },
            data: convertedData,
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteDeviceByIdService = async (id) => {
    try {
        const item = await db.device.delete({
            where: { device_id: parseInt(id) },
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}
