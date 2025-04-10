import db from '../config/db.js';

export const getAllPotTypesService = async () => {
    try {
        const item = await db.typepot.findMany();
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getPotTypeByIdService = async (id) => {
    try {
        const item = await db.typepot.findUnique({
            where: { type_pot_id: parseInt(id) },
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const createPotTypeService = async (data) => {
    try {
        const item = await db.typepot.create({
            data,
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updatePotTypeByIdService = async (id, data) => {
    try {
        const item = await db.typepot.update({
            where: { type_pot_id: parseInt(id) },
            data,
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deletePotTypeByIdService = async (id) => {
    try {
        const item = await db.typepot.delete({
            where: { type_pot_id: parseInt(id) },
        });
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}