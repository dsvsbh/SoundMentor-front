import { getSoundLib, getFavorite, } from "@/api/voice";
const allAudioList = []; // 用于存储所有类型的音频列表  
const userId = localStorage.getItem("userId"); // 获取用户ID

// 文件名格式化函数
const formatFileName = (fileName, maxLength) => {
    if (!fileName) return "内容为空";

    // 如果文件名大于 maxLength，则截断并添加 '...'
    if (fileName.length > maxLength) {
        return `${fileName.slice(0, maxLength)}...`;
    }

    // 如果文件名不足 maxLength，则填充到 maxLength 的占位符（用空格填充）
    return fileName.padEnd(maxLength, " ");
};
const fetchAudioLibrary = async (type) => {
    const data = {
        type,
        current: 1,
        size: 30,
        userId: type === 3 ? undefined : userId
    };

    try {
        const response =
            type === 3 ? await getFavorite(data) : await getSoundLib(data);

        // 格式化音频列表  
        const formattedAudioList = response.data.records.map((audio) => ({
            ...audio,
            soundName: formatFileName(audio.soundName, 10),
            description: formatFileName(audio.description, 30),
            isPlaying: false,
            speed: 1.0,
        }));
        return formattedAudioList;

    } catch (error) {
        console.error(`获取音频类型 ${type} 时发生错误:`, error);
        return []; // 返回一个空数组以避免应用崩溃  
    }
};

