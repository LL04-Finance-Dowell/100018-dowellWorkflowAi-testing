import { searchHttpInstance } from "../httpCommon/httpCommon"

export const searchForItem = async (data) => {
    return await searchHttpInstance.post("/", data)
}
