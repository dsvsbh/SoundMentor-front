import request from '@/utils/request.js'

// 获取TTS语音列表
export const listVoices = async (requireAuth = false) => {
    try {
        const res = requireAuth ? await request.get('/tts/listVoices') : await request.get('/tts/listVoices');

        if (res.code === '0') {
            return res.data
        } else {
            throw new Error(res.message || '获取语音列表失败');
        }
    } catch (err) {
        console.error("获取语音列表出错！", err.message);
        throw err;
    }
};