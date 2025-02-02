import request from "@/utils/request";
import { ElMessage } from "element-plus";
const voiceApi = "/soundlib";

// 获取用户和预设声音样本库声音  
export const getSoundLib = async (data) => {
    const url = '/getSoundLib';

    try {
        const token = localStorage.getItem("token");
        const response = await request.post(voiceApi + url, data, {
            headers: {
                Authorization: token
            }
        });

        if (response.code == "0") {
            console.log("请求成功！")
            return response;
        }
    } catch (error) {
        console.error('Error fetching sound library:', error);
    }
};
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
            return res;
        } else {
            return res;
        }
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}

// 是否能添加声音
export const canAddVoice = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await request.post(voiceApi + "/canAddSound", {}, {
            headers: {
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

// 获取声音样本库训练过的声音    根据id获取声音
export const getSound = async (id) => {
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
export const deleteSoundLib = async (idList) => {
    try {

        const token = localStorage.getItem("token");
        const res = await request.post(voiceApi + "/delSoundList", idList, {
            headers: {
                Authorization: token
            }
        });
        console.log("请求成功", res);
        return res;
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}

// 分页查询收藏列表
export const getFavorite = async (form) => {
    try {

        const token = localStorage.getItem("token");
        const res = await request.post(voiceApi + "/pageFavorite", form, {
            headers: {
                Authorization: token
            }
        });
        console.log("请求成功", res);
        return res;
    } catch (error) {
        console.log("请求失败", error);
        return error.code;
    }
}

// 添加收藏
export const addFavorite = async (voiceId) => {
    const body = {
        id: voiceId
    }
    try {

        const token = localStorage.getItem("token");
        const res = await request.post(voiceApi + "/addFavorite", body, {
            headers: {
                Authorization: token
            },
        });
        if (res.data == true) {
            console.log("添加成功");
            return res;
        } else {
            console.error("添加失败", res.message);
            return res;
        }
    } catch (error) {
        console.log("出错：", error);
        return error.code;
    }
}

// 取消收藏
export const deleteFavorite = async (voiceId) => {
    const body = {
        id: voiceId
    }
    try {

        const token = localStorage.getItem("token");
        const res = await request.post(voiceApi + "/delFavorite", body, {
            headers: {
                Authorization: token
            },
        });
        if (res.data == true) {
            console.log("取消成功", res);
            return res;
        } else {
            console.error("取消失败", res.message);
            return res;
        }
    } catch (error) {
        console.log("出错：", error.message);
    }
}

// 分页查询训练声音列表
export const getTrainedSoundPageQuery = async (form) => {
    try {
        const token = localStorage.getItem("token");
        const res = await request.post(voiceApi + "/getSoundLIST", form, {
            headers: {
                Authorization: token
            },
        });
        if (res.code === "0") {
            return res;
        } else {
            console.error("获取失败", res.message);
        }
    } catch (error) {
        console.log("获取出错：", error.message);
    }
}