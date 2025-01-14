import request from "@/utils/request";
const voiceApi = "/soundlib";

// 获取声音样本库声音列表
export const getSoundLibList = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await request.post(
            voiceApi + "/getSoundLIST",
            {},
            {
                headers: { Authorization: token },
            }
        );

        if (res.code == 0) {
            console.log("请求成功", res);
            return res;
        } else {
            console.log("请求失败", res);
            return res;
        }
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}

// 是否能添加声音
export const canAddVoice = () => {
    try {
        const token = localStorage.getItem("token");
        const res = request.post(voiceApi + "/canAddSound", {
            header: {
                Authorization: token,
            },
        });
        console.log("请求成功", res);
        return res;
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}

// 获取声音样本库声音    根据id获取声音
export const getSoundLib = (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = request.get(voiceApi + "/getSound", {
            headers: {
                Authorization: token
            },
            params: {
                id: id
            }
        });
        console.log("请求成功", res);
        return res;
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}

// 删除声音样本库声音
export const deleteSoundLib = (idList) => {
    try {

        const token = localStorage.getItem("token");
        const res = request.post(voiceApi + "/deleteSound", {
            headers: {
                Authorization: token
            },
            data: {
                idList: idList
            }
        });
        console.log("请求成功", res);
        return res;
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}
