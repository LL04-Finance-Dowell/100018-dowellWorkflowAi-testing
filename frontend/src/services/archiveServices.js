import { httpArchive } from "../httpCommon/httpCommon"

export const moveItemToArchive = async (itemId, itemType) => {
    const data = {
        item_id: itemId,
        item_type: itemType
    }
    
    return await httpArchive.post("/", data)
}