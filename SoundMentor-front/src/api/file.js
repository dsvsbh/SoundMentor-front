import request from "@/utils/request";


//------------------------------文件上传接口------------------------------
//文件上传接口,任务执行前需要上传文件返回文件地址
// CREATOR和ADMIN角色可以上传文件
export const uploadFileService = async (file) => {
    try {
        const token = localStorage.getItem('token');

        // 检查文件对象是否有效
        if (!file || typeof file !== 'object') {
            throw new Error('Invalid file object');
        }

        // 创建 FormData 对象  
        const formData = new FormData();
        formData.append('file', file);

        // 打印FormData内容，用于调试
        console.log('FormData keys:', [...formData.keys()]);
        console.log('File name:', file.name);
        console.log('File size:', file.size);

        const response = await request.post('/file/upload', formData, {
            headers: {
                'Authorization': token,
                // 移除Content-Type，让axios自动处理
            },
            // 确保axios正确处理FormData
            transformRequest: [function (data, headers) {
                // 不对FormData进行转换
                return data;
            }],
        });
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}