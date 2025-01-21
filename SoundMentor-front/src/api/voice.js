import request from "@/utils/request";
import { ElMessage } from "element-plus";
const voiceApi = "/soundlib";

// 获取用户和预设声音样本库声音  
export const getSoundLib = async (data) => {
    const url = '/getSoundLib';
    const requestData = {
        type: data.type,
        current: data.current,
        size: data.size,
        userId: data.userId,
        status: data.status,
        soundName: data.soundName
    };
    try {
        const token = localStorage.getItem("token");
        const response = await request.post(voiceApi + url, requestData, {
            headers: {
                Authorization: token
            }
        });

        if (response.code == "0") {
            console.log("请求成功！")
            return response;
        }

        const data = await response.json();
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
